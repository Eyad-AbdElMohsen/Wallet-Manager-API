import { NextFunction, Request, Response } from 'express';
import { isMyWalletFromBody, isMyWalletFromParam } from '../../middlewares/isMyWallet.middleware';
import { Wallet } from '../../models/wallet.model';
import { walletType } from '../../utils/walletType';
import { v4 as uuidv4 } from "uuid";


let mockRequest: Partial<Request> & { wallet?: any }
let mockResponse: Partial<Response>
let nextFunction: NextFunction
const currentUser = {
    userId: uuidv4(),  
    googleId: uuidv4(),  
    email: 'testuser@example.com',
};

beforeEach(() => {
    mockRequest = {
        body: {},
        params: {},
        currentUser
    };
    mockResponse = {
        json: jest.fn()
    };
    nextFunction = jest.fn();
});


describe('isMyWalletFromParam', () => {

    it('should throw ApiError with message "Validation failed" if there is no walletId', async() => {
        await expect(isMyWalletFromParam(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('Validation failed')
    })

    it('should throw ApiError with message "This user does not have access for this action" if it is unauthorized', async() => {

        const authorizedUserId = uuidv4();
        const unauthorizedUserId = uuidv4();

        const wallet = await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 1000,
            type: walletType.cash,
            userId: authorizedUserId,
        });

        mockRequest.params = {
            walletId: wallet._id
        }
        mockRequest.currentUser!.userId = unauthorizedUserId

        await expect(isMyWalletFromParam(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('This user does not have access for this action')
    })

    it('should add wallet to request if user is authorized', async() => {
        const authorizedUserId = uuidv4();

        const wallet = await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 1000,
            type: walletType.cash,
            userId: authorizedUserId,
        });

        mockRequest.params = {
            walletId: wallet._id
        }
        mockRequest.currentUser!.userId = authorizedUserId

        await isMyWalletFromParam(mockRequest as Request, mockResponse as Response, nextFunction)
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockRequest.wallet).toEqual(expect.objectContaining({
            _id: wallet._id,
            walletName: wallet.walletName,
            currentBalance: wallet.currentBalance,
            type: wallet.type,
            userId: wallet.userId,
        }));
    })
})


describe('isMyWalletFromBody', () => {

    it('should throw ApiError with message "Validation failed" if there is no walletId', async() => {
        await expect(isMyWalletFromBody(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('Validation failed')
    })

    it('should throw ApiError with message "This user does not have access for this action" if it is unauthorized', async() => {

        const authorizedUserId = uuidv4();
        const unauthorizedUserId = uuidv4();

        const wallet = await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 1000,
            type: walletType.cash,
            userId: authorizedUserId,
        });

        mockRequest.body = {
            walletId: wallet._id
        }
        mockRequest.currentUser!.userId = unauthorizedUserId

        await expect(isMyWalletFromBody(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('This user does not have access for this action')
    })

    it('should add wallet to request if user is authorized', async() => {
        const authorizedUserId = uuidv4();

        const wallet = await Wallet.create({
            _id: uuidv4(),
            walletName: "Test Wallet",
            currentBalance: 1000,
            type: walletType.cash,
            userId: authorizedUserId,
        });

        mockRequest.body = {
            walletId: wallet._id
        }
        mockRequest.currentUser!.userId = authorizedUserId

        await isMyWalletFromBody(mockRequest as Request, mockResponse as Response, nextFunction)
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockRequest.wallet).toEqual(expect.objectContaining({
            _id: wallet._id,
            walletName: wallet.walletName,
            currentBalance: wallet.currentBalance,
            type: wallet.type,
            userId: wallet.userId,
        }));
    })
})