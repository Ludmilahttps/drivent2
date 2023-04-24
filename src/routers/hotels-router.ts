import { Router } from 'express';
import { findRooms, findHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();
hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', findHotels);
hotelsRouter.get('/:hotelId', findRooms);

export { hotelsRouter };