import dotenv from "dotenv";
dotenv.config()
import { generateAccessJWT, generateRefreshJWT, isAccessTokenValid, isRefreshTokenValid} from "../../utils/generateToken";
import jwt from 'jsonwebtoken'
import {JwtPayload} from '../../models/user.model'

describe('generateAccessJWT', () => {

    it('should throw error if secretAccessKey is not set', async () => {
        const secret = process.env.JWT_SECRET_ACCESS;
        delete process.env.JWT_SECRET_ACCESS;
        await expect(generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})).rejects.toThrow('the secretKey is required')
        process.env.JWT_SECRET_ACCESS = secret
    })

    it('should return a token', async() => {
        const token = await generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        const secret = process.env.JWT_SECRET_ACCESS
        if (secret) {
            const decoded = jwt.verify(token, secret) as JwtPayload;
            expect(decoded.userId).toBe('123')
        }else{
            throw new Error('the secretKey is required')
        }
    })

})

describe('isAccessTokenValid', () => {
    it('should throw error if secretKey is not set',async() => {
        const secret = process.env.JWT_SECRET_ACCESS
        const token = await generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        delete process.env.JWT_SECRET_ACCESS
        expect(() => isAccessTokenValid(token)).toThrow('the secretKey is required');
        process.env.JWT_SECRET_ACCESS = secret
    })

    it('should return false if the token is invalid', () => {
        const token = 'invalid token'
        expect(isAccessTokenValid(token)).toBe(false);
    })

    it('should return true if the token is valid', async() => {
        const token = await generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        //this token has properties { email: 'email@email.com', userId: '123', googleId: '456',}
        expect(isAccessTokenValid(token)).toHaveProperty('email', 'email@email.com');
        expect(isAccessTokenValid(token)).toHaveProperty('userId', '123');
        expect(isAccessTokenValid(token)).toHaveProperty('googleId', '456');
    })

})

describe('generateRefreshJWT', () => {

    it('should throw error if secretRefreshKey is not set', async () => {
        const secret = process.env.JWT_SECRET_REFRESH;
        delete process.env.JWT_SECRET_REFRESH;
        await expect(generateRefreshJWT({userId: '123', email: 'email@email.com', googleId: '456'})).rejects.toThrow('the secretKey is required')
        process.env.JWT_SECRET_REFRESH = secret
    })

    it('should return a token', async() => {
        const token = await generateRefreshJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        const secret = process.env.JWT_SECRET_REFRESH
        if (secret) {
            const decoded = jwt.verify(token, secret) as JwtPayload;
            expect(decoded.userId).toBe('123')
        }else{
            throw new Error('the secretKey is required')
        }
    })

})


describe('isRefreshTokenValid', () => {
    it('should throw error if secretKey is not set', async() => {
        const secret = process.env.JWT_SECRET_REFRESH
        const token = await generateRefreshJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        delete process.env.JWT_SECRET_REFRESH
        expect(() => isRefreshTokenValid(token)).toThrow('the secretKey is required');
        process.env.JWT_SECRET_REFRESH = secret
    })

    it('should return false if the token is invalid', () => {
        const token = 'invalid token'
        expect(isRefreshTokenValid(token)).toBe(false);
    })

    it('should return true if the token is valid', async() => {
        const token = await generateRefreshJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        //this token has properties { email: 'email@email.com', userId: '123', googleId: '456',}
        expect(isRefreshTokenValid(token)).toHaveProperty('email', 'email@email.com');
        expect(isRefreshTokenValid(token)).toHaveProperty('userId', '123');
        expect(isRefreshTokenValid(token)).toHaveProperty('googleId', '456');
    })

})