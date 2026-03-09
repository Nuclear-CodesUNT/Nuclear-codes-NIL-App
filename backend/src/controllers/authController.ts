import { type Request, type Response } from 'express';
import * as AuthService from '../services/authService.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const newUser = await AuthService.registerUser(req.body);

    req.session.userId = String(newUser._id);

    return res.status(201).json({ 
      id: newUser._id, 
      name: newUser.name, 
      email: newUser.email,
      role: newUser.role 
    });

  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.message === 'MISSING_FIELDS') {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    if (error.message === 'USER_EXISTS') {
        return res.status(400).json({ message: 'User already exist with this email' });
    }
    if (error.message === 'MISSING_ATHLETE_FIELDS') {
        return res.status(400).json({ message: 'School, current year, sport, and position are required for athletes' });
    }
    if (error.message === 'MISSING_LAWYER_FIELDS') {
        return res.status(400).json({ message: 'Bar number, state, and years of experience are required for lawyers' });
    }
    if (error.message === 'MISSING_COACH_FIELDS') {
        return res.status(400).json({ message: 'School and sport are required for coaches' });
    }
    if (error.message === 'INVALID_ROLE') {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await AuthService.authenticateUser(email, password);

      req.session.userId = String(user._id);
      
      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });

    } catch (error: any) {
      console.log('Login error', error);
      
      if (error.message === 'MISSING_CREDENTIALS') {
        return res.status(400).json({ message: 'Email and password are required'});
      }
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); //clear session cookie
      return res.status(200).json({ message: 'Logged out successfuly'});
    });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await AuthService.getUserById(req.session.userId);
    
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};