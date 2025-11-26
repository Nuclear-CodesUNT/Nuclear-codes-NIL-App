import { Router, Request, Response } from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';

const router = Router();

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

// ================= Upload Endpoint =================
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // 1️⃣ Assume role
    const sts = new AWS.STS({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const assumeRoleResult = await sts.assumeRole({
      RoleArn: process.env.AWS_ASSUME_ROLE_ARN!,
      RoleSessionName: `UploadSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900'),
    }).promise();

    // 2️⃣ Create S3 client using temporary credentials
    const s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: assumeRoleResult.Credentials!.AccessKeyId,
      secretAccessKey: assumeRoleResult.Credentials!.SecretAccessKey,
      sessionToken: assumeRoleResult.Credentials!.SessionToken,
    });

    // 3️⃣ Upload to S3
    const key = `uploads/${Date.now()}-${req.file.originalname}`;
    const uploadResult = await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    return res.status(200).json({
      success: true,
      message: 'File uploaded to S3!',
      s3Url: uploadResult.Location,
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Multer error handler
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  res.status(500).json({ success: false, message: err.message });
});

export default router;
