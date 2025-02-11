import { RequestHandler } from "express";
import ApiError from '../errors/api.error';
import { generateAccessJWT, generateRefreshJWT, isRefreshTokenValid } from '../utils/generateToken';
import * as googleAuthServices from '../services/googleAuth.service';

export const getGoogleOAuthHandler: RequestHandler = (req, res)=> {
    const scope = 'email profile'
    const oauthUrl = googleAuthServices.getGoogleAuthHandler(scope)
    res.status(200).json({ oauthUrl });
}

export const googleOAuthHandler: RequestHandler = async(req, res) => {
    // get code from qs
    const code = req.query.code as string
    if (!code) 
        throw new ApiError('Authorization code is missing', 400)
    
    // get google user by code
    const googleUser = await googleAuthServices.googleOAuthHandler(code)
    
    // upsert (update or insert) the user
    const email = googleUser.email!
    const googleId = googleUser.sub

	if(!googleUser.email_verified) throw new ApiError('Email is not verified', 403)
    const user = await googleAuthServices.upsertUser({ // query
        email
    }, { // update
        name: googleUser.name,
        picture: googleUser.picture,
        email,
        googleId,
        
    }, { // options
        upsert: true,
        new: true
    });  

    // access & refresh token
    const accessToken = await generateAccessJWT({
        googleId,
        email,
        userId: user!._id
    });

    const refreshToken = await generateRefreshJWT({        
        googleId,
        email,
        userId: user!._id
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  
        secure: true,  
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    res.status(200).json({
        data:{
            user,
            accessToken
        }
    })
}

