import { generateAccessJWT, generateRefreshJWT, isAccessTokenValid, isRefreshTokenValid} from "../../utils/generateToken";
import jwt from 'jsonwebtoken'
import {JwtPayload} from '../../models/user.model'
import env from "../../env";

describe('generateAccessJWT', () => {
    it('should return a token', async() => {
        const token = await generateAccessJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        const secret = env.JWT_SECRET_ACCESS
        const decoded = jwt.verify(token, secret) as JwtPayload;
        expect(decoded.userId).toBe('123')
    })
})

describe('isAccessTokenValid', () => {
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
    it('should return a token', async() => {
        const token = await generateRefreshJWT({userId: '123', email: 'email@email.com', googleId: '456'})
        const secret = env.JWT_SECRET_REFRESH
        const decoded = jwt.verify(token, secret) as JwtPayload;
        expect(decoded.userId).toBe('123')
    })
})


describe('isRefreshTokenValid', () => {
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