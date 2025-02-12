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
 *                   example: "https://accounts.google.com/o/oauth2/v2/auth?..."
 */

/**
 * @swagger
 * /oauth/google/login:
 *   post:
 *     summary: Exchange Google auth code for user information and access tokens
 *     tags: [Auth]
 *     description: Receives a Google authentication code, verifies it, and returns user information along with an access token.
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
 *               example: "refreshToken=..."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                    $ref: "#/components/schemas/User"
 *                 accessToken:
 *                    type: string
 *                    example: "eyJhbGciOiJIUzI1NiIs..."
 */

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
 *                    $ref: "#/components/schemas/JwtPayload"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 */
