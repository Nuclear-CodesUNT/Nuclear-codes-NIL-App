import { Router, Request, Response } from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import Video from '../models/Videos.js';

const router = Router();

// Multer memory storage (no disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  fileFilter: (req, file, cb) => {
    // Allowed MIME types (from .env or fallback)
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES || 'video/mp4,video/quicktime,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      .split(',')
      .map((type) => type.trim());

    // Allowed extensions (extra safety)
    const allowedExt = ['mp4', 'mov', 'webm', 'pdf', 'doc', 'docx'];
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();

    // Validate extension first
    if (!allowedExt.includes(ext)) {
      return cb(
        new Error('Invalid file extension. Only PDF, DOC, DOCX, .mp4, .mov, and .webm allowed.'),
        false
      );
    }

    // Validate MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error('Invalid file type. Only MP4, MOV, WEBM allowed.'),
        false
      );
    }

    return cb(null, true);
  },
});

// ================= Upload Endpoint =================
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // 1️⃣ Assume role (requires AWS_ASSUME_ROLE_ARN to be an IAM Role ARN)
    const sts = new AWS.STS({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const assumeRoleResult = await sts.assumeRole({
      RoleArn: process.env.AWS_ASSUME_ROLE_ARN!,
      RoleSessionName: `UploadSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900', 10),
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

    // 4️⃣ Save video metadata to MongoDB
    const titleFromName =
      req.body.title ||
      req.file.originalname.replace(/\.[^/.]+$/, ""); // strip extension

    const createdVideo = await Video.create({
      title: titleFromName,
      description: req.body.description || "",
      videoUrl: uploadResult.Location,
      thumbnailUrl: req.body.thumbnailUrl || "",
      durationSeconds: req.body.durationSeconds
        ? Number(req.body.durationSeconds)
        : 0,
       s3Key: key,
      status: req.body.status || "draft",
    });

    return res.status(200).json({
      success: true,
      message: 'File uploaded to S3 and saved to DB!',
      s3Url: uploadResult.Location,
      key,
      video: createdVideo,
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
  return res.status(500).json({ success: false, message: err.message });
});

export default router;
