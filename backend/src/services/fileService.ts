import { DeleteObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';

const getS3Client = async () => {
  try {
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
      throw new Error('Failed to obtain temporary credentials from STS');
    }

    // 2️⃣ Create S3 client using temporary credentials
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: response.Credentials.AccessKeyId!,
        secretAccessKey: response.Credentials.SecretAccessKey!,
        sessionToken: response.Credentials.SessionToken!,
      },
    });
    return s3Client;
  } catch (error) {
    console.error('Error in getS3Client:', error);
    throw error;
  }
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

const getObjectKeyFromUrl = (fileUrl: string): string => {
  const parsedUrl = new URL(fileUrl);
  return decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ''));
};

const fileExistsInS3 = async (fileUrl: string): Promise<boolean> => {
  const s3 = await getS3Client();
  const key = getObjectKeyFromUrl(fileUrl);

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
    );
    return true;
  } catch (error: unknown) {
    const awsError = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    const statusCode = awsError.$metadata?.httpStatusCode;
    if (statusCode === 404 || awsError.name === 'NotFound' || awsError.name === 'NoSuchKey') {
      return false;
    }
    if (statusCode === 403 || awsError.name === 'AccessDenied') {
      return true;
    }
    throw error;
  }
};

const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  const s3 = await getS3Client();
  const key = getObjectKeyFromUrl(fileUrl);

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    })
  );
};

export default {
  uploadFileToS3,
  fileExistsInS3,
  deleteFileFromS3,
};
