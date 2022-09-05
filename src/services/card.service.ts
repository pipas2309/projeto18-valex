//import { CustomError } from "../models/customError.model.js";
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';

import { Card, findByTypeAndEmployeeId, insert } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { abreviateName } from '../utils/abreviateName.util.js';

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