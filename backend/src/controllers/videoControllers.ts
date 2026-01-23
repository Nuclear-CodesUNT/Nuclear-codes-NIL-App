import { Request, Response } from "express";
import mongoose from "mongoose";
import Videos from "../models/Videos.js";

// GET /api/videos
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Videos.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
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
    const { id } = req.params;

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

    return res.status(200).json({
      success: true,
      video,
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
