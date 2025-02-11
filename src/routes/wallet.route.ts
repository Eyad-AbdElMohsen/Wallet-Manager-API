import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyToken";
import * as walletController from '../controllers//wallet.controller'
import * as transactionController from '../controllers//transaction.controller'
import { isMyWalletFromParam } from "../middlewares/isMyWallet.middleware";

const walletRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management routes
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management routes
 */

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a new wallet
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Creates a new wallet for the authenticated user.
 *     responses:
 *       200:
 *         description: Wallet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     userId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     walletName:
 *                       type: string
 *                       example: "My Wallet"
 *                     currentBalance:
 *                       type: number
 *                       example: 1000.50
 *                     type:
 *                       type: string
 *                       enum:
 *                          - cash
 *                          - bank
 *                          - crypto
 *                          - e_wallet
 *                       example: cash
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 */
walletRouter.post('/wallets', verifyAccessToken, walletController.createWallet)

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get all user wallets
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Getting all wallets belonging to the authenticated user with filtering, sorting, and pagination options.
 *     parameters:
 *       - $ref: "#/components/parameters/Sort"
 *       - $ref: "#/components/parameters/Limit"
 *       - $ref: "#/components/parameters/Page"
 *       - $ref: "#/components/parameters/Fields"
 *       - $ref: "#/components/parameters/Filter"
 *     responses:
 *       200:
 *         description: Successfully retrieved wallets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 wallets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                         id:
 *                           type: string
 *                           example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                         userId:
 *                           type: string
 *                           example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                         walletName:
 *                           type: string
 *                           example: "My Wallet"
 *                         currentBalance:
 *                           type: number
 *                           example: 1000.50
 *                         type:
 *                           type: string
 *                           example: cash
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 */
walletRouter.get('/wallets', verifyAccessToken, walletController.getMyWallets)

/**
 * @swagger
 * /wallets/{walletId}:
 *   get:
 *     summary: Get wallet by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Retrieve a specific wallet by its ID. Only the owner can access it.
 *     parameters:
 *       - name: walletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wallet to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the wallet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     userId:
 *                       type: string
 *                       example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                     walletName:
 *                       type: string
 *                       example: "Personal Wallet"
 *                     currentBalance:
 *                       type: number
 *                       example: 5000
 *                     type:
 *                       type: string
 *                       example: bank
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *  
 *   patch:
 *     summary: Update wallet balance
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Update the balance of a specific wallet. Only the owner can update it.
 *     parameters:
 *       - name: walletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wallet to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newBalance:
 *                 type: number
 *                 example: 200
 *     responses:
 *       200:
 *         description: Wallet balance updated successfully.
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *
 *   delete:
 *     summary: Delete a wallet
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Delete a specific wallet. Only the owner can delete it.
 *     parameters:
 *       - name: walletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wallet to delete
 *     responses:
 *       200:
 *         description: Wallet deleted successfully.
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 */
walletRouter.get('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.getWalletById)
walletRouter.patch('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.updateWalletBalance)
walletRouter.delete('/wallets/:walletId', verifyAccessToken, isMyWalletFromParam, walletController.deleteMyWallet)

/**
 * @swagger
 * /wallets/balance/me:
 *   get:
 *     summary: Get total balance of all wallets
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Retrieve the total balance of all wallets belonging to the authenticated user.
 *     responses:
 *       200:
 *         description: Successfully retrieved total balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 allCurrentBalance:
 *                   type: number
 *                   example: 15000
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 */
walletRouter.get('/wallets/balance/me', verifyAccessToken, walletController.getAllMyCurrentBalance)


/**
 * @swagger
 * /wallets/{walletId}/transactions:
 *   get:
 *     summary: Get transaction history for a wallet
 *     security:
 *       - BearerAuth: []
 *     tags: [Wallets]
 *     description: Retrieve the transaction history of a specific wallet. Only the owner can view it.
 *     parameters:
 *       - $ref: "#/components/parameters/Sort"
 *       - $ref: "#/components/parameters/Limit"
 *       - $ref: "#/components/parameters/Page"
 *       - $ref: "#/components/parameters/Fields"
 *       - $ref: "#/components/parameters/Filter"
 *       - name: walletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the wallet to fetch transactions for
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                       userId:
 *                         type: string
 *                         example: "65d2f1bfe1b1c2a7f4e6b7c9"
 *                       amount:
 *                         type: number
 *                         example: 150.50
 *                       category:
 *                         type: string
 *                         example: "Food"
 *                       type:
 *                         type: string
 *                         example: debit
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 */ 
walletRouter.get('/wallets/:walletId/transactions', verifyAccessToken, isMyWalletFromParam, transactionController.getTransactionHistory)


export default walletRouter