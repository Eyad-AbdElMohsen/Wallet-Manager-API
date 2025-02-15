import ApiError from "../errors/api.error";
import { ApiFeatures } from "../utils/ApiFeatures";
import { z } from 'zod' 
import { IWallet, Wallet } from "../models/wallet.model";
import { createWalletData, getWalletQuerySchema } from "../schemas/wallet.schema";

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

    if(!wallets || wallets.length === 0)
        throw new ApiError('No wallets found!', 404)

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

    const totalBalance = allMyWallets.reduce((sum, wallet) => sum + wallet.currentBalance, 0);

    return totalBalance
}

export const deleteMyWallet = async(wallet: IWallet) => await Wallet.deleteOne({_id: wallet._id})