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
 *     description: |
 *       Creates a new wallet for the authenticated user.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Wallet"   
 *     responses:
 *       200:
 *         description: Wallet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wallet"  
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
 *     description: |
 *       Getting all wallets belonging to the authenticated user with filtering, sorting, and pagination options.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response.
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
 *                    $ref: "#/components/schemas/Wallet"  
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
 *     description: |
 *       Retrieve a specific wallet by its ID. Only the owner can access it.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response.
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
 *                   $ref: "#/components/schemas/Wallet"  
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
 *     description: |
 *       Update the balance of a specific wallet. Only the owner can update it.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response.
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
 *     description: |
 *       Delete a specific wallet. Only the owner can delete it.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
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
 *     description: | 
 *       Retrieve the total balance of all wallets belonging to the authenticated user.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
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
 *     description: |
 *       Retrieve the transaction history of a specific wallet. Only the owner can view it.
 *  
 *       🚨⚠️ **Important**: You must include a Bearer token in the request header for authentication.  Without it, you'll receive a **401 Unauthorized** response. 
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
 *                     $ref: "#/components/schemas/Transaction"  
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