import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken";
import * as walletController from '../controllers//wallet.controller'
import { isMyWallet } from "../middlewares/isMyWallet.middleware";

const walletRouter = Router()

walletRouter.post('/wallets', verifyAccessToken, walletController.createWallet)

walletRouter.get('/wallets', verifyAccessToken, walletController.getMyWallets)

walletRouter.get('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.getWalletById)

walletRouter.patch('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.updateWalletBalance)

walletRouter.delete('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.deleteMyWallet)


export default walletRouter