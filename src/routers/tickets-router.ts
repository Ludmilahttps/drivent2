import { Router } from 'express';
import { createTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.get('/', );
ticketsRouter.get('/types', );
ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };