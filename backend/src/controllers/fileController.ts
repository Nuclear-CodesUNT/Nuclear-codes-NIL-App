import { Request, Response } from 'express';
import multer from 'multer';
import fileService from '../services/fileService.js';
import Contract from '../models/Contract.js';

// Multer memory storage (no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document').split(',');
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
  }
});

const uploadSingle = upload.single('file');

const uploadFile = async (req: Request, res: Response) => {
  let s3Url: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.session.userId) {
       return res.status(401).json({ success: false, message: 'Unauthorized: No user session found' });
    }

    const uploadedUrl = await fileService.uploadFileToS3(req.file);
    if (!uploadedUrl) {
      throw new Error('S3 upload did not return a file URL');
    }
    s3Url = uploadedUrl;

    // Create MongoDB Record
    const newContract = await Contract.create({
      user: req.session.userId,
      fileName: req.file.originalname,
      fileUrl: s3Url,
      fileSize: req.file.size,
      status: 'Pending'
    });

    return res.status(200).json({
      success: true,
      message: 'File uploaded to S3 and contract created!',
      contract: newContract,
      s3Url,
    });
  } catch (err: any) {
    if (s3Url) {
      try {
        await fileService.deleteFileFromS3(s3Url);
      } catch (cleanupError: unknown) {
        console.error('Failed to clean up orphaned S3 upload:', cleanupError);
      }
    }

    return res.status(500).json({ success: false, error: err.message, message: "error creating/uploading to s3"});
  }
};

const handleMulterError = (err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  res.status(500).json({ success: false, message: err.message });
}

export default {
  uploadSingle,
  uploadFile,
  handleMulterError
};
