import hotelRepository from "@/repositories/hotel-repository";
import { notFoundError } from '@/errors';
import { ticketTypeError } from '@/errors/ticket-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from "@/repositories/tickets-repository";

async function findHotels(userId: number) {
    const { id: enrollmentId } = await enrollmentRepository.findById(userId);
    if (!enrollmentId) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);
    if (!ticket) throw notFoundError();

    if (ticket.status !== 'PAID') throw ticketTypeError();

    const { isRemote, includesHotel } = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
    if (!isRemote || !includesHotel) throw ticketTypeError();

    return await hotelRepository.findHotels();
}

const hotelsService = {
    findHotels,
};

export default hotelsService;