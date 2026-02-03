import type { Request, Response } from 'express';
import Contract from '../models/Contract.js';
import Lawyer from '../models/Lawyer.js';
import { notifyLawyerViaSNS } from '../services/snsService.js';

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

export const submitContract = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Expect lawyerId from frontend
    const { lawyerId, fileName, fileUrl, fileSize } = req.body;

    if (!lawyerId || !fileUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1. Find the Lawyer to get their details for the email
    const lawyer = await Lawyer.findById(lawyerId).populate('userId');

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    // 2. Create the Contract Record
    const newContract = new Contract({
      user: req.session.userId, 
      lawyer: lawyerId, // [CHANGED] Save to lawyer field
      fileName,
      fileUrl,
      fileSize
    });

    await newContract.save();

    // 3. Trigger SNS Notification
    const lawyerUser = lawyer.userId as any; 
    
    if (lawyerUser && lawyerUser.email) {
       await notifyLawyerViaSNS(
          lawyerUser.email, 
          lawyerUser.name, 
          "Student Athlete", 
          fileUrl
       );
    }

    return res.status(201).json({ 
        message: 'Contract submitted for legal review', 
        contract: newContract 
    });

  } catch (error: unknown) {
    console.error('Error submitting contract:', error);
    return res.status(500).json({ message: 'Failed to submit contract' });
  }
};