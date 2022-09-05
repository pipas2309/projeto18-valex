import Joi from 'joi';

export const newCardSchema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().trim().valid('education', 'groceries', 'restaurant', 'transport', 'health').required()
});

export const activateCardSchema = Joi.object({
    id: Joi.number().required(),
    cvc: Joi.string().required(),
    password: Joi.string().required()
});

export const blockCardSchema = Joi.object({
    id: Joi.number().required(),
    password: Joi.string().required()
});