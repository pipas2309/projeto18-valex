import { Router } from "express";

import cardRouter from './card.router.js';

const router = Router();

router.use(cardRouter);

export default router;