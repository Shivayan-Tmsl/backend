import express from 'express';
import Income from '../models/Income.js';
import User from '../models/User.js';
import XLSX from 'xlsx';

export const addIncome = async(req,res) => {
    const userId = req.user.id;
    const {amount,source,icon,date} = req.body;
    if(!source ||!amount || !date){
        return res.status(400).json({message:'Please fill all the fields'});
    }
    try {
        const income = new Income({
            userId,
            amount,
            source,
            icon,
            date: new Date(date)
        });
        await income.save();
        return res.status(201).json({message: 'Income added successfully'});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }

  
}

export const getAllIncome = async(req,res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        console.log(income);
        return res.json(income);
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
        
    }
  
}

export const deleteIncome = async(req,res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;
    try {
        const deletedIncome = await Income.findOneAndDelete({_id: incomeId, userId:userId});
        if(!deletedIncome){
            return res.status(404).json({message: 'Income not found'});
        }
        return res.json({message: 'Income deleted successfully'});

    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
  
}

export const downloadIncomeExcel = async(req,res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({date: -1});
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: new Date(item.date).toLocaleDateString(),

        }));
        const wb = XLSX.utils.book_new(); //create a new workbook
        const ws = XLSX.utils.json_to_sheet(data); //convert data to worksheet
        XLSX.utils.book_append_sheet(wb, ws, 'Income'); //add worksheet to workbook
        XLSX.writeFile(wb, 'income.xlsx'); //write workbook to file
        res.download('income.xlsx'); //download the file
        
    } catch (error) {
        res.status(500).json({message: "Error downloading income details."});
    }
  
}



