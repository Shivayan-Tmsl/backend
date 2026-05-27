import express from 'express';
import { addExpense } from '../controllers/expenseControllers.js';
import { getAllExpense } from '../controllers/expenseControllers.js';
import { deleteExpense } from '../controllers/expenseControllers.js';
import { downloadExpenseExcel } from '../controllers/expenseControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addExpense);
router.get('/all', authMiddleware, getAllExpense);
router.delete('/delete/:id', authMiddleware, deleteExpense);
router.get('/download', authMiddleware, downloadExpenseExcel);

export default router;