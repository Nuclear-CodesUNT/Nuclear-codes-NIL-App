import { Router, Request, Response } from 'express';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';

const router = Router();

// ================= Cache State (Performance Upgrade) =================
// These variables store the S3 client so we don't assume a role on every request
let cachedS3Client: S3Client | null = null;
let tokenExpiration: Date | null = null;

const getS3Client = async () => {
  const now = new Date();
  // Reuse client if token is valid (with 5 min buffer)
  if (cachedS3Client && tokenExpiration && now.getTime() < tokenExpiration.getTime() - 5 * 60 * 1000) {
    return cachedS3Client;
  }

  // 1️⃣ STS Client to assume role
  const stsClient = new STSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  });

  const command = new AssumeRoleCommand({
    RoleArn: process.env.AWS_ASSUME_ROLE_ARN!,
    RoleSessionName: `UploadSession-${Date.now()}`,
    DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900'),
  });

  const response = await stsClient.send(command);

  if (!response.Credentials) {
    throw new Error('Failed to obtain temporary credentials');
  }

  tokenExpiration = response.Credentials.Expiration || new Date(Date.now() + 900 * 1000);

  // 2️⃣ Create S3 client using temporary credentials
  cachedS3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: response.Credentials.AccessKeyId!,
      secretAccessKey: response.Credentials.SecretAccessKey!,
      sessionToken: response.Credentials.SessionToken!,
    },
  });

  return cachedS3Client;
};

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
router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // 1️⃣ & 2️⃣ Get S3 Client (cached)
    const s3 = await getS3Client();

    // 3️⃣ Upload to S3 (using lib-storage for v3)
    const key = `uploads/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      },
    });

    const uploadResult = await parallelUploads3.done();

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