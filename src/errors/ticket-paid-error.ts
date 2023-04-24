import { ApplicationError } from '@/protocols';

export function ticketPaidError(): ApplicationError {
  return {
    name: 'TicketNotPaidError',
    message: 'Ticket is not paid!',
  };
}