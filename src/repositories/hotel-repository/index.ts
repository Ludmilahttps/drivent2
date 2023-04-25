import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findHotels,
  findRooms,
};

export default hotelRepository;
