import Joi from 'joi';

export const rechargeCardSchema = Joi.object({
    amount: Joi.number().min(1).required(),
});

export const paymentCardSchema = Joi.object({
    cardId: Joi.number().required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1).required(),
    password: Joi.string().required()
});

export const onlinePaymentCardSchema = Joi.object({
    number: Joi.string().required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string().required(),
    securityCode: Joi.string().required(),
    businessId: Joi.number().required(),
    amount: Joi.number().min(1).required()
});