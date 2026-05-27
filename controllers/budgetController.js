import express from 'express';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const setBudget = async(req,res) => {
    try {
    const userId = req.user.id;
    const {amount,month} = req.body;
    const user = await User.findById(userId);
    if(!amount || !month){
        return res.status(400).json({message:'Please fill all the fields'});
    }

    const budget = await Budget.findOne({user: userId, month})

    if(budget){
        budget.amount = amount;
        await budget.save();
        return res.json(budget);
    }

    const expenses = await Expense.find({userId})
    let totalSpent = 0;

    expenses.forEach(expense =>{
        const expenseMonth =
              new Date(expense.date).toLocaleString(
                 'default',
                 { month: 'long' }
              );
        if(expenseMonth === month){
            totalSpent += expense.amount;
        }
    })

    let warningSent = false;
    let exceededSent = false;
    const percentage = (totalSpent / amount) * 100;
    if(percentage >= 100){
         console.log("Sending exceeded email...");
                    await sendEmail(user.email, 'Budget Exceeded', `You have exceeded your budget for this month.`);
                    exceededSent = true;
    }else if(percentage>=80){
         console.log("Sending warning email...");
        await sendEmail(user.email, 'Budget Warning', `You have used ${percentage.toFixed(2)}% of your budget for this month.`);
        warningSent = true;
    }

    const newBudget = await Budget.create({
        user: userId,
        amount,
        month,
        spent: totalSpent,
        warningSent,
        exceededSent
    });

    await newBudget.save();
    return res.json(newBudget);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}
