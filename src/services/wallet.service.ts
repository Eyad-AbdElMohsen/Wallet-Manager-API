import { queryObjType } from "../controllers/wallet.controller";
import ApiError from "../errors/api.error";
import { IWallet, Wallet, createWalletData } from "../models/wallet.model";
import ApiFeatures from "../utils/ApiFeatures";


export const createWallet = async(data: createWalletData) => {
    const newWallet = new Wallet(data)
    await newWallet.save()
    return newWallet
}

export const getMyWallets = async(userId: string, queryObject: queryObjType) => {

    const features = new ApiFeatures<IWallet & Document>(Wallet.find({ userId }), queryObject)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
    const wallets = await features.query;

    if(!wallets)
        throw new ApiError('This user does not have any wallets yet', 404)

    return wallets
}

export const getWalletById = async(id: string) => {
    const wallet = await Wallet.findById(id)

    if(!wallet)
        throw new ApiError('This wallet id is invalid', 401)

    return wallet
}

export const updateWalletBalance = async(wallet: IWallet, newBalance: number) => {
    wallet.currentBalance = newBalance
    await wallet.save()
    return wallet
}

export const deleteMyWallet = async(wallet: IWallet) => await Wallet.deleteOne({_id: wallet._id})