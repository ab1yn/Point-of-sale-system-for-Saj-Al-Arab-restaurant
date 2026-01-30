import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.get('/me', authenticate, AuthController.me);
authRouter.post('/logout', authenticate, AuthController.logout);
