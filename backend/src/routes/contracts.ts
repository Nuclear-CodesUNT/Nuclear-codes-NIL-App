import { Router } from 'express';
import multer from 'multer';
import {
  getAllContracts,
  getMyContracts,
  updateContractStatus,
  getContractViewUrl,
  submitContract,
  uploadContract,
} from '../controllers/contractController.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
  },
});

// Upload a contract file to S3 and create a DB record
router.post('/upload', upload.single('file'), uploadContract);

// Submit a contract with an already-uploaded file URL
router.post('/', submitContract);

// Get all contracts (for admin portal)
router.get('/', getAllContracts);

// Get contracts for current user
router.get('/me', getMyContracts);

// Get a temporary pre-signed URL to view a contract's file
router.get('/:id/view', getContractViewUrl);

// Update contract status (for admin review)
router.patch('/:id/status', updateContractStatus);

export default router;
