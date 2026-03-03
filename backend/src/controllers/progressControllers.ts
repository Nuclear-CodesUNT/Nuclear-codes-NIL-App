// Get all completed video IDs for current user
export async function getCompletedVideos(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const completed = await VideoProgress.find({ userId, completed: true }).select("videoId");
    const completedVideoIds = completed.map((doc: any) => String(doc.videoId));
    return res.status(200).json({ success: true, completedVideoIds });
  } catch (err) {
    console.error("getCompletedVideos error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
import type { Request, Response } from "express";
import mongoose from "mongoose";
import VideoProgress from "../models/videoProgress.js";

export async function getProgress(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const videoId = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId;

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
    const videoId = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId;
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
