import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';

// Helper to get the SNS Client using the STS AssumeRole pattern
// (Matches the logic in your fileService.ts)
const getSNSClient = async () => {
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
      RoleSessionName: `SNSSession-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || '900'),
    });

    const response = await stsClient.send(command);

    if (!response.Credentials) {
      throw new Error('Failed to obtain temporary credentials from STS for SNS');
    }

    // 2. Create SNS client using temporary credentials
    const snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: response.Credentials.AccessKeyId!,
        secretAccessKey: response.Credentials.SecretAccessKey!,
        sessionToken: response.Credentials.SessionToken!,
      },
    });
    
    return snsClient;

  } catch (error) {
    console.error('Error in getSNSClient:', error);
    throw error;
  }
};

export const notifyLawyerViaSNS = async (
    lawyerEmail: string,
    lawyerName: string,
    athleteName: string,
    contractUrl: string
) => {
    // 1. Get the authenticated Client
    const snsClient = await getSNSClient();

    const message = `
Hello ${lawyerName},

A new contract has been submitted for your legal review by athlete ${athleteName}.

View Contract: ${contractUrl}

Please log in to the portal to review.
    `;

    const params = {
        TopicArn: process.env.AWS_SNS_TOPIC_ARN, 
        Message: message,
        Subject: `Legal Review Requested: ${athleteName}`,
        MessageAttributes: {
            "email": {
                DataType: "String",
                StringValue: lawyerEmail
            }
        }
    };

    try {
        const command = new PublishCommand(params);
        await snsClient.send(command);
        console.log(`SNS Notification sent to lawyer: ${lawyerEmail}`);
    } catch (error) {
        console.error("Failed to send SNS notification:", error);
    }
};