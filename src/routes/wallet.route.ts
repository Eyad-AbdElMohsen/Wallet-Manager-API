import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken";
import * as walletController from '../controllers//wallet.controller'

const walletRouter = Router()

walletRouter.post('/wallets', verifyAccessToken, walletController.createWallet)
walletRouter.get('/wallets', verifyAccessToken, walletController.getMyWallets)

walletRouter.get('/wallets/:walletId', verifyAccessToken, walletController.getWalletById)

export default walletRouter