import { Router } from 'express';
import { getGoogleOAuthHandler, googleOAuthHandler } from '../controllers/googleAuth.controller'
import { verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router()


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /oauth/google:
 *   get:
 *     summary: Get Google OAuth authentication link
 *     tags: [Auth]
 *     description: Returns a Google authentication URL for users to sign in or sign up using Google.
 *     responses:
 *       200:
 *         description: Successfully retrieved the Google OAuth link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oauthUrl:
 *                   type: string
 *                   example: "https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&response_type=code&client_id=1021167405046-i3omu0ha5m0m4ig0dtqgingmfcp1vu51.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwalletsmanager.netlify.app%2Fgoogle"
 */

authRouter.get('/oauth/google', getGoogleOAuthHandler)


/**
 * @swagger
 * /oauth/google/login:
 *   post:
 *     summary: Exchange Google auth code for user information and access tokens
 *     tags: [Auth]
 *     description: Receives a Google authentication code, verifies it, and returns user information along with an access token. The refresh token is stored in an HttpOnly cookie.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Google authorization code obtained from the OAuth flow
 *     responses:
 *       200:
 *         description: Successfully retrieved the Google User information
 *         headers:
 *           Set-Cookie:
 *             description: Contains the refresh token as an HttpOnly cookie
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVJZCI6IjExNjIzNDIyNTYwODQ5MDQ5NDc3NiIsImVtYWlsIjoiYWhtZWRleWFkODRAZ21haWwuY29tIiwidXNlcklkIjoiNjI4MjZkMjUtN2JlMC00ZmYzLTk2ZGMtZDllMGZmZDM1NTNlIiwiaWF0IjoxNzM5MDQyNzIzLCJleHAiOjE3Mzk2NDc1MjN9.-VZB-NeN4PXahYTYx6PZM3q9jgra-yamDtIiBo9WV60"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                      name:
 *                          type: string
 *                          example: "Eyad"
 *                      picture:
 *                          type: string
 *                          example: "https://lh3.googleusercontent.com/a/ACg8ocLAEiHKc3p7rUJsFlVtZhnOme7abKqu4YqeIBDFltpc30uH9Q=s96-c"
 *                      email:
 *                          type: string
 *                          example: "eyad@eyad.com"
 *                      googleId:
 *                          type: string
 *                          example: "116234225108290474999"
 *                 accessToken:
 *                          type: string
 *                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVJZCI6IjExNjIzNDIyNTYwODQ5MDQ5NDc3NiIsImVtYWlsIjoiYWhtZWRleWFkODRAZ21haWwuY29tIiwidXNlcklkIjoiNjI4MjZkMjUtN2JlMC00ZmYzLTk2ZGMtZDllMGZmZDM1NTNlIiwiaWF0IjoxNzM5MjM2NTE0LCJleHAiOjE3MzkyNTQ1MTR9._Bnp9Vpi-iet5bk3OMUyt8s3shRza5pntyVYpzVbgkE"
 *       400:
 *         description: Bad request - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authorization code is missing" 
 *       403:
 *         description: Forbidden - Email is not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is not verified"
 *       500:
 *         description: There is internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
*/

authRouter.post('/oauth/google/login', googleOAuthHandler)


/**
 * @swagger
 * /tokens/refresh:
 *   post:
 *     summary: Verify and refresh access token
 *     tags: [Auth]
 *     description: Validates the refresh token stored in cookies and returns a new access token if valid.
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The refresh token stored in cookies.
 *     responses:
 *       200:
 *         description: Successfully retrieved the new access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "156189181986161198123"
 *                     email:
 *                       type: string
 *                       example: "eyad@eyad.com"
 *                     googleId:
 *                       type: string
 *                       example: "116234225108290474999"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVJZCI6IjExNjIzNDIyNTYwODQ5MDQ5NDc3NiIsImVtYWlsIjoiYWhtZWRleWFkODRAZ21haWwuY29tIiwidXNlcklkIjoiNjI4MjZkMjUtN2JlMC00ZmYzLTk2ZGMtZDllMGZmZDM1NTNlIiwiaWF0IjoxNzM5MjM2NTE0LCJleHAiOjE3MzkyNTQ1MTR9._Bnp9Vpi-iet5bk3OMUyt8s3shRza5pntyVYpzVbgkE"
 *       400:
 *         description: Bad request - missing or invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token is missing from cookies"
 *       401:
 *         description: Unauthorized - Refresh token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is invalid or expired"
 */

authRouter.post('/tokens/refresh', verifyRefreshToken)

export default authRouter