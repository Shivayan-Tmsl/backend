import express from 'express';
import Budget from '../models/Budget.js';
import { setBudget } from '../controllers/budgetController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/set', authMiddleware, setBudget);

export default router;