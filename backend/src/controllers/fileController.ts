import { Request, Response } from 'express';
import multer from 'multer';
import fileService from '../services/fileService.js';

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
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const s3Url = await fileService.uploadFileToS3(req.file);

    return res.status(200).json({
      success: true,
      message: 'File uploaded to S3!',
      s3Url,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
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
