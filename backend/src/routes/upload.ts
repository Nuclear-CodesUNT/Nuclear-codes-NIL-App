import { Router, Request, Response } from "express";
import multer from "multer";

import Video from "../models/Videos.js";
import { getAssumedS3 } from "../utils/aws.js";
import { writeTempFile, getDurationSeconds, generateThumbnail, cleanupFiles } from "../utils/media.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES ||
      [
        // videos
        "video/mp4",
        "video/quicktime",
        "video/webm",
        // docs
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // fallback for some clients
        "application/octet-stream",
      ].join(",")
    )
      .split(",")
      .map((t) => t.trim());

    const allowedExt = ["mp4", "mov", "webm", "pdf", "doc", "docx"];
    const ext = (file.originalname.split(".").pop() || "").toLowerCase();

    if (!allowedExt.includes(ext)) {
      return cb(
        new Error("Invalid file extension. Allowed: .pdf, .doc, .docx, .mp4, .mov, .webm."),
        false
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(`Invalid file type (${file.mimetype}). Allowed: PDF/DOC/DOCX/MP4/MOV/WEBM.`),
        false
      );
    }

    return cb(null, true);
  },
});

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  let tempVideoPath: string | null = null;
  let tempThumbPath: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const s3 = await getAssumedS3();
    const bucket = process.env.S3_BUCKET_NAME!;
    const ext = (req.file.originalname.split(".").pop() || "").toLowerCase();
    const isVideo = ["mp4", "mov", "webm"].includes(ext);

    // Upload file to S3
    const key = `uploads/${Date.now()}-${req.file.originalname}`;
    const uploadResult = await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise();

    // If it's not a video, return S3 info only (no Video doc)
    if (!isVideo) {
      return res.status(200).json({
        success: true,
        message: "File uploaded to S3!",
        s3Url: uploadResult.Location,
        key,
      });
    }

    // For videos: compute duration + thumbnail
    tempVideoPath = await writeTempFile(req.file.buffer, req.file.originalname);
    const durationSeconds = await getDurationSeconds(tempVideoPath);

    tempThumbPath = await generateThumbnail(tempVideoPath);

    // Upload thumbnail to S3
    const thumbKey = `thumbnails/${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}.jpg`;
    const thumbBuffer = await (await import("fs/promises")).readFile(tempThumbPath);

    const thumbUpload = await s3
      .upload({
        Bucket: bucket,
        Key: thumbKey,
        Body: thumbBuffer,
        ContentType: "image/jpeg",
      })
      .promise();

    // Create Video record
    const titleFromName =
      (req.body.title as string) || req.file.originalname.replace(/\.[^/.]+$/, "");

    const createdVideo = await Video.create({
      title: titleFromName,
      description: (req.body.description as string) || "",
      videoUrl: uploadResult.Location,
      s3Key: key,
      thumbnailUrl: thumbUpload.Location,
      thumbnailKey: thumbKey,
      durationSeconds,
      status: (req.body.status as any) || "draft",
    });

    // Cleanup temp files
    await cleanupFiles([tempVideoPath, tempThumbPath]);

    return res.status(200).json({
      success: true,
      message: "Video uploaded to S3 and saved to DB!",
      s3Url: uploadResult.Location,
      key,
      thumbnailUrl: thumbUpload.Location,
      thumbnailKey: thumbKey,
      durationSeconds,
      video: createdVideo,
    });
  } catch (err: any) {
    // Cleanup temp files if we created them
    if (tempVideoPath || tempThumbPath) {
      await cleanupFiles([tempVideoPath || "", tempThumbPath || ""]);
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Multer error handler
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large" });
  }
  return res.status(500).json({ success: false, message: err.message });
});

export default router;
