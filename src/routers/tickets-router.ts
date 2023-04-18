import { Router } from 'express';
import { createTicket, getTickets, getTicketsTypes } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.get('/', getTickets);
ticketsRouter.get('/types', getTicketsTypes);
ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };