import AWS from "aws-sdk";

export async function getAssumedS3() {
  const sts = new AWS.STS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const assumeRoleResult = await sts
    .assumeRole({
      RoleArn: process.env.AWS_ASSUME_ROLE_ARN!,
      RoleSessionName: `UploadSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || "900", 10),
    })
    .promise();

  const creds = assumeRoleResult.Credentials!;
  return new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.SessionToken,
  });
}
