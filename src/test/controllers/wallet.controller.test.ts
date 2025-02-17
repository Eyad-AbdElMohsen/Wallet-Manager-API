import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { createWallet, getMyWallets, getWalletById, updateWalletBalance, deleteMyWallet, getAllMyCurrentBalance } from '../../controllers/wallet.controller';
import { walletType } from '../../utils/walletType';
import { IWallet, Wallet } from '../../models/wallet.model';


let mockRequest: Partial<Request>
let mockResponse: Partial<Response> & { status: jest.Mock; json: jest.Mock };
let nextFunction: NextFunction
const currentUser = {
    userId: uuidv4(),
    googleId: uuidv4(),
    email: 'testuser@example.com',
};
let wallet: IWallet

beforeEach(async () => {
    mockRequest = {
        body: {},
        query: {},
        currentUser,
        wallet: {} as IWallet
    };
    mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    nextFunction = jest.fn();
});

describe('createWallet', () => {
    it('should throw api error with message "Validation faild" when body data is not valid', async () => {
        mockRequest.body = {
            walletName: 'test',
            currentBalance: -500,
            type: 'no type'
        }
        await expect(createWallet(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow('Validation failed')
    })

    it('should return a success response with the new wallet details', async () => {
        mockRequest.body = {
            walletName: 'test',
            currentBalance: 500,
            type: walletType.bank
        }

        await createWallet(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                newWallet: expect.any(Object),
            }
        })
    })
})

describe('getMyWallets', () => {
    it('should throw api error with message "Validation faild" when query data is not valid', async () => {
        mockRequest.query = {
            sort: 'unvalid',
            limit: '-1',
            page: '-1',
            walletType: 'unvalid',
            fields: 'unvalid'
        }

        await expect(getMyWallets(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow('Validation failed')
    })

    it('should return a success response with user wallets', async () => {
        mockRequest.query = {
            sort: 'currentBalance',
            limit: '10',
            page: '1',
            type: walletType.cash,
            fields: '_id,currentBalance'
        }

        await Wallet.create({
            walletName: "Test Wallet",
            currentBalance: 1000,
            type: walletType.cash,
            userId: mockRequest.currentUser!.userId,
        });

        await Wallet.create({
            walletName: "Test Wallet",
            currentBalance: 1500,
            type: walletType.cash,
            userId: mockRequest.currentUser!.userId,
        });

        await getMyWallets(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                wallets: expect.arrayContaining([
                    expect.objectContaining({ currentBalance: 1000 }),
                    expect.objectContaining({ currentBalance: 1500 }),
                ]),
            }
        })
    })
})

describe('wallet middlewares', () => {
    beforeEach(async()=> {
        wallet = await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 1500,
            type: walletType.cash,
            userId: mockRequest.currentUser!.userId,
        })
        mockRequest.wallet = wallet
    })

    describe('getWalletById', () => {
        it('should return a success response with the wallet details', async () => {
            await getWalletById(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(200);

            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'SUCCESS',
                data: {
                    wallet: expect.any(Object),
                }
            })
        })
    })

    describe('updateWalletBalance', () => {
        it('should throw api error with message "Validation faild" when body data is not valid', async () => {
            mockRequest.body = {
                newBalance: -200
            }

            await expect(updateWalletBalance(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )).rejects.toThrow('Validation failed')
        })
    
        it('should return a success response with message "Wallet balance updated successfully"', async () => {
            mockRequest.body = {
                newBalance: 200
            }

            await updateWalletBalance(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )

            expect(mockResponse.status).toHaveBeenCalledWith(200);

            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'SUCCESS',
                message: 'Wallet balance updated successfully'
            })
        })
    })

    describe('deleteMyWallet', () => {
        it('should return a success response with message "Wallet deleted successfully"', async () => {
            await deleteMyWallet(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            )
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
    
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 'SUCCESS',
                message: 'Wallet deleted successfully'  
            })
        })
    })
})


describe('getAllMyCurrentBalance', () => {
    it('should return a success response with all wallets balance', async () => {
        await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 2000,
            type: walletType.cash,
            userId: mockRequest.currentUser!.userId,
        })

        await Wallet.create({
            _id: uuidv4(),
            walletName: "Test 2 Wallet",
            currentBalance: 3000,
            type: walletType.cash,
            userId: mockRequest.currentUser!.userId,
        })

        await getAllMyCurrentBalance(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'SUCCESS',
            data: {
                allCurrentBalance: 2000 + 3000
            }
        })
    })
})
