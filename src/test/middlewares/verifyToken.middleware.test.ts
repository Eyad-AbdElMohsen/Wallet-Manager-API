import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../../middlewares/verifyToken';
import { generateAccessJWT } from '../../utils/generateToken';

describe('verifyAccessToken', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>  & { body?: any };;
    let nextFunction: NextFunction

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should return "token is required" when token is missing', async () => {
        await expect(verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('token is required');
    });


    it('should return "token is invalid or expired" for invalid token', async () => {
        mockRequest.headers = {
            'authorization': 'Bearer invalid-token'
        }
        await expect(verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('token is invalid or expired');
    });

    
    it('should call nextFunction for valid token', async () => {
        const token = await generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        mockRequest.headers = {
            'authorization': `Bearer ${token}`
        }
        await verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledTimes(1);
    });
})