import { prisma } from '../lib/prisma';
export const getStatistics = async (organizerId: string, period: 'year' | 'month' | 'day', year?: number, month?: number) => {

// menambahkan log input parameter
  console.log('Fetching stats for:', { organizerId, period, year, month });

  const where: any = {
    event: {
      organizerId,
    },
    status: 'ACCEPTED', // cuma transaksi yang diterima
  };

  if (year) {
    where.createdAt = {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    };
  }

  if (month && year) {
    where.createdAt = {
      gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`),
      lt: new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01T00:00:00.000Z`),
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { event: true },
  });

  // debug - hasil dari Prisma
  console.log('Fetched transactions:', transactions);
  // group by period
  const grouped: Record<string, { totalTickets: number; totalIncome: number }> = {};

  for (const transaction of transactions) {
    let key = '';
    const date = new Date(transaction.createdAt);

    if (period === 'year') {
      key = date.getFullYear().toString();
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (period === 'day') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { totalTickets: 0, totalIncome: 0 };
    }

    grouped[key].totalTickets += transaction.quantity;
    grouped[key].totalIncome += transaction.totalPrice;
  }


  // Convert to array for frontend
  return Object.entries(grouped).map(([date, data]) => ({
    date,
    ...data,
  }));


};

