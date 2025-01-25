import { User } from "../models/user.model"

export const getUserByGoogleId = async(id: string) => {
    return User.findById({googleId: id})
}