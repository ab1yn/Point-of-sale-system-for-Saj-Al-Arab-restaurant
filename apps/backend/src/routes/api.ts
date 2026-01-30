import { Router } from 'express';
import { categoryRouter, productRouter, modifierRouter } from './catalog';
import { orderRouter, paymentRouter } from './order';
import { ReportController } from '../controllers/misc.controller';
import { authRouter } from './auth';
import { userRouter } from './users';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use('/auth', authRouter);
router.use(authenticate);

router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/modifiers', modifierRouter);
router.use('/orders', orderRouter);
router.use('/payments', paymentRouter);
router.use('/users', userRouter);

router.get('/reports/daily', requireRole('admin', 'manager'), ReportController.getDaily);

export default router;
