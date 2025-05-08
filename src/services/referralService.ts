import { prisma } from '../lib/prisma';

export const createReferralAndReward = async (
  referralCode: string,
  referredUserId: string
) => {
  const referrer = await prisma.user.findUnique({ where: { referralCode } });
  if (!referrer) return;

  // Simpan data referral
  await prisma.referral.create({
    data: {
      userId: referrer.id,
      referredUserId,
    },
  });

  // Tambahkan poin ke user yang mengajak
  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      points: {
        increment: 10000, // Atur jumlah poin sesuai kebutuhan
      },
    },
  });
};
