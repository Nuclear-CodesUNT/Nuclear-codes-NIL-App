import User from '../models/User.js';
import Athlete from '../models/Athlete.js';
import Coach from '../models/Coach.js';
import Lawyer from '../models/Lawyer.js';

const getAllUsers = async () => {

    return await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
};

const getUserById = async(id: string) => {
    return await User.findById(id).select('-password');
}

const deleteUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) return null;

  // delete role-specific data
  switch (user.role) {
    case 'athlete':
      await Athlete.findOneAndDelete({ userId: user._id });
      break;

    case 'coach':
      await Coach.findOneAndDelete({ userId: user._id });
      break;

    case 'lawyer':
      await Lawyer.findOneAndDelete({ userId: user._id });
      break;
  }

  // delete main user
  await User.findByIdAndDelete(id);

  return true;
};

const banUserById = async (userId: string, reason?: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.banned = true;
  if (reason) user.bannedReason = reason;

  await user.save();
  return true;
};

const unbanUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.banned = false;
  user.bannedReason = undefined;

  await user.save();
  return true;
};

export { getAllUsers, getUserById, deleteUserById, banUserById, unbanUserById };