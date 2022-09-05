import { Router } from "express";

import cardRouter from './card.router.js';
import transactionRouter from './transaction.router.js';

const router = Router();

router.use(cardRouter);
router.use(transactionRouter);

export default router;