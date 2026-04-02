import { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { promises as fs } from "fs";
import Contract from "../models/Contract.js";
import Video from "../models/Videos.js";
import { getAssumedS3 } from "../utils/aws.js";
import { writeTempFile, getDurationSeconds, generateThumbnail, cleanupFiles } from "../utils/media.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "524288000", 10),
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedTypes = (
      process.env.ALLOWED_FILE_TYPES ||
      [
        "video/avi",
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream",
      ].join(",")
    )
      .split(",")
      .map((t) => t.trim());

    const allowedExt = ["avi", "mp4", "mov", "webm", "pdf", "doc", "docx"];
    const ext = (file.originalname.split(".").pop() || "").toLowerCase();

    if (!allowedExt.includes(ext)) {
      return cb(
        new Error("Invalid file extension. Allowed: .avi, .pdf, .doc, .docx, .mp4, .mov, .webm.")
      );
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(`Invalid file type (${file.mimetype}). Allowed: AVI/PDF/DOC/DOCX/MP4/MOV/WEBM.`)
      );
    }

    return cb(null, true);
  },
});

async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "uploads");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function baseUrlFromRequest(req: Request) {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  return host ? `${proto}://${host}` : "";
}

function safeFilename(original: string) {
  return original.replace(/[^a-zA-Z0-9._-]/g, "_");
}

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  let tempVideoPath: string | null = null;
  let tempThumbPath: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const useLocalUploads =
      process.env.USE_LOCAL_UPLOADS === "true" ||
      !process.env.S3_BUCKET_NAME ||
      !process.env.AWS_REGION;

    const ext = (req.file.originalname.split(".").pop() || "").toLowerCase();
    const isVideo = ["mp4", "mov", "webm"].includes(ext);

    let videoUrl = "";
    let key = "";
    let thumbnailUrl = "";
    let thumbnailKey = "";
    let durationSeconds = 0;

    if (useLocalUploads) {
      const uploadsDir = await ensureUploadsDir();
      const filename = `${Date.now()}-${safeFilename(req.file.originalname)}`;
      const dest = path.join(uploadsDir, filename);
      await fs.writeFile(dest, req.file.buffer);

      key = filename;
      const base = baseUrlFromRequest(req);
      videoUrl = base ? `${base}/uploads/${encodeURIComponent(filename)}` : "";
    } else {
      const s3 = await getAssumedS3();
      const bucket = process.env.S3_BUCKET_NAME!;
      key = `uploads/${Date.now()}-${safeFilename(req.file.originalname)}`;
      const uploadResult = await s3
        .upload({
          Bucket: bucket,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
        .promise();
      videoUrl = uploadResult.Location;
    }

    // If it's not a video, return S3 info only (no Video doc)
    // If it's not a video, assume it's a document/contract
    if (!isVideo) {
      // Extract the IDs from the request body (or session)
      const userId = req.body.user || req.session?.userId; 
      const lawyerId = req.body.lawyer;

      if (!userId || !lawyerId) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields: user and lawyer IDs are required." 
        });
      }

      // 1. Create the Contract record in MongoDB
      const newContract = await Contract.create({
        user: userId,       // <-- Added missing field
        lawyer: lawyerId,   // <-- Added missing field
        fileName: req.file.originalname,
        fileUrl: videoUrl, 
        fileSize: req.file.size,
        status: 'Pending'
      });

      // 2. Return the response
      return res.status(200).json({
        success: true,
        message: "Document uploaded and contract created!",
        s3Url: videoUrl,
        key,
        contract: newContract, 
      });
    }

    // For videos: compute duration + thumbnail
    tempVideoPath = await writeTempFile(req.file.buffer, req.file.originalname);
    durationSeconds = await getDurationSeconds(tempVideoPath);

    try {
      tempThumbPath = await generateThumbnail(tempVideoPath);
      if (tempThumbPath) {
        if (useLocalUploads) {
          const uploadsDir = await ensureUploadsDir();
          const thumbName = `${Date.now()}-${safeFilename(req.file.originalname.replace(/\.[^/.]+$/, ""))}.jpg`;
          const thumbDest = path.join(uploadsDir, thumbName);
          await fs.copyFile(tempThumbPath, thumbDest);
          thumbnailKey = thumbName;
          const base = baseUrlFromRequest(req);
          thumbnailUrl = base ? `${base}/uploads/${encodeURIComponent(thumbName)}` : "";
        } else {
          const s3 = await getAssumedS3();
          const bucket = process.env.S3_BUCKET_NAME!;
          const thumbKey = `thumbnails/${Date.now()}-${safeFilename(req.file.originalname.replace(/\.[^/.]+$/, ""))}.jpg`;
          const thumbBuffer = await (await import("fs/promises")).readFile(tempThumbPath);
          const thumbUpload = await s3
            .upload({
              Bucket: bucket,
              Key: thumbKey,
              Body: thumbBuffer,
              ContentType: "image/jpeg",
            })
            .promise();
          thumbnailKey = thumbKey;
          thumbnailUrl = thumbUpload.Location;
        }
      }
    } catch {
      // Best-effort thumbnails; if ffmpeg isn't available, still allow upload
    }

    // Create Video record
    const titleFromName =
      (req.body.title as string) || req.file.originalname.replace(/\.[^/.]+$/, "");

    const createdVideo = await Video.create({
      title: titleFromName,
      description: (req.body.description as string) || "",
      videoUrl,
      s3Key: key,
      thumbnailUrl,
      thumbnailKey,
      durationSeconds,
      status: (req.body.status as any) || "draft",
    });

    // Cleanup temp files
    const tempPaths: string[] = [];
    if (tempVideoPath) tempPaths.push(tempVideoPath);
    if (tempThumbPath) tempPaths.push(tempThumbPath);
    await cleanupFiles(tempPaths);

    return res.status(200).json({
      success: true,
      message: "Video uploaded to S3 and saved to DB!",
      s3Url: videoUrl,
      key,
      thumbnailUrl,
      thumbnailKey,
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
