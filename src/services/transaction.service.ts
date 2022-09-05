//import { CustomError } from "../models/customError.model.js";
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import { Card, findByTypeAndEmployeeId, insert } from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { abreviateName } from '../utils/abreviateName.util.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

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