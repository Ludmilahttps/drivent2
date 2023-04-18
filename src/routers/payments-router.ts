import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, findPayments } from '@/controllers';
import { createPaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', findPayments);
paymentsRouter.post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };