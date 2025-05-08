import { z } from 'zod';

export const getStatisticsSchema = z.object({
  period: z.enum(['year', 'month', 'day']),
  year: z.union([z.string(), z.number()]).optional(),
   month: z.union([z.string(), z.number()]).optional(),
})