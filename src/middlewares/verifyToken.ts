import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/api.error";
import { generateAccessJWT, isAccessTokenValid, isRefreshTokenValid} from "../utils/generateToken";



// Middleware to extract, verify, and attach user from Authorization header
export const verifyAccessToken = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) 
        throw new ApiError('Missing authentication token', 401, 'verifyToken.file')

    const token = authHeader.split(' ')[1]

    const user = isAccessTokenValid(token)
    if(!user)
        throw new ApiError('Token is invalid or expired', 401)

    req.currentUser = user
    next()
}

// Middleware to verify refresh token, regenerate and return new access token
export const verifyRefreshToken = async(req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) 
        throw new ApiError('Refresh token is missing from cookies', 401);

    const user = isRefreshTokenValid(refreshToken)
    if(!user)
        throw new ApiError('Token is invalid or expired', 401)

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