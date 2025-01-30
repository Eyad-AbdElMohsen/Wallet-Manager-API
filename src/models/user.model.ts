import mongoose, { Document, Model } from "mongoose"
import env from "../env"
import { v4 as uuidv4 } from "uuid";

const DB_URL = env.DB_URL
mongoose.connect(DB_URL).then(()=> console.log('mongodb server start'))

const userSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},
    picture: {type: String, required: true},
    googleId: {type: String, required: true, unique: true},
},{
    timestamps: true
})

export interface IUser extends Document { 
    _id: string,
    name: string,
    email: string,
    picture: string,
    googleId: string,
}

export interface JwtPayload {
    userId: string,
    googleId: string,
    email: string
}

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);