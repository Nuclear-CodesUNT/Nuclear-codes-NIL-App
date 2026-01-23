import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Athlete from '../models/Athlete.js';
import Lawyer from '../models/Lawyer.js';
import Coach from '../models/Coach.js';

interface RoleSpecificData {
  // Athlete
  school?: string;
  currentYear?: string;
  sport?: string;
  position?: string;
  
  // Lawyer
  barNumber?: string;
  state?: string;
  firmName?: string;
  specializations?: string[];
  yearsOfExperience?: number;

  // Coach
  // school and sport defined above
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  [key: string]: any; // for role specific data spread
}

export const registerUser = async (userData: UserData) => {
  const { name, email, password, role, ...roleSpecificData } = userData;

  if (!name || !email || !password || !role) {
    throw new Error('MISSING_FIELDS');
  }

  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('USER_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create base user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role
  });
  await newUser.save();

  // create role-specific profile
  let roleProfile;
  try {
    switch (role) {
      case 'athlete':
        const { school, currentYear, sport, position } = roleSpecificData as RoleSpecificData;
        if (!school || !currentYear || !sport || !position) {
          throw new Error('MISSING_ATHLETE_FIELDS');
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
        const { barNumber, state, firmName, specializations, yearsOfExperience } = roleSpecificData as RoleSpecificData;
        if (!barNumber || !state || yearsOfExperience === undefined) {
           throw new Error('MISSING_LAWYER_FIELDS');
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
        const { school: coachSchool, sport: coachSport } = roleSpecificData as RoleSpecificData;
        if (!coachSchool || !coachSport) {
           throw new Error('MISSING_COACH_FIELDS');
        }
        roleProfile = new Coach({
          userId: newUser._id,
          school: coachSchool,
          sport: coachSport
        });
        break;

      default:
        throw new Error('INVALID_ROLE');
    }

    if (roleProfile) {
      await roleProfile.save();
    }

    return newUser;

  } catch (error) {
    // If profile creation fails, cleanup the user
    await User.findByIdAndDelete(newUser._id);
    throw error;
  }
};

export const authenticateUser = async (email: string, password?: string) => {
    if (!email || !password) {
        throw new Error('MISSING_CREDENTIALS');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('INVALID_CREDENTIALS');
    }

    return user;
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    return user;
}
