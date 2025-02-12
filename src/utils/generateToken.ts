import env from '../env'
import jwt from 'jsonwebtoken'
import { JwtPayload} from '../models/user.model'


const generateJWT = (payload: JwtPayload, secret: string, expiresIn: number) => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessJWT = (payload: JwtPayload) => 
    generateJWT(payload, env.JWT_SECRET_ACCESS, 60 * 60 * 10 ); // 10 hours

export const generateRefreshJWT = (payload: JwtPayload) => 
    generateJWT(payload, env.JWT_SECRET_REFRESH, 60 * 60 * 24 * 7 ); // 7 days



const verifyJWT = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch(err) {
        return false;
    }
};

export const isAccessTokenValid = (token: string) => 
    verifyJWT(token, env.JWT_SECRET_ACCESS);

export const isRefreshTokenValid = (token: string) => 
    verifyJWT(token, env.JWT_SECRET_REFRESH);