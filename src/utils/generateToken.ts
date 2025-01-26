import ApiError from '../errors/api.error'
import { JwtPayload} from '../models/user.model'
import jwt from 'jsonwebtoken'


const secretAccessKey = process.env.JWT_SECRET_ACCESS
const secretRefreshKey = process.env.JWT_SECRET_REFRESH


export const generateAccessJWT = async(payload: JwtPayload) => {
    if(secretAccessKey){
        const token = jwt.sign(
            payload as JwtPayload,
            // in terminal -> require('crypto').randomBytes(32).toString('hex') 
            secretAccessKey,
            {expiresIn: '5h'}
        )
        return token
    }else{
        throw new Error('the secretKey is required')
    }
}

export const isAccessTokenValid = (token: string) => {
    try{
        if(!secretAccessKey) throw new ApiError('internal server error', 500)
        return jwt.verify(token, secretAccessKey!) as JwtPayload
    }catch(err){
        return false
    }
}


export const generateRefreshJWT = async(payload: JwtPayload) => {
    if(secretRefreshKey){
        const token = jwt.sign(
            payload as JwtPayload,
            // in terminal -> require('crypto').randomBytes(32).toString('hex') 
            secretRefreshKey,
            {expiresIn: '7d'}
        )
        return token
    }else{
        throw new Error('the secretKey is required')
    }
}

export const isRefreshTokenValid = (token: string) => {
    try{
        if(!secretRefreshKey) throw new ApiError('internal server error', 500)
        return jwt.verify(token, secretRefreshKey!) as JwtPayload
    }catch(err){
        return false
    }
}