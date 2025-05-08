import { Request, Response, NextFunction, RequestHandler } from 'express';

export const roleMiddleware = (role: 'CUSTOMER' | 'ORGANIZER'): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    if (user.role !== role) {
      res.status(403).json({ message: 'Forbidden: Insufficient role' });
      return;
    }

    next();
  };
};
