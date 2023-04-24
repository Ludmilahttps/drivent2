import { prisma } from '@/config';
import { Hotel, Room } from '@prisma/client';

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  const hotel: Hotel & { Rooms?: Room[] } = await prisma.hotel.findFirst({
    where: { id: hotelId },
  });

  const rooms = await prisma.room.findMany({
    where: { hotelId: hotel.id },
  });

  return {
    id: hotel.id,
    name: hotel.name,
    Image: hotel.image,
    createdAt: hotel.createdAt,
    updatedAt: hotel.updatedAt,
    Rooms: rooms,
  };
}

const hotelRepository = {
  findHotels,
  findRooms,
};

export default hotelRepository;