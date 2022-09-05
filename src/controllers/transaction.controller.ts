import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { Card } from "../repositories/cardRepository.js";
import { rechargingCard } from "../services/transaction.service.js";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const { id } = req.params;
    const { amount }: { amount: number } = req.body
    
    await rechargingCard(apiKey, parseInt(id), amount);

    res.sendStatus(201);
}

// export async function paymentCard(req: Request, res: Response) {
//     const { id, cvc, password } : { id: number, cvc: string, password: string } = req.body;
    
//     await activateNewCard(id, cvc, password);

//     res.sendStatus(202);
// }