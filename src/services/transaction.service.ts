import mongoose from "mongoose";
import ApiError from "../errors/api.error";
import { createTransactionAllData, ITransaction, Transaction } from "../models/transaction.model";
import { IWallet } from "../models/wallet.model";
import ApiFeatures from "../utils/ApiFeatures";
import { z } from 'zod'
import { transactionTypes } from "../utils/transactionType";
import { getTransactionsQuerySchema } from "../schemas/transaction.schema";


export const createNewTransaction = async(data: z.infer<typeof createTransactionAllData>, wallet: IWallet) => {
    //checking if user has enough money for transaction
    const { type, amount } = data;
    if (type === transactionTypes.debit && wallet.currentBalance < amount) {
        throw new ApiError('This wallet does not have enough funds for this transaction', 403);
    }
    
    const adjustmentFactor = type === transactionTypes.credit ? 1 : -1;
    const newTransaction = new Transaction(data)
    wallet.currentBalance += adjustmentFactor * amount;

    // session for ACID :)
    const session = await mongoose.startSession()
    try{
        session.startTransaction()
        const option = { session }
        await wallet.save(option)
        await newTransaction.save(option)
        session.commitTransaction()
    }catch(err){
        session.abortTransaction()
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

    if(!transactions)
        throw new ApiError('This wallet does not have any transactions yet', 404)

    return transactions
}


export const getTransactionById = async(id: string) => {
    const transaction = await Transaction.findById(id)

    if(!transaction)
        throw new ApiError('This transaction id is invalid', 401)

    return transaction
}