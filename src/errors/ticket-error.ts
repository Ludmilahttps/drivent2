import { ApplicationError } from '@/protocols';

export function ticketPaidError(): ApplicationError {
  return {
    name: 'TicketNotPaidError',
    message: 'Ticket is not paid!',
  };
}

export function ticketTypeError(): ApplicationError {
  return {
    name: 'TicketTypeIsNotRemoteError',
    message: 'Ticket type must be remote!',
  };
}