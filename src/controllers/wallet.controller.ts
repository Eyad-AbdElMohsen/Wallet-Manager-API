import * as walletService from '../services/wallet.service'
import { RequestHandler } from 'express';
import { createWalletData, updateWalletBalanceBody } from '../schemas/wallet.schema';
import ApiError from '../errors/api.error';
import { getWalletQuerySchema } from '../schemas/wallet.schema';

export const createWallet: RequestHandler = async(req, res) => {
    const checkBody = createWalletData.safeParse(req.body)
    if(!checkBody.success)
        throw new ApiError("Validation failed", 400, 'createWallet controller' , checkBody.error.format());

    const userId = req.currentUser!.userId
    const { walletName, currentBalance, type } = checkBody.data;

    const newWallet = await walletService.createWallet({
        walletName,
        currentBalance,
        type,
        userId,
    })

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            newWallet
        }
    })
}

export const getMyWallets: RequestHandler = async(req, res) => {
    const checkQuery = getWalletQuerySchema.safeParse(req.query)
    if(!checkQuery.success)
        throw new ApiError("Validation failed", 400, 'createWallet controller' , checkQuery.error.format());

    const userId = req.currentUser!.userId
    const wallets = await walletService.getMyWallets(userId, checkQuery.data)

    res.status(200).json({
        status: 'SUCCESS',
        data: {
            wallets
        }
    })
}

export const getWalletById: RequestHandler = async(req, res) => {
    const wallet = req.wallet!
    res.status(200).json({
        status: 'SUCCESS',
        data: {
            wallet
        }
    })
}


export const updateWalletBalance: RequestHandler = async(req, res) => {
    const checkBody = updateWalletBalanceBody.safeParse(req.body)
    if(!checkBody.success)
        throw new ApiError("Validation failed", 400, 'createWallet controller' , checkBody.error.format());

    const newBalance = checkBody.data.newBalance
    const wallet = req.wallet!

    await walletService.updateWalletBalance(wallet, newBalance)

    res.status(200).json({
        status: 'SUCCESS',
        message: 'Wallet balance updated successfully'
    })
}

export const deleteMyWallet: RequestHandler  = async(req, res, next) => {
    const wallet = req.wallet!
    await walletService.deleteMyWallet(wallet)

    res.status(200).json({
        status: 'SUCCESS',
        message: 'Wallet deleted successfully'
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
