import express from 'express';
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import mongoose from "mongoose";

export const getDashboardData = async(req,res) => {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const todayDate = new Date();
    const sixtydaysAgo = new Date();
    sixtydaysAgo.setDate(todayDate.getDate() - 60);

    try {
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpense = await Expense.aggregate([
            {$match: {userId: userObjectId} },
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const last60daysIncome = await Income.find({
            userId: userObjectId,
            date: {$gte: new Date(sixtydaysAgo)},
            
        }).sort({date: -1});

        const last60daysExpense = await Expense.find({
            userId: userObjectId,
            date: {$gte: new Date(sixtydaysAgo)},
            category: {$ne: 'Transfer'}
        }).sort({date: -1});

        const incomelast60days = await Income.aggregate([
            {$match: {userId: userObjectId, date: {$gte: sixtydaysAgo}}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const expenselast60days = await Expense.aggregate([
            {$match: {userId: userObjectId, date: {$gte: sixtydaysAgo}}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const incomes = await Income.find({userId: userObjectId}).sort({date: -1}).limit(5);
        const expenses = await Expense.find({userId: userObjectId}).sort({date: -1}).limit(5);

        const incomeWithType = incomes.map(item =>({...item.toObject(), type: 'income',title: item.source}));
        const expenseWithType = expenses.map(item =>({...item.toObject(), type: 'expense',title: item.category}));

        const recentTransactions = [...incomeWithType, ...expenseWithType];
        recentTransactions.sort((a,b) => new Date(b.date) - new Date(a.date));

        const last5transactions = recentTransactions.slice(0,5);
        

        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last60DaysExpenses: {
                total: expenselast60days[0]?.total || 0,
                transactions: last60daysExpense,
            },
            last60DaysIncome: {
                total:  incomelast60days[0]?.total || 0,
                transactions: last60daysIncome,
            },
            recentTransactions: last5transactions,
        });

        

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error fetching dashboard data'});
        
    }
  
}
