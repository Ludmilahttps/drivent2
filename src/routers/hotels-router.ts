import { Router } from 'express';
import { findHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();
hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', findHotels);

export { hotelsRouter };