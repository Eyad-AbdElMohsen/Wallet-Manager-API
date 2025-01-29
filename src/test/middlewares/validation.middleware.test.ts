import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import validationMiddleware from "../../middlewares/validation.middleware";


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
        const validation = validationMiddleware( 
            mockRequest as Request,
            mockResponse as Response, 
            nextFunction
        )
        await expect(validation).rejects.toThrow('Validation Error')
        await expect(validation).rejects.toHaveProperty('code', 400)
    })

    it('should call next function for no validation errors', async() => {
        await validationMiddleware(mockRequest as Request, mockResponse as Response, nextFunction)
        expect(nextFunction).toHaveBeenCalledTimes(1)
    })
})
