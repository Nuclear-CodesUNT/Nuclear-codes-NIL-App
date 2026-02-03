import type { Request, Response } from "express";
import mongoose from "mongoose";
import VideoBookmark from "../models/VideoBookmark.js";
import Videos from "../models/Videos.js";

export async function addBookmark(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const { id: videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id." });
    }

    await VideoBookmark.updateOne(
      { userId, videoId },
      { $setOnInsert: { userId, videoId } },
      { upsert: true }
    );

    return res.status(200).json({ success: true, bookmarked: true });
  } catch (err: any) {
    // duplicate key => already bookmarked
    if (err?.code === 11000) {
      return res.status(200).json({ success: true, bookmarked: true });
    }
    console.error("addBookmark error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeBookmark(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const { id: videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id." });
    }

    await VideoBookmark.deleteOne({ userId, videoId });
    return res.status(200).json({ success: true, bookmarked: false });
  } catch (err) {
    console.error("removeBookmark error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function listBookmarks(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;

    const bookmarks = await VideoBookmark.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const videoIds = bookmarks.map((b) => b.videoId);

    const videos = await Videos.find({ _id: { $in: videoIds } })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, videos });
  } catch (err) {
    console.error("listBookmarks error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function isBookmarked(req: Request, res: Response) {
  try {
    const userId = req.session.userId!;
    const { id: videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id." });
    }

    const exists = await VideoBookmark.exists({ userId, videoId });
    return res.status(200).json({ success: true, bookmarked: !!exists });
  } catch (err) {
    console.error("isBookmarked error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
