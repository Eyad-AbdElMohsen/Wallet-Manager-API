import { RequestHandler } from "express";
import ApiError from "../errors/api.error";
import { getTransactionById } from "../services/transaction.service";
import { getTransactionIdParam } from "../schemas/transaction.schema";


export const isMyTransaction: RequestHandler = async(req, res, next) => {
    const checkParam = getTransactionIdParam.safeParse(req.params)
    if(!checkParam.success)
        throw new ApiError("Validation failed", 400, 'createWallet controller' , checkParam.error.format());

    const transactionId = checkParam.data.transactionId;
    
    const transaction = await getTransactionById(transactionId)
    
    const userId = transaction.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this action', 403)

    req.transaction = transaction
    next()
} 

