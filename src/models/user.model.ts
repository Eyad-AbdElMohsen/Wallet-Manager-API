import mongoose, { Schema, Document, Model } from "mongoose"
import env from "../env"

const DB_URL = env.DB_URL
mongoose.connect(DB_URL).then(()=> console.log('mongodb server start'))

const userSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},
    picture: {type: String, required: true},
    googleId: {type: String, required: true, unique: true},
    _id: {type: String},
})

export interface IUser extends Document { 
    name: string,
    email: string,
    picture: string,
    googleId: string,
    _id: string,
    accessToken: string,
    refreshToken: string 
}

export interface JwtPayload {
    userId: string,
    googleId: string,
    email: string
}

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);