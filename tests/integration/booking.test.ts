<<<<<<< HEAD
import { TicketStatus } from '@prisma/client';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import {
    createEnrollmentWithAddress,
    createHotel,
    createBookingTicketType,
    createRoomWithHotelId,
    createTicket,
    createTicketType,
    createUser,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createTicketTypeWithNoHotel,
} from '../factories';
=======
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createHotel,
  createRoomWithHotelId,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
>>>>>>> 010df8f2002da2e8e6e95ad0a43864bf497199d0
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
<<<<<<< HEAD
    await init();
});

beforeEach(async () => {
    await cleanDb();
=======
  await init();
});

beforeEach(async () => {
  await cleanDb();
>>>>>>> 010df8f2002da2e8e6e95ad0a43864bf497199d0
});

const server = supertest(app);

describe('GET /booking', () => {
<<<<<<< HEAD
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();

        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(6),
        });

        it('should respond 404 if user has no booking', async () => {
            const createdUser = await createUser(generateValidBody());

            const token = await generateValidToken(createdUser);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with booking', async () => {
            const createdUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const booking = await createBooking(createdUser.id, createdRoom.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    ...createdRoom,
                    createdAt: createdRoom.createdAt.toISOString(),
                    updatedAt: createdRoom.updatedAt.toISOString(),
                },
            });
        });
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();

        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(6),
        });

        it('should respond 400 if no body is sent', async () => {
            const createdUser = await createUser(generateValidBody());

            const token = await generateValidToken(createdUser);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond 404 if roomId is invalid', async () => {
            const createdUser = await createUser(generateValidBody());

            const token = await generateValidToken(createdUser);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond 403 if roomId is alreadyBooked', async () => {
            const createdUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            await createBooking(createdUser.id, createdRoom.id);

            const response = await server
                .post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 403 if ticket is not paid', async () => {
            const createdUser = await createUser(generateValidBody());

            const enrollment = await createEnrollmentWithAddress(createdUser);

            const ticketType = await createTicketType();

            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const response = await server
                .post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 403 if ticket is remote', async () => {
            const createdUser = await createUser(generateValidBody());

            const enrollment = await createEnrollmentWithAddress(createdUser);

            const ticketType = await createTicketTypeRemote();

            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const response = await server
                .post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it("should respond 403 if ticket doesn't include hotel", async () => {
            const createdUser = await createUser(generateValidBody());

            const enrollment = await createEnrollmentWithAddress(createdUser);

            const ticketType = await createTicketTypeWithNoHotel();

            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const response = await server
                .post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 200 and bookingId created', async () => {
            const createdUser = await createUser(generateValidBody());

            const enrollment = await createEnrollmentWithAddress(createdUser);

            const ticketType = await createBookingTicketType();

            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const response = await server
                .post('/booking')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number),
            });
        });
    });
});

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();

        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(6),
        });

        it('should respond 404 if roomId is invalid', async () => {
            const createdUser = await createUser(generateValidBody());

            const token = await generateValidToken(createdUser);

            const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond 403 if roomId is alreadyBooked', async () => {
            const createdUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            await createBooking(createdUser.id, createdRoom.id);

            const response = await server
                .put('/booking/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 403 if booking is from another user', async () => {
            const createdUser = await createUser(generateValidBody());

            const auxUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            await createBooking(auxUser.id, createdRoom.id);

            const response = await server
                .put('/booking/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 403 if user does not have bookings', async () => {
            const createdUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const response = await server
                .put('/booking/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: createdRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond 200 and bookingId updated', async () => {
            const createdUser = await createUser(generateValidBody());

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id);

            const auxRoom = await createRoomWithHotelId(createdHotel.id);

            const token = await generateValidToken(createdUser);

            const booking = await createBooking(createdUser.id, createdRoom.id);

            const response = await server
                .put(`/booking/${booking.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ roomId: auxRoom.id });

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: booking.id,
            });
        });
    });
});
=======
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has not a booking ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 when user has a booking ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
});

function createValidBody() {
  return {
    roomId: 1,
  };
}

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const validBody = createValidBody();
    const response = await server.post('/booking').send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const validBody = createValidBody();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const validBody = createValidBody();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with a valid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const validBody = createValidBody();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.OK);
    });
    it('should respond with status 400 with a invalid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const validBody = createValidBody();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: 0,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with status 404 with a invalid body - there's not roomId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const validBody = createValidBody();
      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({
          roomId: room.id + 1,
        });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 403 with a invalid body - there's not vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const ticketType = await createTicketTypeWithHotel();

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user has not paymented ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const validBody = createValidBody();
    const response = await server.put('/booking/1').send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const validBody = createValidBody();
    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const validBody = createValidBody();
    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with a valid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      const otherRoom = await createRoomWithHotelId(hotel.id);

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
        roomId: otherRoom.id,
      });

      expect(response.status).toEqual(httpStatus.OK);
    });

    it('should respond with status 400 with invalid bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      const otherRoom = await createRoomWithHotelId(hotel.id);

      const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send({
        roomId: otherRoom.id,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 400 with a invalid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
        roomId: 0,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with status 404 with a invalid body - there's no roomId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });
      const validBody = createValidBody();
      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          roomId: room.id + 1,
        });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 403 with a invalid body - there's not vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const otherRoom = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });
      await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });
      await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });

      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
        roomId: otherRoom.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 when user has not a booking ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const otherUser = await createUser();
      const otherUserBooking = await createBooking({
        userId: otherUser.id,
        roomId: room.id,
      });

      const validBody = createValidBody();
      const response = await server
        .put(`/booking/${otherUserBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          roomId: room.id,
        });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});
>>>>>>> 010df8f2002da2e8e6e95ad0a43864bf497199d0
