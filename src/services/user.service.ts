import { User } from "../models/user.model"

// unusable till now 
export const getUserByGoogleId = async(id: string) => {
    return User.findOne({googleId: id})
}