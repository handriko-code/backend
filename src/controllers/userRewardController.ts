import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const referrals = await prisma.referral.findMany({
      where: { userId },
      include: {
        referredUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(referrals);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get referrals' });
  }
};

export const getMyCoupons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const coupons = await prisma.coupon.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(coupons);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get coupons' });
  }
};