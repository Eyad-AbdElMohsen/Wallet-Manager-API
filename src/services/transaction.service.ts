import mongoose from "mongoose";
import ApiError from "../errors/api.error";
import { ApiFeatures } from "../utils/ApiFeatures";
import { z } from 'zod'
import { IWallet } from "../models/wallet.model";
import { transactionTypes } from "../utils/transactionType";
import { createTransactionAllData } from "../schemas/transaction.schema";
import { ITransaction, Transaction } from "../models/transaction.model";
import { getTransactionsQuerySchema } from "../schemas/transaction.schema";


export const createNewTransaction = async(data: z.infer<typeof createTransactionAllData>, wallet: IWallet) => {
    const { type, amount } = data;

    // Ensure wallet has enough balance for debit transactions
    if (type === transactionTypes.debit && wallet.currentBalance < amount) {
        throw new ApiError('This wallet does not have enough funds for this transaction', 403);
    }
    
    const adjustmentFactor = type === transactionTypes.credit ? 1 : -1;
    const newTransaction = new Transaction(data)
    wallet.currentBalance += adjustmentFactor * amount;

    // Start a database session for ACID compliance
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const option = { session }

        await wallet.save(option)
        await newTransaction.save(option)

        session.commitTransaction() // Commit changes if successful
    }catch(err) {
        console.log('session error is :::: ' + err)
        session.abortTransaction() // Rollback if an error occurs
        throw new ApiError('Internal server error', 500)
    }
    return newTransaction
}

export const getTransactionHistory = async(walletId: string, queryObject: z.infer<typeof getTransactionsQuerySchema>) => {
    const features = new ApiFeatures<ITransaction & Document>(Transaction.find({ walletId }), queryObject)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
    const transactions = await features.query;

    if(!transactions || !transactions.length)
        throw new ApiError('This wallet does not have any transactions yet with these filters', 404)

    return transactions
}


export const getTransactionById = async(id: string) => {
    const transaction = await Transaction.findById(id)

    if(!transaction)
        throw new ApiError('This transaction id is invalid', 404)

    return transaction
}