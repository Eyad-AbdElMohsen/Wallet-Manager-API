import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { isMyTransaction } from '../../middlewares/isMyTransaction.middleware';
import { Transaction } from '../../models/transaction.model';
import { categories, transactionTypes } from '../../utils/transactionType';


let mockRequest: Partial<Request> & { transaction?: any }
let mockResponse: Partial<Response>
let nextFunction: NextFunction
const currentUser = {
    userId: uuidv4(),  
    googleId: uuidv4(),  
    email: 'testuser@example.com',
};

beforeEach(() => {
    mockRequest = {
        params: {},
        currentUser
    };
    mockResponse = {
        json: jest.fn()
    };
    nextFunction = jest.fn();
});


describe('isMyTransaction', () => {

    it('should throw ApiError with message "Validation failed" if there is no transactionId', async() => {
        await expect(isMyTransaction(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('Validation failed')
    })

    it('should throw ApiError with message "This user does not have access for this action" if it is unauthorized', async() => {

        const authorizedUserId = uuidv4();
        const unauthorizedUserId = uuidv4();

        const transaction = await Transaction.create({
            _id: uuidv4(),
            walletId: uuidv4(),
            type: transactionTypes.credit,
            userId: authorizedUserId,
            amount: 500,
            category: categories.food
        });

        mockRequest.params = {
            transactionId: transaction._id
        }
        mockRequest.currentUser!.userId = unauthorizedUserId

        await expect(isMyTransaction(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('This user does not have access for this action')
    })

    it('should add transaction to request if user is authorized', async() => {
        const authorizedUserId = uuidv4();

        const transaction = await Transaction.create({
            _id: uuidv4(),
            walletId: uuidv4(),
            type: transactionTypes.credit,
            userId: authorizedUserId,
            amount: 500,
            category: categories.food
        });

        mockRequest.params = {
            transactionId: transaction._id
        }
        mockRequest.currentUser!.userId = authorizedUserId

        await isMyTransaction(mockRequest as Request, mockResponse as Response, nextFunction)

        expect(nextFunction).toHaveBeenCalledTimes(1);

        expect(mockRequest.transaction).toEqual(expect.objectContaining({
            _id: transaction._id,
            walletId: transaction.walletId,
            type: transaction.type,
            userId: transaction.userId,
            amount: transaction.amount,
            category: transaction.category
        }));
    })
})