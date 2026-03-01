import { Request, Response } from "express";
import mongoose from "mongoose";
import Videos from "../models/Videos.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

async function createS3SigningClient(region: string) {
  const roleArn = process.env.AWS_ASSUME_ROLE_ARN;

  // If no role is configured, use default credential provider chain.
  if (!roleArn) {
    return new S3Client({ region });
  }

  const sts = new STSClient({ region });
  const assumeRole = await sts.send(
    new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: `VideoPlaybackSign-${Date.now()}`,
      DurationSeconds: parseInt(process.env.AWS_STS_DURATION || "900", 10),
    })
  );

  const credentials = assumeRole.Credentials;
  if (!credentials?.AccessKeyId || !credentials?.SecretAccessKey || !credentials?.SessionToken) {
    throw new Error("Failed to assume role for video playback signing.");
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  });
}

// GET /api/videos
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Videos.find().sort({ createdAt: -1 });

    // Attempt to generate signed GET URLs for private S3 objects when possible.
    const bucket = process.env.S3_BUCKET_NAME ?? process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;

    let outVideos: any[] = videos;

    if (bucket && region) {
      try {
        const s3 = await createS3SigningClient(region);
        const plain = videos.map((v) => (v.toObject ? v.toObject() : v));

        outVideos = await Promise.all(
          plain.map(async (vid) => {
            if (vid.s3Key) {
              try {
                const key = String(vid.s3Key);
                const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
                const signed = await getSignedUrl(s3, cmd, { expiresIn: 60 * 60 }); // 1 hour
                vid.videoUrl = signed;
              } catch (err) {
                console.error("Error generating signed url for", vid._id, err);
                // leave vid.videoUrl as stored
              }
            }
            return vid;
          })
        );
      } catch (err) {
        console.error("S3 signing error:", err);
        outVideos = videos as any[];
      }
    }

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos: outVideos,
    });
  } catch (error) {
    console.error("getAllVideos error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching videos.",
    });
  }
};

// GET /api/videos/:id
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video id.",
      });
    }

    const video = await Videos.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    // If we have S3 config and a key, generate a signed GET URL for this video
    const bucket = process.env.S3_BUCKET_NAME ?? process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;

    let outVideo: any = video;
    if (bucket && region && (video as any).s3Key) {
      try {
        const s3 = await createS3SigningClient(region);
        const key = String((video as any).s3Key);
        const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
        const signed = await getSignedUrl(s3, cmd, { expiresIn: 60 * 60 }); // 1 hour
        outVideo = (video as any).toObject ? (video as any).toObject() : video;
        outVideo.videoUrl = signed;
      } catch (err) {
        console.error("Error generating signed url for video id", id, err);
        // fallback to stored videoUrl if signing fails
      }
    }

    return res.status(200).json({
      success: true,
      video: outVideo,
    });
  } catch (error) {
    console.error("getVideoById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching the video.",
    });
  }
};

// POST /api/videos
export const createVideo = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      durationSeconds,
      status,
    } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title and videoUrl.",
      });
    }

    const newVideo = await Videos.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      durationSeconds,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Video created successfully.",
      video: newVideo,
    });
  } catch (error) {
    console.error("createVideo error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating video.",
    });
  }
};
