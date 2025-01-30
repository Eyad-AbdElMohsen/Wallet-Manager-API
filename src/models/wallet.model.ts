import mongoose, { Document, Model } from "mongoose"
import env from "../env"
import { v4 as uuidv4 } from "uuid";

const DB_URL = env.DB_URL
mongoose.connect(DB_URL).then(()=> console.log('mongodb server start'))

const walletSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4},
    walletName: {type: String, required: true, index: true},
    currentBalance: {type: Number, required: true},
    type: {type: String, required: true},
    userId: {type: String, ref: 'User', required: true},
},{
    timestamps: true
})

interface IWallet extends Document { 
    _id: string,
    walletName: string, 
    currentBalance: number, 
    type: string,
    userId: string
}

export const Wallet: Model<IWallet> = mongoose.model<IWallet>('Wallet', walletSchema);