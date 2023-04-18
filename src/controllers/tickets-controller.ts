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
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function getTickets(_req: AuthenticatedRequest, res: Response) {
    const { userId } = _req as { userId: number };
    try {
        const [tickets] = await ticketsService.getTickets(userId);
        if (!tickets) throw new Error();
        return res.status(httpStatus.OK).send(tickets);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function getTicketsTypes(_req: AuthenticatedRequest, res: Response) {
    try {
        const ticketsTypes = await ticketsService.getTicketsTypes();
        return res.status(httpStatus.OK).send(ticketsTypes);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}