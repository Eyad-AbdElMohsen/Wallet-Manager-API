import { Router } from "express";
import * as transactionController from '../controllers/transaction.controller'
import { verifyAccessToken } from "../middlewares/verifyToken";
import { isMyWalletFromBody } from "../middlewares/isMyWallet.middleware";
import { isMyTransaction } from "../middlewares/isMyTransaction.middleware";

const transactionRouter = Router() 

transactionRouter.post('/transactions', verifyAccessToken, isMyWalletFromBody, transactionController.createNewTransaction)

transactionRouter.get('/transactions/:transactionId', verifyAccessToken, isMyTransaction, transactionController.getMyTransaction)


export default transactionRouter