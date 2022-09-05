import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { Card } from "../repositories/cardRepository.js";
import { activateNewCard, blokingCard, createNewCard, showCardView } from "../services/card.service.js";

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

export async function cardView(req: Request, res: Response) {
    const { id } = req.params;
    
    const result = await showCardView(parseInt(id));

    res.status(200).send(result);
}

export async function blockCard(req: Request, res: Response) {
    const { id, password }: { id: number, password: string } = req.body;
    
    await blokingCard(id, password);

    res.sendStatus(200);
}