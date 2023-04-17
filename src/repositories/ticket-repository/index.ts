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

const ticketRepository = {
  createTicket,
  findTicketType,
};

export default ticketRepository;