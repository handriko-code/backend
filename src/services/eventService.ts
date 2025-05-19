import { prisma } from '../lib/prisma';
import { CreateEventDTO, UpdateEventDTO } from '../interfaces/event.interface';

export const createEvent = async (
  organizerId: string,
  data: {
    title: string;
    description: string;
    date: string;
    totalSeats: number;
    availableSeats: number;
    price: number;
    location: string;
  }
) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      organizerId,
      price: data.price,
      location: data.location,
    }
  });
};


export const getEventsByOrganizer = async (organizerId: string) => {
  return await prisma.event.findMany({
    where: { organizerId },
    orderBy: { date: 'asc' },
  });
};

export const getEventById = async (organizerId: string, eventId: string) => {
  return await prisma.event.findFirst({
    where: { id: eventId, organizerId },
  });
};

export const updateEvent = async (organizerId: string, eventId: string, data: UpdateEventDTO) => {
  const event = await prisma.event.findFirst({ where: { id: eventId, organizerId } });
  if (!event) throw new Error('Event not found or not authorized');

  return await prisma.event.update({
    where: { id: eventId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
};

export const deleteEvent = async (organizerId: string, eventId: string) => {
  const event = await prisma.event.findFirst({ where: { id: eventId, organizerId } });
  if (!event) throw new Error('Event not found or not authorized');

  return await prisma.event.delete({
    where: { id: eventId },
  });
};

export const getEventAttendees = async (organizerId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId },
  });

  if (!event) throw new Error('Event not found or not authorized');

  const transactions = await prisma.transaction.findMany({
    where: {
      eventId,
      status: 'ACCEPTED',
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions.map((trx) => ({
    userId: trx.user.id,
    name: trx.user.name,
    email: trx.user.email,
    quantity: trx.quantity,
    totalPrice: trx.totalPrice,
  }));
};
