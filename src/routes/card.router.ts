import { Router } from "express"
import { activateCard, createCard } from "../controllers/card.controller.js";
import { APIKeyValidation } from "../middlewares/APIKeyValidation.middleware.js";
import schemaValidator from "../middlewares/schemaValidator.middleware.js";


const router = Router();

router.post("/create-card", APIKeyValidation, schemaValidator('new card'), createCard);
router.post("/activate-card", schemaValidator('activate card'), activateCard);

export default router;