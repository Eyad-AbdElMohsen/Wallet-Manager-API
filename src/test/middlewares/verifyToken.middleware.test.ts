import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../../middlewares/verifyToken';
import { generateAccessJWT, generateRefreshJWT } from '../../utils/generateToken';

describe('verifyAccessToken', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>  & { body?: any };;
    let nextFunction: NextFunction

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should return "Missing authentication token" when token is missing', async () => {
        await expect(verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('Missing authentication token');
    });


    it('should return "Token is invalid or expired" for invalid token', async () => {
        mockRequest.headers = {
            'authorization': 'Bearer invalid-token'
        }
        await expect(verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction)).rejects.toThrow('Token is invalid or expired');
    });

    
    it('should call nextFunction for valid token', async () => {
        const token = generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        mockRequest.headers = {
            'authorization': `Bearer ${token}`
        }
        await verifyAccessToken(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalledTimes(1);
    });
})

describe('verifyRefreshToken', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>  & { body?: any };;

    beforeEach(() => {
        mockRequest = {
            cookies: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return "Refresh token is missing from cookies" when token is missing', async () => {
        await expect(verifyRefreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow('Refresh token is missing from cookies');
    });

    it('should return "Token is invalid or expired" for invalid token', async () => {
        mockRequest.cookies = { 
            refreshToken: "invalid-token" 
        };
        await expect(verifyRefreshToken(mockRequest as Request, mockResponse as Response)).rejects.toThrow('Token is invalid or expired');
    });

    
    it('should return new accessToken and user data', async () => {
        const token = generateRefreshJWT({ userId: "123", email: "email@email.com", googleId: "456" })

        mockRequest.cookies = {
            refreshToken: token 
        }

        await verifyRefreshToken(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            // The user object contains additional properties, so we use `objectContaining` to match only the expected ones.
            user: expect.objectContaining({
                email: "email@email.com",
                googleId: "456",
                userId: "123"
            }),
            accessToken: expect.any(String)
        })
    })
})