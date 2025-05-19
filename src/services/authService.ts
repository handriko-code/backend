import { prisma } from '../lib/prisma';
import { RegisterDTO, LoginDTO } from '../interfaces/auth.interface';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { generateReferralCode } from '../utils/referral';
import { createReferralAndReward } from './referralService';
import { createWelcomeCoupon } from './couponService';
import { sendEmail } from '../utils/email';

import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

export const register = async (data: RegisterDTO) => {
  const { email, password, name, role, referralCode } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered.');

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      referralCode: generateReferralCode(),
      isVerified: false,
    },
  });

  // Path template kirim email ke Customer yg register guna melakukan verifikasi
  const templatePath = path.join(
    __dirname,
    '../templates',
    'register-template.hbs'
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = handlebars.compile(templateSource);

  //URL verifikasi berasal dari env
  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify?email=${encodeURIComponent(user.email)}`;

  const html = compiledTemplate({
    name: user.name,
    email: user.email,
    verifyUrl,
  });

  await sendEmail(
    user.email,
    'Welcome to Event App!',
    'Thanks for registering at Event Application',
    html
  );

  if (referralCode) {
    await createReferralAndReward(referralCode, user.id);
  }

  await createWelcomeCoupon(user.id);

  const token = signToken({ id: user.id, role: user.role });
  return { token, user };
};

export const login = async (data: LoginDTO) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials.');

  if (!user.isVerified) throw new Error('Please verify your email first.');

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid Password.');

  const token = signToken({ id: user.id, role: user.role });
  return { token, user };
};

export const getEventAttendees = async (organizerId: string, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId },
  });

  if (!event) throw new Error('Event not found or not authorized');

  const attendees = await prisma.transaction.findMany({
    where: {
      eventId,
      status: 'ACCEPTED',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return attendees.map((trx) => ({
    userId: trx.user.id,
    name: trx.user.name,
    email: trx.user.email,
    quantity: trx.quantity,
    totalPrice: trx.totalPrice,
  }));
};
