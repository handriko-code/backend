import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from 'date-fns';

export const createWelcomeCoupon = async (userId: string) => {
  await prisma.coupon.create({
    data: {
      code: uuidv4(),
      discount: 10, // diskon default
      userId,
      expiresAt: addMonths(new Date(), 3),
    },
  });
};
