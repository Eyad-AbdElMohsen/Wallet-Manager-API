import { RequestHandler } from "express";
import { getWalletById } from "../services/wallet.service";
import ApiError from "../errors/api.error";
import { getWalletIdParam } from "../schemas/wallet.schema";


export const isMyWalletFromParam: RequestHandler = async(req, res, next) => {
    const checkParam = getWalletIdParam.safeParse(req.params)
    if(!checkParam.success)
        throw new ApiError("Validation failed", 400, 'createWallet controller' , checkParam.error.format());

    const walletId = checkParam.data.walletId;

    const wallet = await getWalletById(walletId)

    const userId = wallet.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this action', 403)

    req.wallet = wallet
    next()
} 

export const isMyWalletFromBody: RequestHandler = async(req, res, next) => {
    const checkBody = getWalletIdParam.safeParse(req.body)
    if(!checkBody.success)
        throw new ApiError("Validation failed", 400, 'isMyWalletMiddleWare' , checkBody.error.format());

    const walletId = checkBody.data.walletId;

    const wallet = await getWalletById(walletId)

    const userId = wallet.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this action', 403)

    req.wallet = wallet
    next()
} 


