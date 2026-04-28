import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';
import Contract from '../models/Contract.js';
import Lawyer from '../models/Lawyer.js';
import { notifyLawyerViaSNS } from './snsService.js';

// ---------------------------------------------------------------------------
// S3 helpers (contract-specific, independent of video logic)
// ---------------------------------------------------------------------------

async function getS3Client(): Promise<S3Client> {
  const region = process.env.AWS_REGION!;
  const roleArn = process.env.AWS_ASSUME_ROLE_ARN;

  if (!roleArn) {
    return new S3Client({ region });
  }

  const sts = new STSClient({ region });
  const { Credentials: creds } = await sts.send(
    new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: `ContractSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900', 10),
    }),
  );

  if (!creds?.AccessKeyId || !creds?.SecretAccessKey || !creds?.SessionToken) {
    throw new Error('Failed to assume role for contract S3 access.');
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken,
    },
  });
}

// ---------------------------------------------------------------------------
// S3 operations
// ---------------------------------------------------------------------------

function safeFilename(original: string) {
  return original.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadFileToS3(file: Express.Multer.File): Promise<{ fileUrl: string; key: string }> {
  const s3 = await getS3Client();
  const bucket = process.env.S3_BUCKET_NAME!;
  const key = `contracts/${Date.now()}-${safeFilename(file.originalname)}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const result = await upload.done();
  return { fileUrl: result.Location!, key };
}

export async function generateViewUrl(fileUrl: string): Promise<string | null> {
  const bucket = process.env.S3_BUCKET_NAME ?? process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) return null;

  try {
    const s3 = await getS3Client();
    // Extract S3 key from the full URL
    const parsedUrl = new URL(fileUrl);
    const key = decodeURIComponent(parsedUrl.pathname.slice(1));

    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(s3, cmd, { expiresIn: 60 * 60 });
  } catch (err) {
    console.error('Contract S3 signing error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// DB operations
// ---------------------------------------------------------------------------

export async function getAll() {
  return Contract.find()
    .populate('user', 'name email role')
    .sort({ submittedAt: -1 });
}

export async function getByUser(userId: string) {
  return Contract.find({ user: userId })
    .sort({ submittedAt: -1 });
}

export async function updateStatus(contractId: string, status: string) {
  return Contract.findByIdAndUpdate(
    contractId,
    { status },
    { new: true },
  ).populate('user', 'name email role');
}

export async function findById(contractId: string) {
  return Contract.findById(contractId);
}

export async function submitContract(
  userId: string,
  lawyerId: string,
  fileName: string,
  fileUrl: string,
  fileSize?: number,
) {
  const lawyer = await Lawyer.findById(lawyerId).populate('userId');
  if (!lawyer) return null;

  const newContract = await Contract.create({
    user: userId,
    lawyer: lawyerId,
    fileName,
    fileUrl,
    fileSize,
  });

  // Trigger SNS notification to the lawyer
  const lawyerUser = lawyer.userId as any;
  if (lawyerUser?.email) {
    await notifyLawyerViaSNS(
      lawyerUser.email,
      lawyerUser.name,
      'Student Athlete',
      fileUrl,
    );
  }

  return newContract;
}

export async function uploadAndCreateContract(
  file: Express.Multer.File,
  userId: string,
) {
  const { fileUrl } = await uploadFileToS3(file);

  const contract = await Contract.create({
    user: userId,
    fileName: file.originalname,
    fileUrl,
    fileSize: file.size,
    status: 'Pending',
  });

  return { contract, fileUrl };
}
