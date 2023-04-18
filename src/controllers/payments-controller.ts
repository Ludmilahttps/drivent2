import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export type PaymentInfoType = {
    ticketId: number;
    cardData: {
        issuer: string;
        number: number;
        name: string;
        expirationDate: Date;
        cvv: number;
    };
};

export async function createPayment(_req: AuthenticatedRequest, res: Response) {
    const paymentInfo = _req.body as PaymentInfoType;
    const { userId } = _req as { userId: number };

    try {
        const payment = await paymentsService.createPayment({ paymentInfo, userId });

        return res.status(httpStatus.OK).send(payment);
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        console.log(error);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

