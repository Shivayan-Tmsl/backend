import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    date: {type: Date, default: Date.now},
},{ timestamps: true });

export default mongoose.model('Income', IncomeSchema);