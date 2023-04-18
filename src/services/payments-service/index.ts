import { notFoundError, unauthorizedError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import { PaymentInfoType } from '@/controllers';

type FindPaymentsType = { userId: number; ticketId: number };

type CreatePaymentType = {
    paymentInfo: PaymentInfoType;
    userId: number;
};

async function findPayments({ userId, ticketId }: FindPaymentsType) {
    const ticket = await ticketRepository.getTicket(ticketId);
    if (!ticket) throw notFoundError();
    const enrollment = await enrollmentRepository.findEnrollment(ticket.enrollmentId);
    if (!enrollment) throw notFoundError();
    if (enrollment.userId !== userId) throw unauthorizedError();

    return await paymentsRepository.getPayments();
}

async function createPayment({ paymentInfo, userId }: CreatePaymentType) {
    const { ticketId, cardData } = paymentInfo;
    const ticket = await ticketRepository.getTicket(ticketId);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketRepository.findTicketType(ticket.ticketTypeId);
    const enrollment = await enrollmentRepository.findEnrollment(ticket.enrollmentId);

    if (!enrollment) throw notFoundError();
    if (enrollment.userId !== userId) throw unauthorizedError();

    await ticketRepository.updateTicket(ticketId);
    return await paymentsRepository.createPayment({ ticketId, cardData, value: ticketType.price });
}

const paymentsService = {
    findPayments,
    createPayment,
};

export default paymentsService;