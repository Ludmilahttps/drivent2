import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment } from '@/controllers';
import { createPaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', );
paymentsRouter.post('/process', validateBody(createPaymentSchema));

export { paymentsRouter };