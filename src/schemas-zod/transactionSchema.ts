import { z } from 'zod';

export const updateTransactionStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});


export const createTransactionSchema = z.object({
  eventId: z.string().min(1),
  quantity: z.number().min(1, { message: 'Minimal 1 tiket' }),
});