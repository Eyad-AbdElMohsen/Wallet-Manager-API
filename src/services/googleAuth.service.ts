import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IUser, User } from "../models/user.model";
import { OAuth2Client } from 'google-auth-library';
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import ApiError from "../errors/api.error";

const client = new OAuth2Client(
    process.env.ClientID, 
    process.env.ClientSecret, 
    process.env.googleOAuthRedirectUrl
);

export const getGoogleAuthHandler = (scope: string) => client.generateAuthUrl({ scope }) 

export const googleOAuthHandler = async (code: string) => {
    // Get Tokens with the authorization code 
    const data = await getGoogleUserTokens(code);
    if(!data.tokens.id_token)
        throw new ApiError('internal server error', 500)
    
    // Retrieve user information using the tokens
    const googleUser = await getGoogleUser(data);
    if(!googleUser)
        throw new ApiError('internal server error', 500)
    
    return googleUser 
}

export const getGoogleUserTokens = async (code: string) => await client.getToken(code)

export const getGoogleUser = async(data: GetTokenResponse) => {
    const ticket = await client.verifyIdToken({
        idToken: data.tokens.id_token!
    });
    return ticket.getPayload()
}

export const upsertUser = async (
    query: FilterQuery<IUser>,
    update: UpdateQuery<IUser>,
    options: QueryOptions = {}
) => {
    return User.findOneAndUpdate(query, update, options);
};

