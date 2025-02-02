import { RequestHandler } from "express";
import ApiError from "../errors/api.error";
import { getTransactionById } from "../services/transaction.service";


export const isMyTransaction: RequestHandler = async(req, res, next) => {
    const transactionId = req.params.transactionId;
    //validation in transactionId
    //
    
    const transaction = await getTransactionById(transactionId)
    const userId = transaction.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this wallet', 403)

    req.transaction = transaction
    next()
} 

