import express from 'express';
import { groupExpenseMonth, predictExpense, monthlyExpenseCategory, callGemini } from '../services/predictionService.js';



export const getPrediction = async(req,res) => {
    const userId = req.user.id;
    try {
        const monthlyExpense = await groupExpenseMonth(userId);
        const prediction = await predictExpense(userId, monthlyExpense);
        const categoryData = await monthlyExpenseCategory(userId);
        const prompt = `Based on the user's monthly expenses, which are as follows: ${JSON.stringify(monthlyExpense)}, the predicted expense for the next month is ${prediction}. The category-wise breakdown of expenses for each month is as follows: ${JSON.stringify(categoryData)}.Based on ${JSON.stringify(categoryData)}, predict the next month's category-wise expenses. Please provide insights and suggestions to help the user manage their finances better.`;
        const geminiResponse = await callGemini(prompt);
        res.json({ prediction, categoryData, geminiResponse });
    } catch (error) {
        console.error("Error fetching prediction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}