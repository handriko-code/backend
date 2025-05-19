import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { register, login } from '../services/authService';
import { registerSchema, loginSchema } from '../schemas-zod/authSchema';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await register(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).send('Invalid verification link');
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).send('User not found');
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    return res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch (error) {
    console.error('Verification failed:', error);
    return res.status(500).send('Failed to verify email');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  console.log('BODY:', req.body);// debug - akan di delete

  try {
    const data = loginSchema.parse(req.body);
    const result = await login(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};
