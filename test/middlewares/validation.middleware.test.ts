import validationMiddleware from "../../src/middlewares/validation.middleware"
import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";

describe('validationMiddleware', () => {

    let mockRequest: Partial<Request> & {body?: any};
    let mockResponse: Partial<Response>  & { body?: any };;
    let nextFunction: NextFunction

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn()
    })

    it('should throw error with message "Validation Error"', async() => {
        mockRequest.body = {
            email: 'invalid-email'
        };
        await check('email').isEmail().withMessage('Invalid email format').run(mockRequest as Request);
        await expect(validationMiddleware(
            mockRequest as Request,
            mockResponse as Response, 
            nextFunction
        )).rejects.toThrow('Validation Error')
    })

    it('should call next function for no validation errors', async() => {
        await validationMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)
        expect(nextFunction).toHaveBeenCalledTimes(1)
    })
})
