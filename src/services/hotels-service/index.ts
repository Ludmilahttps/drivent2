import hotelRepository from "@/repositories/hotel-repository";
import { notFoundError } from '@/errors';
import { ticketTypeError, ticketPaidError } from '@/errors/ticket-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from "@/repositories/tickets-repository";

async function findHotels(userId: number) {
    const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentId) throw notFoundError();
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId.id);
    console.log(ticket);
    if (!ticket || ticket.status !== 'PAID') throw ticketPaidError();
    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw ticketTypeError();

    return await hotelRepository.findHotels();
}

async function findRooms(userId: number, hotelId: number) {
    const enrollmentId = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentId) throw notFoundError();
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId.id);
    console.log(ticket);
    if (!ticket || ticket.status !== 'PAID') throw ticketPaidError();
    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw ticketTypeError();

    const hotel = await hotelRepository.findRooms(hotelId);
    if (!hotel) throw notFoundError();

    return hotel;
}

const hotelsService = {
    findHotels,
    findRooms,
};

export default hotelsService;
