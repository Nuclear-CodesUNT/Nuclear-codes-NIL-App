import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'You must be logged in to access this.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.banned) {
      return res.status(403).json({ 
        message: `Your account is banned. Reason: ${user.bannedReason || 'No reason provided'}` 
      });
    }

    // attach user to req for convenience
    (req as any).user = user;

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function hasRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}