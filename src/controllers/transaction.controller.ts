import { RequestHandler } from "express";
import * as transactionService from '../services/transaction.service'
import { queryObjType } from "./wallet.controller";

export const createNewTransaction: RequestHandler = async(req, res, next) => {
    const userId = req.currentUser!.userId
    const wallet = req.wallet!
    const oldBalance = wallet.currentBalance
    const walletId = wallet._id
    const {type, category, amount} = req.body
    // validation in data
    //

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


export const getMyTransaction: RequestHandler = async(req, res, next) => {
    const transaction = req.transaction!
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            transaction
        }
    })
}

export const getTransactionHistory: RequestHandler = async(req, res, next) => {
    const wallet = req.wallet!

    const transactions = await transactionService.getTransactionHistory(wallet._id, req.query as queryObjType)

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            transactions
        }
    })
}
