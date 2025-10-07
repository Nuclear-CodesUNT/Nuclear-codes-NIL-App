import type { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to access this.' });
}