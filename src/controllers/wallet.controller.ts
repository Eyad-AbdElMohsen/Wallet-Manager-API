import * as walletService from '../services/wallet.service'
import { ParsedQs } from "qs";
import ApiError from "../errors/api.error";
import { RequestHandler } from 'express';

export const createWallet: RequestHandler = async(req, res, next) => {
    // validation on data here 
    //

    const userId = req.currentUser!.userId
    const data = {
        userId,
        walletName: req.body.walletName,
        currentBalance: req.body.currentBalance,
        type: req.body.type,
    }

    const newWallet = await walletService.createWallet(data)
    res.status(200).json({
        status: 'SUCCESS',
        data: newWallet
    })
}

export type queryObjType = Record<string, string[] | ParsedQs[] | string | ParsedQs >;

export const getMyWallets: RequestHandler = async(req, res, next) => {
    // validation in query parameters here
    //

    const userId = req.currentUser!.userId
    const wallets = await walletService.getMyWallets(userId, req.query as queryObjType)

    res.status(200).json({
        status: 'SUCCESS',
        data: wallets
    })
}

export const getWalletById: RequestHandler = async(req, res, next) => {
    const walletId = req.params.walletId 

    const wallet = await walletService.getWalletById(walletId)
    const userId = wallet.userId

    if(userId != req.currentUser!.userId)
        throw new ApiError('This user does not have access for this wallet', 403)

    res.status(200).json({
        status: 'SUCCESS',
        data: wallet
    })
}