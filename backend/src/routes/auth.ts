import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, school, currentYear, sport, position } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role,
      school,
      currentYear,
      sport,
      position
     });
    await newUser.save();
    const userId = String(newUser._id);
    req.session.userId = userId;
    return res.status(201).json({ id: userId, name: newUser.name, role: newUser.role });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
    // todo
});

// LOGOUT
router.post('/logout', (req: Request, res: Response) => {
    // todo
});

// session management
router.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;