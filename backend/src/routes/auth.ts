import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Athlete from '../models/Athlete.js';
import Lawyer from '../models/Lawyer.js';
import Coach from '../models/Coach.js';
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, ...roleSpecificData } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    
    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //create base user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role
     });
    await newUser.save();

    //craete role-specific profile
    let roleProfile;
    switch (role) {
      case 'athlete':
        const { school, currentYear, sport, position } = roleSpecificData;
        if (!school || !currentYear || !sport || !position) {
          await User.findByIdAndDelete(newUser._id); // Cleanup
          return res.status(400).json({ 
            message: 'School, current year, sport, and position are required for athletes' 
          });
        }
        roleProfile = new Athlete({
          userId: newUser._id,
          school,
          currentYear,
          sport,
          position
        });
        break;

      case 'lawyer':
        const { barNumber, state, firmName, specializations, yearsOfExperience } = roleSpecificData;
        if (!barNumber || !state || yearsOfExperience === undefined) {
          await User.findByIdAndDelete(newUser._id); // Cleanup
          return res.status(400).json({ 
            message: 'Bar number, state, and years of experience are required for lawyers' 
          });
        }
        roleProfile = new Lawyer({
          userId: newUser._id,
          barNumber,
          state,
          firmName,
          specializations: specializations || [],
          yearsOfExperience
        });
        break;

      case 'coach':
        const { school: coachSchool, sport: coachSport } = roleSpecificData;
        if (!coachSchool || !coachSport) {
          await User.findByIdAndDelete(newUser._id); // Cleanup
          return res.status(400).json({ 
            message: 'School and sport are required for coaches' 
          });
        }
        roleProfile = new Coach({
          userId: newUser._id,
          school: coachSchool,
          sport: coachSport
        });
        break;

      // case 'brand':
      //   // Add brand validation and creation here
      //   break;

      default:
        await User.findByIdAndDelete(newUser._id); // Cleanup
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (roleProfile) {
      await roleProfile.save();
    }
    const userId = String(newUser._id);
    req.session.userId = userId;

    return res.status(201).json({ 
      id: userId, 
      name: newUser.name, 
      role: newUser.role 
    });

  } catch (error) {
    console.error('Signup error:', error);

    //handle duplicate key errors


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