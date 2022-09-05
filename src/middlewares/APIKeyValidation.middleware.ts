import { NextFunction, Request, Response } from "express";
import { CustomError } from "../models/customError.model.js";

export function APIKeyValidation(req: Request, res: Response, next: NextFunction) {
    const { 'x-api-key': apiKey } = req.headers;
    res.locals.apiKey = apiKey;

    if(!apiKey) {
        throw new CustomError(
            'Autorização inválida!', 
            401, 
            'Vamos, você consegue mandar o headers direitinho, confia!'
            );
    }

    next();
}