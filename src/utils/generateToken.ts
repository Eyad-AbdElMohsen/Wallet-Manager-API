import { Console } from 'console'
import ApiError from '../errors/api.error'
import { JwtPayload} from '../models/user.model'
import jwt from 'jsonwebtoken'


export const generateAccessJWT = async(payload: JwtPayload) => {
    if(process.env.JWT_SECRET_ACCESS){
        const token = jwt.sign(
            payload as JwtPayload,
            // in terminal -> require('crypto').randomBytes(32).toString('hex') 
            process.env.JWT_SECRET_ACCESS,
            {expiresIn: '5h'}
        )
        return token
    }else{
        throw new ApiError('the secretKey is required', 500)
    }
}

export const isAccessTokenValid = (token: string) => {
    if(!process.env.JWT_SECRET_ACCESS) throw new ApiError('the secretKey is required', 500)
    try{
        return jwt.verify(token, process.env.JWT_SECRET_ACCESS) as JwtPayload
    }catch(err){
        return false
    }
}


export const generateRefreshJWT = async(payload: JwtPayload) => {
    if(process.env.JWT_SECRET_REFRESH){
        const token = jwt.sign(
            payload as JwtPayload,
            // in terminal -> require('crypto').randomBytes(32).toString('hex') 
            process.env.JWT_SECRET_REFRESH,
            {expiresIn: '7d'}
        )
        return token
    }else{
        throw new ApiError('the secretKey is required', 500)
    }
}

export const isRefreshTokenValid = (token: string) => {
    if(!process.env.JWT_SECRET_REFRESH) throw new ApiError('the secretKey is required', 500)
    try{
        return jwt.verify(token, process.env.JWT_SECRET_REFRESH) as JwtPayload
    }catch(err){
        return false
    }
}