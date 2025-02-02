import { JwtPayload } from "../models/user.model";
import { IWallet } from "../models/wallet.model";
declare global {
    namespace Express {
        export interface Request {
            currentUser?: JwtPayload;
            wallet?: IWallet
        }
    }
}