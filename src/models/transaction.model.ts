import mongoose, { Document, InferSchemaType, Model } from "mongoose"
import env from "../env"
import {  categories, transactionTypes } from "../utils/transactionType"
import { v4 as uuidv4 } from "uuid";

const DB_URL = env.DB_URL
mongoose.connect(DB_URL).then(()=> console.log('mongodb server start'))

const transactionSchema = new mongoose.Schema(
    {
        _id: { type: String, default: uuidv4 },
        walletId: { type: String, ref: "Wallet", required: true },
        userId: { type: String, ref: "User", required: true },
        type: { type: String, enum: Object.values(transactionTypes), required: true },
        category: { type: String, enum: Object.values(categories), required: true },
        amount: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export type ITransaction = InferSchemaType<typeof transactionSchema> & Document;

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);