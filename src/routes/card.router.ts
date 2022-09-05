import { Router } from "express"
import { activateCard, cardView, createCard } from "../controllers/card.controller.js";
import { APIKeyValidation } from "../middlewares/APIKeyValidation.middleware.js";
import schemaValidator from "../middlewares/schemaValidator.middleware.js";


const router = Router();

router.post("/create-card", APIKeyValidation, schemaValidator('new card'), createCard);
router.post("/activate-card", schemaValidator('activate card'), activateCard);
router.get("/card-view/:id", cardView);

export default router;