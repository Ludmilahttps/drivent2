import { ApplicationError } from '@/protocols';

export function ticketTypeError(): ApplicationError {
    return {
      name: 'TicketTypeIsNotRemoteError',
      message: 'Ticket type must be remote!',
    };
  }