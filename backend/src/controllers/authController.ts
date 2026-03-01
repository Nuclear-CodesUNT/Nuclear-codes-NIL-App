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
        return res.status(400).json({ message: 'Name, email, and password are required' });
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
      if (error.message === 'USE_GOOGLE_LOGIN'){
        return res.status(400).json({ message: 'This account uses Google sign-in. Please login with google.'})
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const { user, isNewUser } = await AuthService.googleLogin(token);

    req.session.userId = String(user._id);

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || null,
      isNewUser,
    });
  } catch (error: any) {
    console.error('Google auth error:', error);

    if (error.message === 'MISSING_TOKEN') {
      return res.status(400).json({ message: 'Google token is required' });
    }
    if (error.message === 'INVALID_GOOGLE_TOKEN') {
      return res.status(401).json({ message: 'Invalid Google token' });
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

export const completeProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await AuthService.completeUserProfile(userId, req.body);

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error: any) {
    console.error('Complete profile error:', error);

    if (error.message === 'MISSING_ROLE') {
      return res.status(400).json({ message: 'Role is required' });
    }
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.message === 'PROFILE_ALREADY_COMPLETE') {
      return res.status(400).json({ message: 'Profile is already complete' });
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);
    return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error: any) {
    if (error.message === 'MISSING_EMAIL') {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Always return 200 for these to prevent enumeration
    if (error.message === 'GOOGLE_ONLY_ACCOUNT' || error.message === 'EMAIL_SEND_FAILED') {
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    if (error.message === 'MISSING_FIELDS') {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    if (error.message === 'PASSWORD_TOO_SHORT') {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (error.message === 'INVALID_OR_EXPIRED_TOKEN') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};