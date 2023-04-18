import { prisma } from '@/config';

async function findTicketType(ticketTypeId: number) {
    return await prisma.ticketType.findFirst({ where: { id: ticketTypeId } });
}

type CreateTicket = { ticketTypeId: number; enrollmentId: number };

async function createTicket(ticket: CreateTicket) {
    return await prisma.ticket.create({
        data: {
            ...ticket,
            status: 'RESERVED',
        },
    });
}

async function getTickets() {
    return await prisma.ticket.findMany({
        include: {
            TicketType: true,
        },
    });
}

async function getTicketsTypes() {
    return await prisma.ticketType.findMany();
}

const ticketRepository = {
    createTicket,
    findTicketType,
    getTickets,
    getTicketsTypes,
};

export default ticketRepository;