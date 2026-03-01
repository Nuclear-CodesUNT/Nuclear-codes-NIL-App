import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';

// Helper to get the SES Client using the STS AssumeRole pattern
const getSESClient = async () => {
  try {
    // 1. STS Client to assume role
    const stsClient = new STSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });

    const command = new AssumeRoleCommand({
      RoleArn: process.env.AWS_ASSUME_ROLE_ARN!,
      RoleSessionName: `SESSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900'),
    });

    const response = await stsClient.send(command);

    if (!response.Credentials) {
      throw new Error('Failed to obtain temporary credentials from STS for SES');
    }

    // 2. Create SES client using temporary credentials
    const sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: response.Credentials.AccessKeyId!,
        secretAccessKey: response.Credentials.SecretAccessKey!,
        sessionToken: response.Credentials.SessionToken!,
      },
    });

    return sesClient;

  } catch (error) {
    console.error('Error in getSESClient:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (toEmail: string, resetUrl: string) => {
  const sesClient = await getSESClient();

  const htmlBody = `
    <html>
      <body>
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your NIL Connect account.</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#4F46E5;color:#ffffff;text-decoration:none;border-radius:4px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>For security, this link will expire in 1 hour.</p>
        <hr/>
        <p style="font-size:12px;color:#6B7280;">NIL Connect — Name, Image, and Likeness Platform</p>
      </body>
    </html>
  `;

  const textBody = `
Password Reset Request

You requested a password reset for your NIL Connect account.

Click the link below to reset your password. This link expires in 1 hour.

${resetUrl}

If you did not request a password reset, you can safely ignore this email.

NIL Connect — Name, Image, and Likeness Platform
  `.trim();

  const params = {
    Source: process.env.SES_FROM_EMAIL!,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: 'Reset your NIL Connect password',
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: textBody,
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const sendCommand = new SendEmailCommand(params);
    await sesClient.send(sendCommand);
    console.log(`Password reset email sent to: ${toEmail}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};
