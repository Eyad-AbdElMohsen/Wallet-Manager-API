import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import ApiError from '../errors/api.error';
import { OAuth2Client } from 'google-auth-library';
import { findAndUpdateUser } from '../services/googleAuth.service';
import { generateAccessJWT, generateRefreshJWT } from '../utils/generateToken';
import { getUserByGoogleId } from '../services/user.service';

if(!process.env.ClientID || !process.env.ClientSecret || !process.env.googleOAuthRedirectUrl)
    throw new Error('Missing google credentials')

const client = new OAuth2Client(process.env.ClientID, process.env.ClientSecret, process.env.googleOAuthRedirectUrl)


export const getGoogleOAuthHandler = (req: Request, res: Response)=> {
    const scope = 'email profile'
    const oauthUrl = client.generateAuthUrl({ scope }) 
    res.status(200).json({ oauthUrl });
}

export const googleOAuthHandler = async(req: Request, res: Response) => {
    // get code from qs
    const code = req.query.code as string
    if (!code) 
        throw new ApiError('Authorization code is missing', 400)

    // get id and access token with the code 
    const data = await client.getToken(code);
    if(!data.tokens.id_token)
        throw new ApiError('id_token from google is missing', 400)

    // get the user with tokens 
    const ticket = await client.verifyIdToken({
        idToken: data.tokens.id_token,
    });
    const googleUser = ticket.getPayload();
    if(!googleUser)
        throw new ApiError('User is missing', 401)
    
    // upsert (update or insert) the user
    const email = googleUser.email!
    const googleId = googleUser.sub
    const userId = (await getUserByGoogleId(googleId) as NonNullable<typeof user>)._id;

    
	if(!googleUser.email_verified) res.status(403).send('google acc is not verified')
    const user = await findAndUpdateUser({ 
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
        userId
    })

    const refreshToken = generateRefreshJWT({        
        googleId,
        email,
        userId
    })

    // Redirect the user back to the client with the session and tokens
    res.status(200).send({
        data: {
            user: googleUser,
            accessToken,
            refreshToken
        }
    })
}