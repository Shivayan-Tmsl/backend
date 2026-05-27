import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

//signup

router.post('/signup', async(req,res) => {
    try {
    const {name,email,password} = req.body;
    const existing = await User.findOne({email});
    if(existing){
        return res.status(400).json({message: 'User already exists'});
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({name,email,password: hashed});
    return res.json({success: true, message: 'User created successfully'});
        
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
    
});

//login

router.post('/login', async(req,res) =>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        return res.json({success: true, token,user});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router