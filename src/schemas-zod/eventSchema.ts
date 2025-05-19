import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  totalSeats: z.preprocess((val) => Number(val), z.number().min(1)),
  price: z.number().min(0, { message: "Price must be 0 or more" }),
  location: z.string().min(3),
});

export const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
  totalSeats: z.number().min(1).optional(),
  price: z.number().min(0).optional(),
  location: z.string().min(3).optional(),
});