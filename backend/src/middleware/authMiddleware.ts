import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log(`[AUTH MIDDLEWARE] Received token: ${token ? 'YES' : 'NO'} for URL: ${req.originalUrl}`);
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = verifyToken(token) as { id: string; role: string };
    req.user = verified;
    console.log(`[AUTH MIDDLEWARE] Verified user: ${verified.id} (${verified.role})`);
    next();
  } catch (error) {
    console.log(`[AUTH MIDDLEWARE] Invalid token error`);
    res.status(401).json({ message: 'Invalid token' }); // Let's also make this 401 instead of 400!
  }
};
