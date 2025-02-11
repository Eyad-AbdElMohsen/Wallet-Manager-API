import { Router } from "express";
import * as transactionController from '../controllers/transaction.controller'
import { verifyAccessToken } from "../middlewares/verifyToken";
import { isMyWalletFromBody } from "../middlewares/isMyWallet.middleware";
import { isMyTransaction } from "../middlewares/isMyTransaction.middleware";

const transactionRouter = Router() 

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management routes
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     security:
 *       - BearerAuth: []
 *     tags: [Transactions]
 *     description: |
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Transaction"    
 *     responses:
 *       200:
 *         description: Successfully, Transaction has been created!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 transaction:
 *                    $ref: "#/components/schemas/Transaction"
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *  */


transactionRouter.post('/transactions', verifyAccessToken, isMyWalletFromBody, transactionController.createNewTransaction)

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get User transaction by id
 *     security:
 *       - BearerAuth: []
 *     tags: [Transactions]
 *     description: | 
 *       Getting user's transaction by id using his token
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
 *     responses:
 *       200:
 *         description: Successfully, Transaction here is found!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *               transaction:
 *                    $ref: "#/components/schemas/Transaction"   
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 */


transactionRouter.get('/transactions/:transactionId', verifyAccessToken, isMyTransaction, transactionController.getMyTransaction)


export default transactionRouter