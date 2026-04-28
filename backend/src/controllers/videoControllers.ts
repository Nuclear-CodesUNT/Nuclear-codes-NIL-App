import { Request, Response } from "express";
import mongoose from "mongoose";
import Videos from "../models/Videos.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

// NOTE: This helper is also imported by the athlete highlights API.
// It generates a temporary, signed GET URL for private S3 video objects so the
// frontend can play them without making the bucket public.
export async function trySignS3GetObjectUrl(key: string, expiresInSeconds = 60 * 60): Promise<string | null> {
  const bucket = process.env.S3_BUCKET_NAME ?? process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) return null;

  try {
    const s3 = await createS3SigningClient(region);
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
  } catch (err) {
    console.error("S3 signing error:", err);
    return null;
  }
}

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

    let outVideos: any[] = videos;

    const plain = videos.map((v) => (v.toObject ? v.toObject() : v));
    outVideos = await Promise.all(
      plain.map(async (vid) => {
        if (vid.s3Key) {
          const signed = await trySignS3GetObjectUrl(String(vid.s3Key));
          if (signed) vid.videoUrl = signed;
        }
        return vid;
      })
    );

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

    let outVideo: any = video;
    if ((video as any).s3Key) {
      const signed = await trySignS3GetObjectUrl(String((video as any).s3Key));
      if (signed) {
        outVideo = (video as any).toObject ? (video as any).toObject() : video;
        outVideo.videoUrl = signed;
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

// POST /api/videos/:id/like
export const toggleLikeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // The video ID
    const { userId } = req.body; // The ID of the person liking it

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const video = await Videos.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    // Safety check for older dummy data
    if (!video.likedBy) video.likedBy = [];

    const hasLiked = video.likedBy.includes(userId);

    if (hasLiked) {
      // If already liked, remove them (Unlike)
      video.likedBy = video.likedBy.filter((uid) => uid !== userId);
    } else {
      // If not liked, add them (Like)
      video.likedBy.push(userId);
    }

    await video.save();

    return res.status(200).json({
      success: true,
      liked: !hasLiked,
      likesCount: video.likedBy.length
    });
  } catch (error) {
    console.error("toggleLikeVideo error:", error);
    return res.status(500).json({ success: false, message: "Server error toggling like." });
  }
};

// POST /api/videos/:id/comment
export const addCommentVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, userName, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ success: false, message: "User ID and text are required." });
    }

    const video = await Videos.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    if (!video.comments) video.comments = [];

    const newComment = {
      userId,
      userName: userName || "Unknown User",
      text,
      createdAt: new Date()
    };

    video.comments.push(newComment);
    await video.save();

    return res.status(201).json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    console.error("addCommentVideo error:", error);
    return res.status(500).json({ success: false, message: "Server error adding comment." });
  }
};