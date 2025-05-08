import { prisma } from '../lib/prisma';
import { sendEmail } from '../utils/email';
import { generateShortId } from '../utils/id';
import { TransactionStatus } from '../interfaces/transaction.interface';
import path from 'path';

export const createTransaction = async (userId: string, data: {
  eventId: string;
  quantity: number;
}) => {
  const event = await prisma.event.findUnique({
    where: { id: data.eventId },
    select: {
      price: true,
      availableSeats: true,
    },
  });

  if (!event) throw new Error('Event not found');
  if (event.availableSeats < data.quantity) throw new Error('Not enough seats available');

  const totalPrice = data.quantity * event.price;

  const transaction = await prisma.transaction.create({
    data: {
      id: generateShortId(),
      userId,
      eventId: data.eventId,
      quantity: data.quantity,
      totalPrice,
      status: 'PENDING'
    }
  });

  await prisma.event.update({
    where: { id: data.eventId },
    data: {
      availableSeats: {
        decrement: data.quantity
      }
    }
  });

  return transaction;
};

export const uploadPaymentProof = async (userId: string, transactionId: string, filePath: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction || transaction.userId !== userId) {
    throw new Error('Unauthorized or transaction not found');
  }

  if (transaction.status !== 'PENDING') {
    throw new Error('Transaction already processed');
  }

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      paymentProof: filePath,
    },
  });
};
;

export const updateTransactionStatus = async (
  organizerId: string,
  transactionId: string,
  status: TransactionStatus
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { event: true, user: true },
  });

  if (!transaction || transaction.event.organizerId !== organizerId) {
    throw new Error('Transaction not found or not authorized');
  }

  if (transaction.status !== 'PENDING') {
    throw new Error('Transaction already processed');
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status },
  });

  if (status === 'REJECTED') {
    await prisma.event.update({
      where: { id: transaction.eventId },
      data: {
        availableSeats: { increment: transaction.quantity },
      },
    });
  }

  await sendEmail(
    transaction.user.email,
    `Your transaction for event ${transaction.event.title} is ${status}`,
    `Hi ${transaction.user.name}, your transaction has been ${status.toLowerCase()}.`
  );

  return { message: `Transaction ${status}` };
};

export const getAllTransactionsForOrganizer = async (organizerId: string) => {
  return await prisma.transaction.findMany({
    where: { event: { organizerId } },
    include: { user: true, event: true },
    orderBy: { createdAt: 'desc' },
  });
};