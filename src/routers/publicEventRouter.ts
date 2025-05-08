import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET all upcoming events (public access, for CUSTOMER)
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      where: {
        date: {
          gte: new Date(), // only future events
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        price: true,
        totalSeats: true,
        availableSeats: true,
        location: true,
      },
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load events' });
  }
});

export default router;
