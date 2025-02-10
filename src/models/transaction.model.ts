import mongoose, { Document, Model } from "mongoose"
import env from "../env"
import { transactionTypeSchema, categories, transactionTypes, categorySchema } from "../utils/transactionType"
import { v4 as uuidv4 } from "uuid";
import { z } from 'zod'

const DB_URL = env.DB_URL
mongoose.connect(DB_URL).then(()=> console.log('mongodb server start'))

const transactionSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4},
    walletId: {type: String, ref: 'Wallet', required: true},
    userId: {type: String, ref: 'User', required: true},
    type: { 
        type: String, 
        enum: Object.values(transactionTypes), 
        required: true 
    },
    category: { 
        type: String, 
        enum: Object.values(categories),
        required: true 
    },
    amount: { type: Number, required: true }
},{
    timestamps: true
});

type CategoryKeys = keyof typeof categories;
type TransactionTypeKeys = keyof typeof transactionTypes;

export interface ITransaction extends Document{
    _id: string;
    walletId: string;
    userId: string;
    type: TransactionTypeKeys;
    category: CategoryKeys;
    amount: number;
}


export const createTransactionBody = z.object({
    type: transactionTypeSchema,
    category: categorySchema,
    amount: z.number().positive(
        'Amount must be positive. Use type "debit" for deductions.'
    )
})

export const createTransactionAllData = createTransactionBody.extend({
    walletId: z.string(),
    userId: z.string(),
})

export const getTransactionIdParam = z.object({
    transactionId: z.string()
})


export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);