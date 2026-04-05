import type { Request, Response } from 'express';
import * as contractService from '../services/contractService.js';

const VALID_STATUSES = ['Pending', 'Reviewing', 'Approved', 'Rejected'];

export const getAllContracts = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const contracts = await contractService.getAll();
    return res.status(200).json({ contracts });
  } catch (error: unknown) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ message: 'Failed to fetch contracts' });
  }
};

export const getMyContracts = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const contracts = await contractService.getByUser(req.session.userId);
    return res.status(200).json({ contracts });
  } catch (error: unknown) {
    console.error('Error fetching user contracts:', error);
    return res.status(500).json({ message: 'Failed to fetch contracts' });
  }
};

export const updateContractStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contract = await contractService.updateStatus(id as string, status);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.status(200).json({ contract });
  } catch (error: unknown) {
    console.error('Error updating contract status:', error);
    return res.status(500).json({ message: 'Failed to update contract' });
  }
};

export const getContractViewUrl = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const contract = await contractService.findById(req.params.id as string);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const signedUrl = await contractService.generateViewUrl(contract.fileUrl);

    if (!signedUrl) {
      return res.status(500).json({ message: 'Failed to generate viewing URL' });
    }

    return res.status(200).json({ url: signedUrl });
  } catch (error: unknown) {
    console.error('Error generating contract view URL:', error);
    return res.status(500).json({ message: 'Failed to generate viewing URL' });
  }
};

export const submitContract = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { lawyerId, fileName, fileUrl, fileSize } = req.body;

    if (!lawyerId || !fileUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const contract = await contractService.submitContract(
      req.session.userId,
      lawyerId,
      fileName,
      fileUrl,
      fileSize,
    );

    if (!contract) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    return res.status(201).json({
      message: 'Contract submitted for legal review',
      contract,
    });
  } catch (error: unknown) {
    console.error('Error submitting contract:', error);
    return res.status(500).json({ message: 'Failed to submit contract' });
  }
};

export const uploadContract = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { contract, fileUrl } = await contractService.uploadAndCreateContract(
      req.file,
      req.session.userId,
    );

    return res.status(200).json({
      success: true,
      message: 'File uploaded and contract created!',
      contract,
      s3Url: fileUrl,
    });
  } catch (err: any) {
    console.error('Error uploading contract:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
