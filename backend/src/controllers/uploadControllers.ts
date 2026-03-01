import type { Request, Response } from "express";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildPublicUrl(bucket: string, region: string, key: string) {
  // S3 URL formats differ slightly for us-east-1
  if (region === "us-east-1") {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function presignUpload(req: Request, res: Response) {
  try {
    const bucket = process.env.S3_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    const { fileName, contentType, kind } = req.body as {
      fileName: string;
      contentType: string;
      kind: "video" | "thumbnail";
    };

    if (!fileName || !contentType || !kind) {
      return res.status(400).json({ message: "fileName, contentType, and kind are required." });
    }

    const s3 = new S3Client({ region });

    const safeName = sanitizeFilename(fileName);
    const id = crypto.randomUUID();

    const prefix = kind === "video" ? "videos" : "thumbnails";
    const key = `${prefix}/${id}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ACL: "public-read", // since you said videos are public URLs
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds

    const fileUrl = buildPublicUrl(bucket, region, key);

    return res.status(200).json({
      success: true,
      uploadUrl,
      fileUrl,
      key,
    });
  } catch (err) {
    console.error("presignUpload error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
