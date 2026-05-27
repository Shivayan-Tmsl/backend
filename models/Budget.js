import mongoose from 'mongoose';


const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount:{
        type:Number,
        required:true
    },
    spent:{
        type:Number,
        default:0
    },
    month:{
        type:String,
        required:true
    },
    warningSent:{
        type:Boolean,
        default:false
    },
    exceededSent:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
