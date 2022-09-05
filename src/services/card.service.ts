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

    const newCard = {
        employeeId: card.employeeId,
        number: faker.finance.creditCardNumber('####-####-####-####'),
        cardholderName: abreviateName(employee.fullName),
        securityCode: cryptr.encrypt(faker.finance.creditCardCVV()),
        expirationDate: dayjs().add(5, 'years').format('MM/YY'),
        //password,
        isVirtual: false,
        //originalCardId,
        isBlocked: false,
        type: card.type,
      }

    await insert(newCard);

    return;
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