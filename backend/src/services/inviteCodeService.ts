import InviteCode from '../models/InviteCode.js';
import { nanoid } from 'nanoid';

// Fetch all invite codes
const getAllInviteCodes = async () => {
  return await InviteCode.find().sort({ createdAt: -1 });
};

// Generate a new invite code with assignedTo, role, and usesLeft
const generateInviteCode = async (
  assignedTo: string = "",
  role: string = "Athlete",
  usesLeft: number = 1
) => {

  const code = nanoid(16).toUpperCase();

  const newCode = new InviteCode({
    code,
    assignedTo,
    role,
    usesLeft
  });

  await newCode.save();
  return newCode;
};

// Delete a code by ID
const deleteInviteCode = async (id: string) => {
  return await InviteCode.findByIdAndDelete(id);
};

export { getAllInviteCodes, generateInviteCode, deleteInviteCode };