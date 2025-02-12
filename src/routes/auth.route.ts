import { Router } from 'express';
import { getGoogleOAuthHandler, googleOAuthHandler } from '../controllers/googleAuth.controller'
import { verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router()

authRouter.get('/oauth/google', getGoogleOAuthHandler)

authRouter.post('/oauth/google/login', googleOAuthHandler)

authRouter.post('/tokens/refresh', verifyRefreshToken)

export default authRouter