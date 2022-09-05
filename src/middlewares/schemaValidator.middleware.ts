import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

import schemas from "../schemas/schemas.js";
import { CustomError } from "../models/customError.model.js";


function schemaValidator(whichSchema: string) {
    
    return (req: Request, _res: Response, next: NextFunction) => {
        const data = req.body;

        let validate: Joi.ValidationResult<any>;

        if(whichSchema === 'new card') {
            validate = schemas['newCardSchema'].validate(data, { abortEarly: false });
        }

        if(whichSchema === 'activate card') {
            validate = schemas['activateCardSchema'].validate(data, { abortEarly: false });
        }

        if(whichSchema === 'block card') {
            validate = schemas['blockCardSchema'].validate(data, { abortEarly: false });
        }

        if(whichSchema === 'unblock card') {
            validate = schemas['unblockCardSchema'].validate(data, { abortEarly: false });
        }

        if(validate.error || validate === undefined) {
            throw new CustomError(
                `Entidade não processável ('${whichSchema}')!`, 
                422, 
                `Nossa bola de cristal quebrou, você precisa se esforçar mais na requisição do(s)${validate.error.details.map(value => ' ' + value.context.key)}!`
                );
        }

        next();
    }
}

export default schemaValidator;