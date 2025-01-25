import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IUser, User } from "../models/user.model";

export const findAndUpdateUser = async (
    query: FilterQuery<IUser>,
    update: UpdateQuery<IUser>,
    options: QueryOptions = {}
) => {
    return User.findOneAndUpdate(query, update, options);
};
