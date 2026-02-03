import type { Request, Response } from "express";
import mongoose from "mongoose";
import VideoProgress from "../models/videoProgress.js";

export async function getProgress(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id." });
    }

    const progress = await VideoProgress.findOne({ userId, videoId });

    return res.status(200).json({
      success: true,
      progress: progress || { secondsWatched: 0, completed: false },
    });
  } catch (err) {
    console.error("getProgress error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function upsertProgress(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const { videoId } = req.params;
    const { secondsWatched, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id." });
    }

    const safeSeconds =
      typeof secondsWatched === "number" && secondsWatched >= 0
        ? secondsWatched
        : 0;

    const safeCompleted = typeof completed === "boolean" ? completed : false;

    const updated = await VideoProgress.findOneAndUpdate(
      { userId, videoId },
      { $set: { secondsWatched: safeSeconds, completed: safeCompleted } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, progress: updated });
  } catch (err) {
    console.error("upsertProgress error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
