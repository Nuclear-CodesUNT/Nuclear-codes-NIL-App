import { Router } from 'express';
import {
  deleteContract,
  getAllContracts,
  getMyContracts,
  updateContractStatus,
  submitContract,
} from '../controllers/contractController.js';

const router = Router();

// Submit a new contract
router.post('/', submitContract);

// Get all contracts (for admin portal)
router.get('/', getAllContracts);

// Get contracts for current user
router.get('/me', getMyContracts);

// Update contract status (for admin review)
router.patch('/:id/status', updateContractStatus);
router.delete('/:id', deleteContract);

export default router;
