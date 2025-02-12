import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken";
import * as walletController from '../controllers//wallet.controller'
import * as transactionController from '../controllers//transaction.controller'
import { isMyWalletFromParam } from "../middlewares/isMyWallet.middleware";

const walletRouter = Router()

walletRouter.post('/wallets', verifyAccessToken, walletController.createWallet)

walletRouter.get('/wallets', verifyAccessToken, walletController.getMyWallets)

walletRouter.get('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.getWalletById)

walletRouter.patch('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.updateWalletBalance)

walletRouter.delete('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.deleteMyWallet)

walletRouter.get('/wallets/balance/me', verifyAccessToken, walletController.getAllMyCurrentBalance)

walletRouter.get('/wallets/:walletId/transactions', verifyAccessToken, isMyWalletFromParam, transactionController.getTransactionHistory)


export default walletRouter
