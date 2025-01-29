import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import ApiError from '../errors/api.error';
import { generateAccessJWT, generateRefreshJWT } from '../utils/generateToken';
import * as googleAuthServices from '../services/googleAuth.service';


if(!process.env.ClientID || !process.env.ClientSecret || !process.env.googleOAuthRedirectUrl)
    throw new Error('Missing google credentials')

export const getGoogleOAuthHandler = (req: Request, res: Response)=> {
    const scope = 'email profile'
    const oauthUrl = googleAuthServices.getGoogleAuthHandler(scope)
    res.status(200).json({ oauthUrl });
}

export const googleOAuthHandler = async(req: Request, res: Response) => {
    // get code from qs
    const code = req.query.code as string
    if (!code) 
        throw new ApiError('Authorization code is missing', 500)

    // get google user by code
    const googleUser = await googleAuthServices.googleOAuthHandler(code)
    
    // upsert (update or insert) the user
    const email = googleUser.email!
    const googleId = googleUser.sub

	if(!googleUser.email_verified) throw new ApiError('google acc is not verified', 403)
    const user = await googleAuthServices.upsertUser({ 
        email
    }, {
        name: googleUser.name,
        picture: googleUser.picture,
        email,
        googleId
    }, {
        upsert: true,
        new: true
    });  

    // create access & refresh token
    const accessToken = generateAccessJWT({
        googleId,
        email,
        userId: user!._id
    })

    const refreshToken = generateRefreshJWT({        
        googleId,
        email,
        userId: user!._id
    })

    // Redirect the user back to the client with the session and tokens
    res.status(200).json({
        data: {
            user: googleUser,
            accessToken,
            refreshToken
        }
    })
}