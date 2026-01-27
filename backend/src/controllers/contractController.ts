import type { Request, Response } from 'express';
import Contract from '../models/Contract.js';

/**
 * Get all contracts with populated user data
 * For admin portal - returns all contracts from all users
 */
export const getAllContracts = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Fetch all contracts with user details populated
    const contracts = await Contract.find()
      .populate('user', 'name email role')
      .sort({ submittedAt: -1 });

    return res.status(200).json({ contracts });
  } catch (error: unknown) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ message: 'Failed to fetch contracts' });
  }
};

/**
 * Get contracts for the logged in user
 */
export const getMyContracts = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const contracts = await Contract.find({ user: req.session.userId })
      .sort({ submittedAt: -1 });

    return res.status(200).json({ contracts });
  } catch (error: unknown) {
    console.error('Error fetching user contracts:', error);
    return res.status(500).json({ message: 'Failed to fetch contracts' });
  }
};

/**
 * Update contract status (for admin review)
 */
export const updateContractStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Reviewing', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contract = await Contract.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email role');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.status(200).json({ contract });
  } catch (error: unknown) {
    console.error('Error updating contract status:', error);
    return res.status(500).json({ message: 'Failed to update contract' });
  }
};
