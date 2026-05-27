import express from 'express';
import Expense from '../models/Expense.js';
import XLSX from 'xlsx';
import sendEmail from '../utils/sendEmail.js';
import Budget from '../models/Budget.js';
import User from '../models/User.js';

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const addExpense = async(req,res) => {
    const userId = req.user.id;
    const {amount,category,icon,date} = req.body;
    const user = await User.findById(userId);

    if(!category ||!amount || !date){
        return res.status(400).json({message:'Please fill all the fields'});
    }
    try {
        const expense = new Expense({
            userId,
            amount,
            category,
            icon,
            date: new Date(date)
        });
        await expense.save();
        const expenseDate = new Date(date);
        const currentMonth = months[expenseDate.getMonth()];
        const budget = await Budget.findOne({user:userId, month: currentMonth});
        console.log(budget);
        if(budget){
            budget.spent += Number(amount);
            const percentage = (budget.spent/budget.amount)*100;
            console.log("Spent:", budget.spent);
            console.log("Budget Amount:", budget.amount);
            console.log("Percentage:", percentage);
            console.log("warningSent:", budget.warningSent);
            
            if(percentage >=100 && budget.exceededSent === false){
            console.log("Sending exceeded email...");
            await sendEmail(user.email, 'Budget Exceeded', `You have exceeded your budget for this month.`);
            budget.exceededSent = true;
        } else if(percentage >=80 && budget.warningSent === false){
            console.log("Sending warning email...");
            await sendEmail(user.email, 'Budget Warning', `You have used ${percentage.toFixed(2)}% of your budget for this month.`);
            budget.warningSent = true;
        }
        await budget.save();
            
        }
        

        return res.status(201).json({message: 'Expense added successfully'});
    } catch (error) {
         console.error(error);

    return res.status(500).json({
        message: 'Error adding expense'
    });
    }
  
}

export const getAllExpense = async(req,res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        return res.json(expense);
    } catch (error) {
        return res.status(500).json({message: 'Error fetching expenses'});
    }
  
}

export const deleteExpense = async(req,res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
        const deletedExpense = await Expense.findOneAndDelete({_id: expenseId, userId:userId});
        if(!deletedExpense){
            return res.status(404).json({message: 'Expense not found'});
        }

        const currentMonth = new Date().getMonth();
        const budget = await Budget.findOne({userId, month: currentMonth});
        if(budget){
            budget.spent = budget.spent - deletedExpense.amount;
            await budget.save();
            
        }

        return res.json({message: 'Expense deleted successfully'});

    } catch (error) {
        return res.status(500).json({message: 'Error deleting expense'});
    }
  
}

export const downloadExpenseExcel = async(req,res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
             Date: new Date(item.date).toLocaleDateString(),
        }));

        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

        XLSX.writeFile(wb, 'expenses.xlsx');

        return res.download('expenses.xlsx');

    } catch (error) {
        console.log(error); // ADD THIS
        return res.status(500).json({ message: 'Error generating Excel file' });
    }
}



