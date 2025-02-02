import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken";
import * as walletController from '../controllers//wallet.controller'
import * as transactionController from '../controllers//transaction.controller'
import { isMyWallet } from "../middlewares/isMyWallet.middleware";

const walletRouter = Router()

walletRouter.post('/wallets', verifyAccessToken, walletController.createWallet)

walletRouter.get('/wallets', verifyAccessToken, walletController.getMyWallets)

walletRouter.get('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.getWalletById)

walletRouter.patch('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.updateWalletBalance)

walletRouter.delete('/wallets/:walletId', verifyAccessToken, isMyWallet, walletController.deleteMyWallet)

walletRouter.get('/wallets/balance/me', verifyAccessToken, walletController.getAllMyCurrentBalance)

walletRouter.get('/wallets/:walletId/transactions', verifyAccessToken, isMyWallet, transactionController.getTransactionHistory)


export default walletRouter