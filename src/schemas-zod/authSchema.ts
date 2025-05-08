import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).nonempty("Name is required"),
  email: z.string().email(),
  password: z.string().min(6).nonempty("Password is required"),
  role: z.enum(['CUSTOMER', 'ORGANIZER']),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
