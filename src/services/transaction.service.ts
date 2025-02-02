import { queryObjType } from "../controllers/wallet.controller";
import ApiError from "../errors/api.error";
import { createTransactionData, ITransaction, Transaction } from "../models/transaction.model";
import { IWallet } from "../models/wallet.model";
import ApiFeatures from "../utils/ApiFeatures";
import { TransactionType } from "../utils/transactionType";



export const createNewTransaction = async(data: createTransactionData, wallet: IWallet) => {
    const { type, amount } = data;
    if (type === TransactionType.debit && wallet.currentBalance < amount) {
        throw new ApiError('This wallet does not have enough funds for this transaction', 403);
    }
    const adjustmentFactor = type === TransactionType.credit ? 1 : -1;
    const newTransaction = new Transaction(data)
    wallet.currentBalance += adjustmentFactor * amount;
    await Promise.all([wallet.save(), newTransaction.save()]);
    return newTransaction
}

export const getTransactionHistory = async(walletId: string, queryObject: queryObjType) => {
    const features = new ApiFeatures<ITransaction & Document>(Transaction.find({ walletId }), queryObject)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
    const transactions = await features.query;

    if(!transactions)
        throw new ApiError('This wallet does not have any transactions yet', 404)

    return transactions
}


export const getTransactionById = async(id: string) => {
    const transaction = await Transaction.findById(id)

    if(!transaction)
        throw new ApiError('This transaction id is invalid', 401)

    return transaction
}