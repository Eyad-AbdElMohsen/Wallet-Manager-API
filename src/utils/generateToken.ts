import env from '../env'
import { JwtPayload} from '../models/user.model'
import jwt from 'jsonwebtoken'



export const generateAccessJWT = async(payload: JwtPayload) => {
    const token = jwt.sign(
        payload as JwtPayload,
        // in terminal -> require('crypto').randomBytes(32).toString('hex') 
        env.JWT_SECRET_ACCESS,
        {expiresIn: '5h'}
    )
    return token
}

export const isAccessTokenValid = (token: string) => {
    try{
        return jwt.verify(token, env.JWT_SECRET_ACCESS) as JwtPayload
    }catch(err){
        return false
    }
}


export const generateRefreshJWT = async(payload: JwtPayload) => {
    const token = jwt.sign(
        payload as JwtPayload,
        // in terminal -> require('crypto').randomBytes(32).toString('hex') 
        env.JWT_SECRET_REFRESH,
        {expiresIn: '7d'}
    )
    return token
}


export const isRefreshTokenValid = (token: string) => {
    try{
        return jwt.verify(token, env.JWT_SECRET_REFRESH) as JwtPayload
    }catch(err){
        return false
    }
}