import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { payByCard, rechargingCard } from "../services/transaction.service.js";

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