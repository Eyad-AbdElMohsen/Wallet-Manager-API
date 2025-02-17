import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { categories, transactionTypes } from '../../utils/transactionType';
import { createNewTransaction, getMyTransaction, getTransactionHistory } from '../../controllers/transaction.controller';
import { Wallet } from '../../models/wallet.model';
import { walletType } from '../../utils/walletType';
import { Transaction } from '../../models/transaction.model';

let mockRequest: Partial<Request>
let mockResponse: Partial<Response> & { status: jest.Mock; json: jest.Mock };
let nextFunction: NextFunction
const currentUser = {
    userId: uuidv4(),
    googleId: uuidv4(),
    email: 'testuser@example.com',
};

export const createWallet = async () => {
    return await Wallet.create({
        _id: uuidv4(),
        walletName: "Test Wallet",
        currentBalance: 1000,
        type: walletType.cash,
        userId: currentUser.userId,
    });
}

export const createTransaction = async (walletId: string) => {
    return await Transaction.create({
        _id: uuidv4(),
        walletId,
        type: transactionTypes.credit,
        userId: currentUser.userId,
        amount: 500,
        category: categories.food
    });
}

beforeEach(async () => {
    const wallet = await createWallet()
    const transaction = await createTransaction(wallet._id)
    mockRequest = {
        body: {},
        query: {},
        currentUser,
        wallet,
        transaction
    };
    mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    nextFunction = jest.fn();
});

describe('createNewTransaction', () => {
    it('should throw api error with message "Validation faild" when body data is not valid', async () => {
        mockRequest.body = {
            type: 'not credit',
            category: 'not food',
            amount: -333
        }
        await expect(createNewTransaction(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow('Validation failed')
    })

    it('should return a success response with the new transaction details', async () => {
        mockRequest.body = {
            type: transactionTypes.credit,
            category: categories.food,
            amount: 333
        }

        await createNewTransaction(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                newTransaction: expect.any(Object),
                oldBalance: 1000,
                currentBalance: 1333,
            }
        })
    })
})

describe('getMyTransaction', () => {
    it('should return a success response with the transaction details', async () => {
        await expect(getMyTransaction(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        ))

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                transaction: expect.any(Object),
            }
        })
    })
})

describe('getTransactionHistory', () => {
    it('should throw api error with message "Validation faild" when query data is not valid', async () => {
        mockRequest.query = {
            sort: 'unvalid',
            limit: '-1',
            page: '-1',
            type: 'unvalid',
            category: 'unvalid',
            fields: 'unvalid'
        }

        await expect(createNewTransaction(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow('Validation failed')
    })

    it('should return a success response with the transaction history', async () => {
        mockRequest.query = {
            sort: 'amount',
            limit: '10',
            page: '1',
            type: transactionTypes.credit,
            category: categories.food,
            fields: '_id,amount'
        }

        await Transaction.create({
            _id: uuidv4(),
            walletId: mockRequest.wallet!._id,
            type: transactionTypes.credit,
            userId: currentUser.userId,
            amount: 200,
            category: categories.food
        });

        await Transaction.create({
            _id: uuidv4(),
            walletId: mockRequest.wallet!._id,
            type: transactionTypes.credit,
            userId: currentUser.userId,
            amount: 700,
            category: categories.food
        });

        await getTransactionHistory(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                transactions: expect.arrayContaining([
                    expect.objectContaining({ amount: 200 }),
                    expect.objectContaining({ amount: 500 }),
                    expect.objectContaining({ amount: 700 }),
                ]),
            }
        })
    })
})


