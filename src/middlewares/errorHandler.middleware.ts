import { Request, Response, NextFunction } from "express";
import { CustomError } from "../models/customError.model";

export function errorHandler(error: TypeError | CustomError, req: Request, res: Response, next: NextFunction) {
    console.log('\n Erro na API - Pego pelo "errorHandler"\n\nO Erro foi:\n' + error);

    if(error.message === 'conflict') {
        return res.sendStatus(409);
    }

    if(error.message === 'not_found') {
        return res.sendStatus(404);
    }

    if(error.message === 'unauthorized') {
        return res.sendStatus(401);
    }

    return res.sendStatus(500);
}

//Usage: throw new CustomError('Nada foi encontrado!', 404, 'Ou foram duendes ou você vai ter que fazer melhor');
//[...] errorHandler(error: ANY, [...])  Essa é uma opção válida.