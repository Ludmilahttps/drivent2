import { prisma } from '@/config';
import { PaymentInfoType } from '@/controllers';

async function createPayment({ ticketId, cardData, value }: PaymentInfoType & { value: number }) {
  return await prisma.payment.create({
    data: {
      ticketId,
      cardIssuer: cardData.issuer,
      cardLastDigits: String(cardData.number).slice(-4),
      value: value,
    },
  });
}

async function getPayments() {
  return await prisma.payment.findMany();
}

const paymentsRepository = {
  createPayment,
  getPayments,
};

export default paymentsRepository;