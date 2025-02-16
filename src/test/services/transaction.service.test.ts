import { createTransactionAllData, getTransactionsQuerySchema } from "../../schemas/transaction.schema";
import { categories, transactionTypes } from "../../utils/transactionType";
import { z } from 'zod'
import { IWallet, Wallet } from "../../models/wallet.model";
import { createNewTransaction, getTransactionById, getTransactionHistory } from "../../services/transaction.service";
import { v4 as uuidv4 } from "uuid";
import { walletType } from "../../utils/walletType";
import { Transaction } from "../../models/transaction.model";
import ApiError from "../../errors/api.error";

describe('createNewTransaction', () => {
    let wallet: IWallet
    let data: z.infer<typeof createTransactionAllData>

    beforeEach(() => {
        wallet = {} as IWallet
        data = {} as z.infer<typeof createTransactionAllData>
    })

    it('should throw an error with the message "This wallet does not have enough funds..." if the wallet balance is insufficient', async () => {
        data.type = transactionTypes.debit
        data.amount = 1000
        wallet.currentBalance = 500
        await expect(createNewTransaction(data, wallet)).rejects.toThrow('This wallet does not have enough funds for this transaction');
    });

    it('should return new transaction data and the wallet has been updated', async () => {
        data = {
            type: transactionTypes.debit,
            category: categories.food,
            amount: 200,
            walletId: uuidv4(),
            userId: uuidv4(),
        }

        const wallet = await Wallet.create({
            walletName: 'test',
            currentBalance: 500,
            type: walletType.cash,
            userId: uuidv4(),
        });

        const res = await createNewTransaction(data, wallet)

        expect(res).toEqual(expect.objectContaining({
            _id: res._id,
            walletId: res.walletId,
            type: res.type,
            userId: res.userId,
            amount: res.amount,
            category: res.category
        }))

        expect(wallet.currentBalance).toBe(500 - 200)
    })
});

describe('getTransactionHistory', () => {
    let queryObject: z.infer<typeof getTransactionsQuerySchema>
    let wallet: IWallet;

    beforeEach(async () => {
        queryObject = {
            type: transactionTypes.credit,
            category: categories.food,
            fields: '_id,amount',
            sort: "amount",
            limit: 10,
            page: 1
        }
        wallet = await Wallet.create({
            walletName: 'test',
            currentBalance: 500,
            type: walletType.cash,
            userId: uuidv4(),
        });
    })

    it('should throw an error with message "This wallet does not have any transactions yet with these filters"', async () => {
        const walletId = uuidv4()
        await expect(getTransactionHistory(walletId, queryObject)).rejects.toThrow('This wallet does not have any transactions yet with these filters')
    })

    it('should return all transactions history', async () => {
        const transaction_1 = await Transaction.create({
            type: transactionTypes.credit,
            category: categories.food,
            amount: 200,
            walletId: wallet._id,
            userId: wallet.userId,
        })

        const transaction_2 = await Transaction.create({
            type: transactionTypes.debit,
            category: categories.gift,
            amount: 200,
            walletId: wallet._id,
            userId: wallet.userId,
        })

        const transaction_3 = await Transaction.create({
            type: transactionTypes.credit,
            category: categories.food,
            amount: 700,
            walletId: wallet._id,
            userId: wallet.userId,
        })

        const res = await getTransactionHistory(wallet._id, queryObject)

        // transaction 2 is not specified our filteration
        expect(res).not.toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: transaction_2._id,
            }),
        ]));

        // transactions 1, 3 are specified our filteration
        expect(res).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: transaction_1._id,
                amount: transaction_1.amount,
            }),
            expect.objectContaining({
                _id: transaction_3._id,
                amount: transaction_3.amount,
            }),
        ]));

        // make sure about sort operation
        expect(res).toEqual([
            expect.objectContaining({ amount: 200 }),
            expect.objectContaining({ amount: 700 }),
        ]);
    })

    it('should throw an error if fields contain invalid values', async () => {
        const query = { fields: 'amount,unknownField' };
        await expect(getTransactionHistory(wallet._id, query))
            .rejects.toThrow(ApiError);
    });

})

describe('getTransactionHistory', () => {
    it('should throw an error with message "This transaction id is invalid', async () => {
        const id = uuidv4()
        await expect(getTransactionById(id)).rejects.toThrow('This transaction id is invalid')
    })

    it('should return transaction data if id is valid & exist', async () => {
        const transaction = await Transaction.create({
            type: transactionTypes.credit,
            category: categories.food,
            amount: 200,
            walletId: uuidv4(),
            userId: uuidv4(),
        })

        const res = await getTransactionById(transaction._id)

        expect(res).toEqual(expect.objectContaining({
            _id: transaction._id,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            walletId: transaction.walletId,
            userId: transaction.userId,
        }))
    })
})


