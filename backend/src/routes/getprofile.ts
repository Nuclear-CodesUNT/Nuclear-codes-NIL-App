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
      // Athlete update needs special handling.
      // After the highlights refactor (moving highlights to `athlete.highlights[]`),
      // some existing Mongo docs may still contain legacy `gameDays[].highlights[]`.
      // The frontend sends `gameDays` without those legacy nested highlights, so
      // overwriting `gameDays` would silently wipe them unless we migrate first.
      const athleteDoc = await Athlete.findOne({ userId });
      if (!athleteDoc) {
        return res.status(404).json({ error: "Athlete profile not found" });
      }

      // Pull a lean copy so we can see any legacy nested fields that are no longer
      // part of the Mongoose schema.
      const athleteLean = await Athlete.findOne({ userId }).lean();

      const existingTopLevel = Array.isArray((athleteDoc as any).highlights)
        ? ((athleteDoc as any).highlights as any[])
        : [];
      const existingKeySet = new Set(
        existingTopLevel.map((h) => `${String(h?.videoId || "")}::${String(h?.gameDayId || "")}`)
      );

      const legacyGameDays = Array.isArray((athleteLean as any)?.gameDays) ? (athleteLean as any).gameDays : [];
      const migratedFromLegacy: any[] = [];
      for (const gd of legacyGameDays) {
        const gdId = gd?._id ? String(gd._id) : "";
        const legacyHighlights = Array.isArray(gd?.highlights) ? gd.highlights : [];
        for (const h of legacyHighlights) {
          const vid = h?.videoId ? String(h.videoId) : "";
          if (!vid || !gdId) continue;
          const key = `${vid}::${gdId}`;
          if (existingKeySet.has(key)) continue;
          existingKeySet.add(key);
          migratedFromLegacy.push({
            videoId: h.videoId,
            gameDayId: gd._id,
            addedAt: h?.addedAt ? new Date(h.addedAt) : new Date(),
          });
        }
      }

      if (migratedFromLegacy.length) {
        (athleteDoc as any).highlights = [...existingTopLevel, ...migratedFromLegacy];
      }

      (athleteDoc as any).sport = req.body.sport;
      (athleteDoc as any).position = req.body.position;
      (athleteDoc as any).teamName = req.body.teamName;
      (athleteDoc as any).location = req.body.location;
      (athleteDoc as any).bio = req.body.bio;
      (athleteDoc as any).profilepicture = req.body.profilepicture;
      (athleteDoc as any).stats = req.body.stats || {};

      const incomingGameDays = Array.isArray(req.body.gameDays) ? req.body.gameDays : [];

      const mergedGameDays = incomingGameDays.map((gd: any) => {
        return {
          _id: gd?._id,
          date: gd?.date,
          homeAway: gd?.homeAway,
          opponent: gd?.opponent,
        };
      });

      (athleteDoc as any).gameDays = mergedGameDays;
      const updatedProfile = await athleteDoc.save();

      return res.json({ user, profile: updatedProfile });
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