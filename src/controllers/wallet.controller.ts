import * as walletService from '../services/wallet.service'
import { ParsedQs } from "qs";
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
        data: {
            newWallet
        }
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
        data: {
            wallets
        }
    })
}

export const getWalletById: RequestHandler = async(req, res, next) => {
    const wallet = req.wallet!
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            wallet
        }
    })
}


export const updateWalletBalance: RequestHandler = async(req, res, next) => {
    const newBalance = req.body.newBalance
    // validation in new balance

    const wallet = req.wallet!

    await walletService.updateWalletBalance(wallet, newBalance)

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            wallet
        }
    })
}

export const deleteMyWallet: RequestHandler  = async(req, res, next) => {
    const wallet = req.wallet!
    await walletService.deleteMyWallet(wallet)

    res.status(200).json({
        status: 'SUCCESS',
        data: null
    })
}

export const getAllMyCurrentBalance: RequestHandler  = async(req, res, next) => {
    const userId = req.currentUser!.userId

    const allCurrentBalance = await walletService.getAllMyCurrentBalance(userId)

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            allCurrentBalance
        }
    })
}
