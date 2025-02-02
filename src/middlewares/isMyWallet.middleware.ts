import { RequestHandler } from "express";
import { getWalletById } from "../services/wallet.service";
import ApiError from "../errors/api.error";


export const isMyWallet: RequestHandler = async(req, res, next) => {
    const walletId = req.params.walletId || req.body.walletId;
    //validation in walletId
    //
    
    const wallet = await getWalletById(walletId)
    const userId = wallet.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this wallet', 403)

    req.wallet = wallet
    next()
} 

