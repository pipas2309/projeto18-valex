import { Router } from "express"
import { createCard } from "../controllers/card.controller.js";
import { APIKeyValidation } from "../middlewares/APIKeyValidation.middleware.js";
import schemaValidator from "../middlewares/schemaValidator.middleware.js";


const router = Router();

router.post("/create-card", APIKeyValidation, schemaValidator('new card'), createCard);

export default router;