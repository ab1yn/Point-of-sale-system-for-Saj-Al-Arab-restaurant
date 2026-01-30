import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '@saj/types';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const user = AuthService.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  req.user = user;
  req.token = token;
  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
  };
};
