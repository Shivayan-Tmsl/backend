import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    date: {type: Date, default: Date.now},
},{ timestamps: true });

export default mongoose.model('Expense', ExpenseSchema);