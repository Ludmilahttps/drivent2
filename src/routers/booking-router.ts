import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, findBooking } from '@/controllers';
import { bookingSchema, bookingSchemaUpdate } from '@/schemas/booking-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', findBooking)
  .post('/', validateBody(bookingSchema), createBooking);

export { bookingsRouter };