//import { CustomError } from "../models/customError.model.js";
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as businessRepository from '../repositories/businessRepository.js'
import { showCardView } from './card.service.js';

dayjs.extend(customParseFormat);

export async function rechargingCard(apiKey: string, id: number, amount: number) {
    const company = await companyRepository.findByApiKey(apiKey);

    //problema com promise catch error
    if(!company) {
        console.log('\n ERRO \nCompania n existe\n')
        return
    }

    const card = await cardRepository.findById(id);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    if(!card.password) {
        console.log('\n ERRO \nCartão não está ativo\n');
        return;
    }

    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');
    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n');
        return;
    }

    await rechargeRepository.insert({ cardId: id, amount})

    return;
}

export async function payByCard(cardId: number, businessId: number, amount: number, password: string) {
    const card = await cardRepository.findById(cardId);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    if(!card.password) {
        console.log('\n ERRO \nCartão não está ativo\n');
        return;
    }

    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');
    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n');
        return;
    }

    if(card.isBlocked) {
        console.log('\n ERRO \nCartão está bloqueado\n');
        return;
    }

    const valid = await bcrypt.compare(password, card.password || '');

    if(!valid) {
        console.log('\n ERRO \nSenha incorreta\n');
        return;
    }

    const business = await businessRepository.findById(businessId);

    if(!business) {
        console.log('\n ERRO \nEstabelecimento não cadastrado\n');
        return;
    }

    if(card.type !== business.type) {
        console.log('\n ERRO \nCara, crachá, querido. Esse estabelecimento não é para esse tipo de cartão\n');
        return;
    }

    const { balance } = await showCardView(cardId);

    if(amount > balance) {
        console.log('\n ERRO \nEntão, tem que ter dinheiro pra comprar as coisinhas\n');
        return;
    }
    await paymentRepository.insert({ cardId, businessId, amount });

    return;
}

export async function onlinePayByCard(number: string, cardholderName: string, expirationDate: string, securityCode: string, businessId: number, amount: number) {
    const card = await cardRepository.findByCardDetails(number, cardholderName, expirationDate);

    if(!card) {
        console.log('\n ERRO \nCartão não encontrado\n');
        return;
    }

    if(!card.password) {
        console.log('\n ERRO \nCartão não está ativo\n');
        return;
    }

    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    //Para saber o código de segurança e fazer os testes
    console.log(cryptr.decrypt(card.securityCode))

    if(securityCode !== cryptr.decrypt(card.securityCode)) {
        console.log('\n ERRO \nCódigo de segurança inválido\n')
        return
    }
    const cardExpired = dayjs().isAfter(dayjs(card.expirationDate, 'MM/YY'), 'month');
    
    //problema com promise catch error
    if(cardExpired) {
        console.log('\n ERRO \nCartão já está expirado\n');
        return;
    }

    if(card.isBlocked) {
        console.log('\n ERRO \nCartão está bloqueado\n');
        return;
    }

    const business = await businessRepository.findById(businessId);

    if(!business) {
        console.log('\n ERRO \nEstabelecimento não cadastrado\n');
        return;
    }

    if(card.type !== business.type) {
        console.log('\n ERRO \nCara, crachá, querido. Esse estabelecimento não é para esse tipo de cartão\n');
        return;
    }

    const { balance } = await showCardView(card.id);

    if(amount > balance) {
        console.log('\n ERRO \nEntão, tem que ter dinheiro pra comprar as coisinhas\n');
        return;
    }
    await paymentRepository.insert({ cardId: card.id, businessId, amount });

    return;
}