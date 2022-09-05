import { Router } from "express"
import { onlinePaymentCard, paymentCard, rechargeCard } from "../controllers/transaction.controller.js";
import { APIKeyValidation } from "../middlewares/APIKeyValidation.middleware.js";
import schemaValidator from "../middlewares/schemaValidator.middleware.js";


const router = Router();

router.post("/recharge/:id", APIKeyValidation, schemaValidator('recharge card'), rechargeCard);
router.post("/payment", schemaValidator('payment card'), paymentCard);
router.post("/online-payment", schemaValidator('online payment card'), onlinePaymentCard);

export default router;