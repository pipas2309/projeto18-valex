import { Request, Response, NextFunction } from "express";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    console.log('\n Erro na API - Pego pelo "errorHandler"\n\nO Erro foi:\n' + error);

    if(error.type === 'conflict') {
        return res.sendStatus(409);
    }

    if(error.type === 'not_found') {
        return res.sendStatus(404);
    }

    if(error.type === 'unauthorized') {
        return res.sendStatus(401);
    }

    return res.sendStatus(500);
}