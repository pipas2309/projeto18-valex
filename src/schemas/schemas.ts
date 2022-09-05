import { newCardSchema, activateCardSchema, blockCardSchema } from "./card.js"

const schemas = {
    newCardSchema,
    activateCardSchema,
    blockCardSchema,
    unblockCardSchema: blockCardSchema
};

export default schemas;