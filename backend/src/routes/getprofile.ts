import { Router } from "express";
import { Model } from "mongoose";
import User from "../models/User.js";
import Athlete from "../models/Athlete.js";
import Coach from "../models/Coach.js";
import Lawyer from "../models/Lawyer.js";

const router = Router();

// GET retrieve profile
router.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId;

    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = null;

    if (user.role === "athlete") {
      profile = await Athlete.findOne({ userId }).lean();
    } else if (user.role === "coach") {
      profile = await Coach.findOne({ userId }).lean();
    } else if (user.role === "lawyer") {
      profile = await Lawyer.findOne({ userId }).lean();
    }

    return res.json({ user, profile });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put("/", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let profileModel: Model<any> | null = null;
    let updateData: any = {};

    if (user.role === "athlete") {
      profileModel = Athlete;
      updateData = {
        playerName: req.body.playerName,
        sport: req.body.sport,
        position: req.body.position,
        teamName: req.body.teamName,
        location: req.body.location,
        bio: req.body.bio,
        profilepicture: req.body.profilepicture,
        stats: req.body.stats || {},
        gameDays: req.body.gameDays || []
      };
    } else if (user.role === "coach") {
      profileModel = Coach;
      updateData = {
        school: req.body.school,
        sport: req.body.sport,
        role: req.body.role,
        yearsOfExperience: req.body.yearsOfExperience,
        certifications: req.body.certifications || [],
        achievements: req.body.achievements || [],
        bio: req.body.bio,
        profilePicture: req.body.profilePicture,
        specializations: req.body.specializations || []
      };
    } else if (user.role === "lawyer") {
      profileModel = Lawyer;
      updateData = {
        userName: req.body.userName,
        barNumber: req.body.barNumber,
        state: req.body.state,
        firmName: req.body.firmName,
        specializations: req.body.specializations || [],
        yearsOfExperience: req.body.yearsOfExperience || 0,
        bio: req.body.bio || "",
        profilepicture: req.body.profilepicture
      };
    }

    if (!profileModel) return res.status(400).json({ error: "Invalid role" });

    const updatedProfile = await profileModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true } // upsert ensures a profile exists
    );

    return res.json({ user, profile: updatedProfile });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;