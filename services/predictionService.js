import express from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export const groupExpenseMonth = async(userId) => {
    const monthlyExpense = {};//this is an object not an array. It stores data as key value pair. The key is the month and the value is the total expense for that month.
    try {
        const expense = await Expense.find({userId});
        expense.forEach((item) =>{
            const month = item.date.getMonth() + 1; // Get month (0-11) and add 1 to make it 1-12
            if(monthlyExpense[month]){
                monthlyExpense[month] += item.amount;
            } else {
                monthlyExpense[month] = item.amount;
            }
        })

        return monthlyExpense;
    } catch (error) {
        console.error("Error grouping expenses by month:", error);
    }
  
}

export const predictExpense = async(userId,monthlyExpense) => {
    try {
        const values = Object.values(monthlyExpense);//convert into array 
        if(values.length < 3){
            throw new Error("Not enough data to predict future expenses. At least 3 months of data is required.");
        }
        const last = values[(values.length) - 1];
        const secondlast = values[(values.length) - 2];
        const thirdlast = values[(values.length) - 3];

        const prediction = (0.5 * last) + (0.3 * secondlast) + (0.2 * thirdlast);

        return prediction;
        
    } catch (error) {
        console.error("Error predicting expense:", error);
    }
  
}

export const monthlyExpenseCategory =async (userId) => {
    const data = await Expense.aggregate([
        { $match: {userId: new mongoose.Types.ObjectId(userId)}},
        { $addFields: {month: {$dateToString: { format: "%Y-%m", date: "$date" }}}}, // Extract month from date
        {$group: {_id: {month: "$month", category: "$category"}, totalAmount: {$sum: "$amount"}}}, // Group by month and category, and sum the amounts
        {$group: {_id: "$_id.month", categories: {$push: {category: "$_id.category", totalAmount: "$totalAmount"}}}}, // Group by month and push category totals into an array
        {
            $sort: {_id: 1} // Sort by month in ascending order
        }

    ])

    return data;
}

export const callGemini = async (prompt) => {
    try {

        const response = await fetch(
            `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        

        if (!data.candidates) {
            throw new Error(data.error?.message || "No response from Gemini");
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
    }
};

