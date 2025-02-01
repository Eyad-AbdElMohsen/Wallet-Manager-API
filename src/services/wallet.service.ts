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
        throw new ApiError('no wallets', 404)

    return wallets
}

export const getWalletById = async(id: string) => {
    const wallet = await Wallet.findById(id)

    if(!wallet)
        throw new ApiError('This wallet id is invalid', 401)

    return wallet
}