import { Router } from 'express';
import { getGoogleOAuthHandler, getSessionHandler, googleOAuthHandler } from '../controllers/googleAuth.controller'
import { verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router()

authRouter.get('/oauth/google', getGoogleOAuthHandler)

authRouter.get('/api/sessions/oauth/google', googleOAuthHandler)

authRouter.get('/api/sessions/me', getSessionHandler);

authRouter.post('/tokens/refresh', verifyRefreshToken)

export default authRouter