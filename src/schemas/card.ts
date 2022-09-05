import Joi from 'joi';

export const newCardSchema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().trim().valid('education', 'groceries', 'restaurant', 'transport', 'health').required()
});