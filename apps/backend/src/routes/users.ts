import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireRole } from '../middleware/auth';

export const userRouter = Router();

userRouter.get('/', requireRole('admin', 'manager'), UserController.getAll);
userRouter.post('/', requireRole('admin'), UserController.create);
