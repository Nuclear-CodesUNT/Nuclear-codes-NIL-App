import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Athlete from '../models/Athlete.js';
import Lawyer from '../models/Lawyer.js';
import Coach from '../models/Coach.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  role?: string;
  [key: string]: any; // for role specific data spread
}

const createRoleProfile = async (userId: any, role: string, roleSpecificData: RoleSpecificData) => {
  switch (role) {
    case 'athlete': {
      const { school, currentYear, sport, position } = roleSpecificData;
      if (!school || !currentYear || !sport || !position) {
        throw new Error('MISSING_ATHLETE_FIELDS');
      }
      const profile = new Athlete({ userId, school, currentYear, sport, position });
      await profile.save();
      return profile;
    }

    case 'lawyer': {
      const { barNumber, state, firmName, specializations, yearsOfExperience } = roleSpecificData;
      if (!barNumber || !state || yearsOfExperience === undefined) {
        throw new Error('MISSING_LAWYER_FIELDS');
      }
      const profile = new Lawyer({
        userId,
        barNumber,
        state,
        firmName,
        specializations: specializations || [],
        yearsOfExperience
      });
      await profile.save();
      return profile;
    }

    case 'coach': {
      const { school: coachSchool, sport: coachSport } = roleSpecificData;
      if (!coachSchool || !coachSport) {
        throw new Error('MISSING_COACH_FIELDS');
      }
      const profile = new Coach({ userId, school: coachSchool, sport: coachSport });
      await profile.save();
      return profile;
    }

    default:
      throw new Error('INVALID_ROLE');
  }
};

export const registerUser = async (userData: UserData) => {
  const { name, email, password, role, ...roleSpecificData } = userData;

  if (!name || !email || !password) {
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
    ...(role ? { role } : {})
  });
  await newUser.save();

  // If role provided, create role-specific profile
  if (role) {
    try {
      await createRoleProfile(newUser._id, role, roleSpecificData as RoleSpecificData);
    } catch (error) {
      // If profile creation fails, cleanup the user
      await User.findByIdAndDelete(newUser._id);
      throw error;
    }
  }

  return newUser;
};

export const authenticateUser = async (email: string, password?: string) => {
    if (!email || !password) {
        throw new Error('MISSING_CREDENTIALS');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }
    //google only user
    if (!user.password){
        throw new Error('USE_GOOGLE_LOGIN')
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

export const googleLogin = async (googleToken: string) => {
  if (!googleToken) {
    throw new Error('MISSING_TOKEN');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new Error('INVALID_GOOGLE_TOKEN');
  }

  if (!payload || !payload.email) {
    throw new Error('INVALID_GOOGLE_TOKEN');
  }

  const { sub: googleId, email, name } = payload;

  // Look up by googleId first, then by email
  let user = await User.findOne({ googleId });
  if (user) {
    return { user, isNewUser: false };
  }

  user = await User.findOne({ email });
  if (user) {
    // Link Google account to existing user
    user.googleId = googleId;
    await user.save();
    return { user, isNewUser: !user.role };
  }

  // Create new user (no role, no password)
  const newUser = new User({
    name: name || email,
    email,
    googleId,
  });
  await newUser.save();

  return { user: newUser, isNewUser: true };
};

export const completeUserProfile = async (userId: string, profileData: { role: string; [key: string]: any }) => {
    const { role, ...roleSpecificData } = profileData;

    if (!role) {
        throw new Error('MISSING_ROLE');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (user.role) {
        throw new Error('PROFILE_ALREADY_COMPLETE');
    }

    await createRoleProfile(user._id, role, roleSpecificData as RoleSpecificData);

    user.role = role as any;
    await user.save();

    return user;
}
