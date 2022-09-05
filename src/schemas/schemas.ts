import { newCardSchema, activateCardSchema, blockCardSchema } from './card.js'
import { rechargeCardSchema, paymentCardSchema, onlinePaymentCardSchema } from './transaction.js'

const schemas = {
    newCardSchema,
    activateCardSchema,
    blockCardSchema,
    unblockCardSchema: blockCardSchema,
    rechargeCardSchema,
    paymentCardSchema,
    onlinePaymentCardSchema
};

export default schemas;