import { Router } from 'express';
import { getGoogleOAuthHandler, googleOAuthHandler } from '../middlewares/googleAuth.middleware';
import { verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router()

authRouter.route('/oauth/google')
    .get(getGoogleOAuthHandler)

authRouter.route('/api/sessions/oauth/google')
    .get(googleOAuthHandler)

authRouter.route('/tokens/refresh')
    .post(verifyRefreshToken)
