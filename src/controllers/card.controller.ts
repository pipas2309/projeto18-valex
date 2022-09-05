import { Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";
import { Card } from "../repositories/cardRepository.js";
import { createNewCard } from "../services/card.service.js";

export async function createCard(req: Request, res: Response) {
    const apiKey: string = res.locals.apiKey
    const card: Card = req.body;
    
    const createdCard = await createNewCard(apiKey, card);

    res.sendStatus(201);
}