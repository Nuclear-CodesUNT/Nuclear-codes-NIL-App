import { S3Client } from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';

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


const uploadFileToS3 = async (file: Express.Multer.File) => {
  // 1️⃣ & 2️⃣ Get S3 Client (cached)
  const s3 = await getS3Client();

  // 3️⃣ Upload to S3 (using lib-storage for v3)
  const key = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const uploadResult = await parallelUploads3.done();

  return uploadResult.Location;
};

export default {
  uploadFileToS3,
};
