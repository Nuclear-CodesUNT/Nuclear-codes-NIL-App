import AWS from 'aws-sdk';

const uploadFileToS3 = async (file: Express.Multer.File) => {
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
  const key = `uploads/${Date.now()}-${file.originalname}`;
  const uploadResult = await s3.upload({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }).promise();

  return uploadResult.Location;
};

export default {
  uploadFileToS3,
};
