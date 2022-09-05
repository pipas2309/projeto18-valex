import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { onlinePayByCard, payByCard, rechargingCard } from "../services/transaction.service.js";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const { id } = req.params;
    const { amount }: { amount: number } = req.body
    
    await rechargingCard(apiKey, parseInt(id), amount);

    res.sendStatus(200);
}

export async function paymentCard(req: Request, res: Response) {
    const { cardId, businessId, amount, password } : 
        {cardId: number, businessId: number, amount: number, password: string} = req.body;
    
    await payByCard(cardId, businessId, amount, password);

    res.status(202).send('Vai!!! GASTA MAIS! No fim do mês alguém te ajuda, confia!');
}

export async function onlinePaymentCard(req: Request, res: Response) {
    const { number, cardholderName, expirationDate, securityCode, businessId, amount } : 
        { number: string, cardholderName: string, expirationDate: string, securityCode: string, businessId: number, amount: number } = req.body;
    
    await onlinePayByCard(number, cardholderName, expirationDate, securityCode, businessId, amount);

    res.status(200).send('Compra online feita com sucesso!');
}