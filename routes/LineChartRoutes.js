import express from 'express';
import { groupExpenseMonth, predictExpense, monthlyExpenseCategory } from '../services/predictionService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/line-chart-data', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const monthlyExpense = await groupExpenseMonth(userId);
        const prediction = await predictExpense(userId, monthlyExpense);

        console.log(monthlyExpense);
        res.json({ monthlyExpense, prediction, message: "Line chart data fetched successfully" });
        
    } catch (error) {
        console.error("Error fetching line chart data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;