//import { CustomError } from "../models/customError.model.js";
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import { Card, findByTypeAndEmployeeId, insert } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { abreviateName } from '../utils/abreviateName.util.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

dayjs.extend(customParseFormat)

export async function createNewCard(apiKey: string, card: Card) {
    const company = await findByApiKey(apiKey);
    const employee = await findById(card.employeeId);
    const employeeCardType = await findByTypeAndEmployeeId(card.type, card.employeeId)

    //problema com promise catch error
    if(!company) {
        console.log('\n ERRO \nCompania n existe\n')
        return
    }

    if(!employee) {
        console.log('\n ERRO \nFuncionario n existe\n')
        return
    }

    if(employeeCardType) {
        console.log('\n ERRO \ncartao igual\n')
        return
    }

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);
    const cvc = faker.finance.creditCardCVV()

    const newCard = {
        employeeId: card.employeeId,
        number: faker.finance.creditCardNumber('####-####-####-####'),
        cardholderName: abreviateName(employee.fullName),
        securityCode: cryptr.encrypt(cvc),
        expirationDate: dayjs().add(5, 'years').format('MM/YY'),
        //password,
        isVirtual: false,
        //originalCardId,
        isBlocked: false,
        type: card.type,
      }

    await insert(newCard);

    const cardId = await cardRepository.findByTypeAndEmployeeId(card.type, card.employeeId)

    return {
        cardId: cardId.id, 
        number: cardId.number,
        cardholderName: cardId.cardholderName,
        securityCode: cvc,
        expirationDate: cardId.expirationDate
    };
}

export async function activateNewCard(id: number, cvc: string, password: string) {
    const card = await cardRepository.findById(id);

    if(password.length !== 4 || isNaN(parseInt(password))) {
        console.log('\n ERRO \nSenha inválida\n');
        return
    }

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    if(card.password) {
        console.log('\n ERRO \nCartão já ativado\n')
        return
    }

    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n')
        return
    }

    //Para saber o código de segurança e fazer os testes
    console.log(cryptr.decrypt(card.securityCode))

    if(cvc !== cryptr.decrypt(card.securityCode)) {
        console.log('\n ERRO \nCódigo de segurança inválido\n')
        return
    }


    const bcryptSalt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, bcryptSalt);

    await cardRepository.update(id, { password: encryptedPassword });


    return;
}

export async function showCardView(id: number): Promise<{
    balance: number,
    transactions: {}[],
    recharges: {}[]
}>  {
    const card = await cardRepository.findById(id);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    const cardInfo = {
        balance: 0,
        transactions: [],
        recharges: []
    }

    const rechardes = await rechargeRepository.findByCardId(id);
    const payments = await paymentRepository.findByCardId(id);

    //da pra refatorar e deixar tudo numa query só
    for(let i = 0; i < rechardes.length; i++) {
        cardInfo.balance += rechardes[i].amount;
        cardInfo.recharges.push(rechardes[i])
    }
    for(let i = 0; i < payments.length; i++) {
        cardInfo.balance -= payments[i].amount;
        cardInfo.transactions.push(payments[i])
    }

    return cardInfo;
}

export async function blokingCard(id: number, password: string) {
    const card = await cardRepository.findById(id);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');
    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n');
        return;
    }

    if(card.isBlocked) {
        console.log('\n ERRO \nCartão já está bloqueado\n');
        return;
    }

    const valid = await bcrypt.compare(password, card.password || '');

    if(!valid) {
        console.log('\n ERRO \nSenha incorreta\n');
        return;
    }

    await cardRepository.update(id, {isBlocked: true});

    return;
}

export async function unblokingCard(id: number, password: string) {
    const card = await cardRepository.findById(id);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');
    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n');
        return;
    }

    if(!card.isBlocked) {
        console.log('\n ERRO \nCartão já está desbloqueado\n');
        return;
    }

    const valid = await bcrypt.compare(password, card.password || '');

    if(!valid) {
        console.log('\n ERRO \nSenha incorreta\n');
        return;
    }

    await cardRepository.update(id, {isBlocked: false});

    return;
}