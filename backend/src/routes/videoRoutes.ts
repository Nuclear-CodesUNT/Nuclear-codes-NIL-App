import { Router, Request, Response } from "express";
import Video from "../models/Videos.js";
import { isLawyer } from "../middleware/isLawyer.js";
import { getAssumedS3 } from "../utils/aws.js";

const router = Router();

// DELETE /api/videos/:id  (lawyers only)
router.delete("/:id", isLawyer, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const s3 = await getAssumedS3();
    const bucket = process.env.S3_BUCKET_NAME!;

    const objectsToDelete = [
      video.s3Key ? { Key: video.s3Key } : null,
      video.thumbnailKey ? { Key: video.thumbnailKey } : null,
    ].filter(Boolean) as { Key: string }[];

    if (objectsToDelete.length > 0) {
      await s3
        .deleteObjects({
          Bucket: bucket,
          Delete: { Objects: objectsToDelete, Quiet: true },
        })
        .promise();
    }

    await Video.deleteOne({ _id: id });

    return res.json({
      success: true,
      message: "Video deleted (S3 + DB).",
      deleted: {
        videoKey: video.s3Key,
        thumbnailKey: video.thumbnailKey,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
