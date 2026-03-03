import InviteCode from '../models/InviteCode.js';
import { nanoid } from 'nanoid'; // for generating unique codes

// Fetch all invite codes
const getAllInviteCodes = async () => {
  return await InviteCode.find().sort({ createdAt: -1 });
};

// Generate a new invite code with optional assignedTo and usesLeft
const generateInviteCode = async (assignedTo: string = "", usesLeft: number = 1) => {
  const code = nanoid(8).toUpperCase(); // random 8-character code
  const newCode = new InviteCode({ code, assignedTo, usesLeft });
  await newCode.save();
  return newCode;
};

// Delete a code by ID
const deleteInviteCode = async (id: string) => {
  return await InviteCode.findByIdAndDelete(id);
};

export { getAllInviteCodes, generateInviteCode, deleteInviteCode };