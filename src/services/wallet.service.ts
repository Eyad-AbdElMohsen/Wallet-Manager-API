import ApiError from "../errors/api.error";
import { IWallet, Wallet } from "../models/wallet.model";
import { createWalletData, getWalletQuerySchema } from "../schemas/wallet.schema";
import ApiFeatures from "../utils/ApiFeatures";
import { z } from 'zod' 

export const createWallet = async(data: z.infer<typeof createWalletData> & { userId: string }) => {
    const newWallet = new Wallet(data)
    await newWallet.save()
    return newWallet
}

export const getMyWallets = async(userId: string, queryObject: z.infer<typeof getWalletQuerySchema>) => {

    const features = new ApiFeatures<IWallet & Document>(Wallet.find({ userId }), queryObject)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
    const wallets = await features.query;

    if(!wallets)
        throw new ApiError('No Wallets!', 404)

    return wallets
}

export const getWalletById = async(id: string) => {
    const wallet = await Wallet.findById(id)

    if(!wallet)
        throw new ApiError('Wallet is Not Fount', 404)

    return wallet
}

export const updateWalletBalance = async(wallet: IWallet, newBalance: number) => {
    wallet.currentBalance = newBalance
    await wallet.save()
    return wallet
}

export const getAllMyCurrentBalance = async(userId: string) => {
    const allMyWallets = await Wallet.find({userId})

    let balance = 0
    for(let wallet of allMyWallets){
        balance += wallet.currentBalance
    }

    return balance
}

export const deleteMyWallet = async(wallet: IWallet) => await Wallet.deleteOne({_id: wallet._id})