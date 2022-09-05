import { newCardSchema, activateCardSchema, blockCardSchema } from "./card.js"
import { rechargeCardSchema, paymentCardSchema } from "./transaction.js"

const schemas = {
    newCardSchema,
    activateCardSchema,
    blockCardSchema,
    unblockCardSchema: blockCardSchema,
    rechargeCardSchema,
    paymentCardSchema
};

export default schemas;