import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { number } from 'joi';

export async function findHotels(_req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = _req as { userId: number };
    const [hotels] = await hotelsService.findHotels(userId);
    if (!hotels) throw new Error();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}