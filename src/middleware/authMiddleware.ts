import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization; // isinya 'Bearer + jwt.token'

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1]; 
  
  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
