import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { number } from 'joi';

export async function findHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req as { userId: number };
    const [hotels] = await hotelsService.findHotels(userId);
    if (!hotels) throw new Error();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function findRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };
  const { hotelId } = req.query as { hotelId: string };
  try {
    const hotelRooms = await hotelsService.findRooms(userId, +hotelId);
    if (!hotelRooms) throw new Error();
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}