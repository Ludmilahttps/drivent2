import { ApplicationError } from '@/protocols';

export function ticketPaidError(): ApplicationError {
  return {
    name: 'TicketPaidError',
    message: 'Ticket is not paid!',
  };
}

export function ticketTypeError(): ApplicationError {
  return {
    name: 'TicketTypeError',
    message: 'Ticket type must be remote!',
  };
}