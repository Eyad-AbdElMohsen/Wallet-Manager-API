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
 *   description: Transactions' routes
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     security:
 *       - BearerAuth: []
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletId:
 *                 type: string
 *                 example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *               amount:
 *                 type: number
 *                 example: 150
 *               category:
 *                 type: string
 *                 enum: 
 *                   - Salary
 *                   - Freelance
 *                   - Gift
 *                   - Refund
 *                   - Food
 *                   - Shopping
 *                   - Entertainment
 *                   - Education
 *                   - Investment
 *                   - Investment Returns
 *                   - Donations
 *                   - Other
 *                 example: "Food"
 *               type: 
 *                 type: string
 *                 enum: 
 *                   - credit
 *                   - debit
 *                 example: "credit"
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     walletId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     amount:
 *                       type: number
 *                       example: 150.5
 *                     category:
 *                       type: string
 *                       example: "Food"
 *                     type: 
 *                       type: string
 *                       example: "credit"
 *                     userId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                 oldBalance:
 *                       type: number
 *                       example: 1500
 *                 currentBalance: 
 *                       type: number
 *                       example: 1320     
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 */


transactionRouter.post('/transactions', verifyAccessToken, isMyWalletFromBody, transactionController.createNewTransaction)

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transactions' routes
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get User transaction by id
 *     security:
 *       - BearerAuth: []
 *     tags: [Transactions]
 *     description: Getting user's transaction by id using his token
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
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     walletId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     amount:
 *                       type: number
 *                       example: 150.5
 *                     category:
 *                       type: string
 *                       example: "Food"
 *                     type: 
 *                       type: string
 *                       example: "credit"
 *                     userId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"    
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 */


transactionRouter.get('/transactions/:transactionId', verifyAccessToken, isMyTransaction, transactionController.getMyTransaction)


export default transactionRouter