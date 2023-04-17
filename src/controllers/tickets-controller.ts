import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function createTicket(_req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = _req.body as { ticketTypeId: number };
  const { userId } = _req as { userId: number };

  try {
    const response = await ticketsService.createTicket({ ticketTypeId, userId });

    const typeResponse = await ticketsService.getTicketType(ticketTypeId);

    return res.status(httpStatus.CREATED).send({
      ...response,
      TicketType: { ...typeResponse },
    });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}