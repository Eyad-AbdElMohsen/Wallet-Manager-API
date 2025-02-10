import { RequestHandler } from "express";
import * as transactionService from '../services/transaction.service'
import { createTransactionBody } from "../models/transaction.model";
import ApiError from "../errors/api.error";
import { getTransactionsQuerySchema } from "../schemas/transaction.schema";

export const createNewTransaction: RequestHandler = async(req, res) => {
    const checkBody = createTransactionBody.safeParse(req.body)
    if(!checkBody.success)
        throw new ApiError("Validation failed", 400, 'createTransaction controller' , checkBody.error.format());

    const {type, category, amount} = checkBody.data
    const userId = req.currentUser!.userId
    const wallet = req.wallet!
    const oldBalance = wallet.currentBalance
    const walletId = wallet._id

    const newTransaction = await transactionService.createNewTransaction({
        userId, walletId, type, category, amount
    }, wallet)


    res.status(200).json({
        status: 'SUCCESS',
        data: {
            newTransaction,
            oldBalance,
            currentBalance: wallet.currentBalance
        }
    })
}


export const getMyTransaction: RequestHandler = async(req, res) => {
    const transaction = req.transaction!
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            transaction
        }
    })
}

export const getTransactionHistory: RequestHandler = async(req, res) => {
    const checkQuery = getTransactionsQuerySchema.safeParse(req.query)
    if(!checkQuery.success)
        throw new ApiError("Validation failed", 400, 'transaction controller' , checkQuery.error.format());
    
    const queryData = checkQuery.data
    const wallet = req.wallet!

    const transactions = await transactionService.getTransactionHistory(wallet._id, queryData)

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            transactions
        }
    })
}
