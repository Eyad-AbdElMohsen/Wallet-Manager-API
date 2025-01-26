import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/api.error";
import dotenv from 'dotenv'
import { generateAccessJWT, isAccessTokenValid, isRefreshTokenValid} from "../utils/generateToken";
dotenv.config()



// this middleware extracts a token from the ( Authorization header ), verifies it, and attaches the user to ( req.currentUser )
export const verifyAccessToken = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader) throw new ApiError('token is required', 401, 'verifyToken.file')
    const token = authHeader.split(' ')[1]
    const user = isAccessTokenValid(token)
    if(!user)throw new ApiError('token is invalid or expired', 401)
    req.currentUser = user
    next()
}

export const verifyRefreshToken = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader) throw new ApiError('token is required', 401, 'verifyToken.file')
    const token = authHeader.split(' ')[1]
    const user = isRefreshTokenValid(token)
    if(!user)throw new ApiError('token is invalid or expired', 401)
    req.currentUser = user
    const accessToken = generateAccessJWT({
        googleId: user.googleId,
        email: user.email,
        userId: user.userId
    })
    res.status(200).json({
        user,
        accessToken
    })
}