import { Request, Response } from 'express';
import { getStatisticsSchema } from '../schemas-zod/dashboardSchema';
import * as dashboardService from '../services/dashboardService';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
  
  export const getStatistics = async (req: Request, res: Response) => {
    try {
      const { period, year, month } = getStatisticsSchema.parse(req.query);
      const organizerId = (req as any).user.id;
  
      // log untuk debug
      console.log('Organizer ID:', organizerId);
      console.log('Query Params:', { period, year, month });
  
      const stats = await dashboardService.getStatistics(
        organizerId,
        period,
        year ? Number(year) : undefined,
        month ? Number(month) : undefined
      );
  
      res.status(200).json(stats);
    } catch (error) {
      res.status(400).json({ message: getErrorMessage(error) });
    }
  };
  