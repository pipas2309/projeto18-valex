import { Router } from "express"
import { rechargeCard } from "../controllers/transaction.controller.js";
import { APIKeyValidation } from "../middlewares/APIKeyValidation.middleware.js";
import schemaValidator from "../middlewares/schemaValidator.middleware.js";


const router = Router();

router.post("/recharge/:id", APIKeyValidation, schemaValidator('recharge card'), rechargeCard);
router.post("/payment", schemaValidator('payment card'));

export default router;