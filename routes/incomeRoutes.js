import express from 'express';
import { addIncome } from '../controllers/incomeControllers.js';
import { getAllIncome } from '../controllers/incomeControllers.js';
import { deleteIncome } from '../controllers/incomeControllers.js';
import { downloadIncomeExcel } from '../controllers/incomeControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add',authMiddleware, addIncome);
router.get('/all',authMiddleware, getAllIncome);
router.delete('/delete/:id', authMiddleware, deleteIncome);
router.get('/download', authMiddleware, downloadIncomeExcel);

export default router;