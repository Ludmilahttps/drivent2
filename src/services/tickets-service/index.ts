import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

type CreateTicketType = {
    ticketTypeId: number;
    userId: number;
};

async function createTicket(ticket: CreateTicketType) {
    const { ticketTypeId, userId } = ticket;
    const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
    if (!enrollmentId) throw notFoundError();
    const response = await ticketRepository.createTicket({ ticketTypeId, enrollmentId });
    if (!response) throw notFoundError();
    return response;
}

async function getTicketType(ticketTypeId: number) {
    return await ticketRepository.findTicketType(ticketTypeId);
}

async function getTickets(userId: number) {
    const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
    if (!enrollmentId) throw notFoundError();
    return await ticketRepository.getTickets();
}

async function getTicketsTypes() {
    return await ticketRepository.getTicketsTypes();
}

const ticketsService = {
    createTicket,
    getTicketType,
    getTickets,
    getTicketsTypes,
};

export default ticketsService;