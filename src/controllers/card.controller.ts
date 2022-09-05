import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { Card } from "../repositories/cardRepository.js";
import { activateNewCard, createNewCard } from "../services/card.service.js";

export async function createCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const card: Card = req.body;
    
    await createNewCard(apiKey, card);

    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { id, cvc, password } : { id: number, cvc: string, password: string } = req.body;
    
    await activateNewCard(id, cvc, password);

    res.sendStatus(202);
}