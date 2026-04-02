import { Router } from "express";
import mongoose from "mongoose";
import Athlete from "../models/Athlete.js";
import Videos from "../models/Videos.js";
import { isAuthenticated } from "../middleware/auth.js";
import { trySignS3GetObjectUrl } from "../controllers/videoControllers.js";

const router = Router();
const HIGHLIGHTS_LIMIT = 6;

type ExistingHighlight = {
  highlightId: string;
  gameDayId: string;
  videoId: string;
  addedAt: string;
  title?: string;
  thumbnailUrl?: string;
};

function collectAllHighlightsFromLeanAthlete(athleteLean: any): ExistingHighlight[] {
  const topLevel = Array.isArray(athleteLean?.highlights) ? athleteLean.highlights : [];
  const gameDays = Array.isArray(athleteLean?.gameDays) ? athleteLean.gameDays : [];
  const out: ExistingHighlight[] = [];

  // New storage (preferred): athlete.highlights[]
  for (const h of topLevel) {
    const vid = h?.videoId ? String(h.videoId) : "";
    const gd = h?.gameDayId ? String(h.gameDayId) : "";
    out.push({
      highlightId: String(h._id),
      gameDayId: gd,
      videoId: vid,
      addedAt: new Date(h.addedAt || 0).toISOString(),
    });
  }

  // Legacy storage (back-compat): gameDays[].highlights[]
  for (const gd of gameDays) {
    const gdId = gd?._id ? String(gd._id) : "";
    const legacyHighlights = Array.isArray(gd?.highlights) ? gd.highlights : [];
    for (const h of legacyHighlights) {
      const vid = h?.videoId ? String(h.videoId) : "";
      out.push({
        highlightId: String(h._id),
        gameDayId: gdId,
        videoId: vid,
        addedAt: new Date(h.addedAt || 0).toISOString(),
      });
    }
  }

  out.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
  return out;
}

function enrichExistingWithVideoMeta(existing: ExistingHighlight[], vidMap: Map<string, any>) {
  return existing.map((h) => {
    const v = h.videoId ? vidMap.get(h.videoId) : null;
    return {
      ...h,
      title: v?.title || "",
      thumbnailUrl: v?.thumbnailUrl || "",
    };
  });
}

// Public: GET /api/athletes/:athleteId/highlights
router.get("/:athleteId/highlights", async (req, res) => {
  try {
    const { athleteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(athleteId)) {
      return res.status(400).json({ success: false, message: "Invalid athlete id." });
    }

    const athlete = await Athlete.findById(athleteId).lean();
    if (!athlete) {
      return res.status(404).json({ success: false, message: "Athlete not found." });
    }

    const gameDays = Array.isArray((athlete as any).gameDays) ? (athlete as any).gameDays : [];
    const gameDayMap = new Map<string, any>(gameDays.map((gd: any) => [String(gd._id), gd]));
    const allHighlights = collectAllHighlightsFromLeanAthlete(athlete as any);
    const raw = [] as any[];
    const videoIds = new Set<string>();

    for (const h of allHighlights) {
      const vid = h.videoId ? String(h.videoId) : null;
      const gdId = h.gameDayId ? String(h.gameDayId) : "";
      if (vid) videoIds.add(vid);

      const gd = gdId ? gameDayMap.get(gdId) : null;
      raw.push({
        highlightId: String(h.highlightId),
        gameDayId: gdId,
        gameDay: gd
          ? {
            date: gd.date,
            homeAway: gd.homeAway,
            opponent: gd.opponent,
          }
          : {
            date: null,
            homeAway: "Home",
            opponent: "",
          },
        videoId: vid,
        addedAt: h.addedAt,
      });
    }

    const vids = await Videos.find({ _id: { $in: Array.from(videoIds) } }).lean();
    const vidMap = new Map<string, any>(vids.map((v: any) => [String(v._id), v]));

    const out = await Promise.all(
      raw.map(async (h) => {
        const v = h.videoId ? vidMap.get(h.videoId) : null;
        let signedVideoUrl: string | null = null;

        if (v?.s3Key) {
          signedVideoUrl = await trySignS3GetObjectUrl(String(v.s3Key));
        }

        return {
          ...h,
          title: v?.title || "",
          thumbnailUrl: v?.thumbnailUrl || "",
          thumbnailKey: v?.thumbnailKey || "",
          durationSeconds: v?.durationSeconds || 0,
          videoUrl: signedVideoUrl || v?.videoUrl || "",
        };
      })
    );

    out.sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime());

    return res.json({ success: true, limit: HIGHLIGHTS_LIMIT, highlights: out });
  } catch (err: any) {
    console.error("GET athlete highlights error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

// Authenticated: POST /api/athletes/me/highlights
// Body: { videoId, gameDayId, replaceOldest?: boolean, removeHighlightId?: string }
router.post("/me/highlights", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { videoId, gameDayId, replaceOldest, removeHighlightId } = req.body || {};

    if (!videoId || !mongoose.Types.ObjectId.isValid(String(videoId))) {
      return res.status(400).json({ success: false, message: "Missing/invalid videoId." });
    }
    if (!gameDayId || !mongoose.Types.ObjectId.isValid(String(gameDayId))) {
      return res.status(400).json({ success: false, message: "Missing/invalid gameDayId." });
    }
    if (removeHighlightId && !mongoose.Types.ObjectId.isValid(String(removeHighlightId))) {
      return res.status(400).json({ success: false, message: "Invalid removeHighlightId." });
    }

    const athleteLean = await Athlete.findOne({ userId }).lean();
    if (!athleteLean) {
      return res.status(404).json({ success: false, message: "Athlete profile not found." });
    }

    const gameDays = Array.isArray((athleteLean as any).gameDays) ? (athleteLean as any).gameDays : [];
    const gameDayExists = gameDays.some((gd: any) => String(gd?._id) === String(gameDayId));
    if (!gameDayExists) {
      return res.status(404).json({ success: false, message: "Game day not found." });
    }

    const video = await Videos.findById(videoId).lean();
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    const existing = collectAllHighlightsFromLeanAthlete(athleteLean as any);

    // Fetch video metadata once for UI payloads (limit popup) and to validate video refs.
    const existingVideoIds = Array.from(
      new Set(existing.map((h) => h.videoId).filter((id) => mongoose.Types.ObjectId.isValid(id)))
    );
    const existingVideos = existingVideoIds.length
      ? await Videos.find({ _id: { $in: existingVideoIds } }).lean()
      : [];
    const existingVidMap = new Map<string, any>(existingVideos.map((v: any) => [String(v._id), v]));

    if (existing.length >= HIGHLIGHTS_LIMIT && !replaceOldest && !removeHighlightId) {
      const oldest = existing[0];
      const enrichedExisting = enrichExistingWithVideoMeta(existing, existingVidMap);
      const enrichedOldest = enrichedExisting.find((h) => h.highlightId === oldest.highlightId) || oldest;
      return res.status(409).json({
        success: false,
        code: "HIGHLIGHTS_LIMIT",
        limit: HIGHLIGHTS_LIMIT,
        message: `Maximum of ${HIGHLIGHTS_LIMIT} highlights reached. Remove one to add another.`,
        existingHighlights: enrichedExisting,
        suggestedRemove: enrichedOldest,
      });
    }

    // If we're at limit, remove one highlight per instruction
    if (existing.length >= HIGHLIGHTS_LIMIT) {
      let toRemoveId: string | null = null;

      if (removeHighlightId) {
        toRemoveId = String(removeHighlightId);
      } else if (replaceOldest) {
        toRemoveId = existing[0]?.highlightId || null;
      }

      if (!toRemoveId) {
        return res.status(400).json({ success: false, message: "No highlight selected to remove." });
      }

      const removeObjectId = new mongoose.Types.ObjectId(String(toRemoveId));
      const removeResult = await Athlete.updateOne(
        { _id: (athleteLean as any)._id },
        {
          $pull: {
            highlights: { _id: removeObjectId },
            // Back-compat: also remove from legacy nested storage if present
            "gameDays.$[].highlights": { _id: removeObjectId },
          },
        }
      );

      if (!removeResult.modifiedCount) {
        return res.status(404).json({ success: false, message: "Highlight to remove not found." });
      }
    }

    await Athlete.updateOne(
      { _id: (athleteLean as any)._id },
      {
        $push: {
          highlights: {
            videoId: new mongoose.Types.ObjectId(String(videoId)),
            gameDayId: new mongoose.Types.ObjectId(String(gameDayId)),
            addedAt: new Date(),
          },
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Attach highlight error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

// Authenticated: DELETE /api/athletes/me/highlights/:highlightId
router.delete("/me/highlights/:highlightId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { highlightId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(highlightId))) {
      return res.status(400).json({ success: false, message: "Invalid highlight id." });
    }

    const athleteLean = await Athlete.findOne({ userId }).lean();
    if (!athleteLean) {
      return res.status(404).json({ success: false, message: "Athlete profile not found." });
    }

    const removeObjectId = new mongoose.Types.ObjectId(String(highlightId));
    const removeResult = await Athlete.updateOne(
      { _id: (athleteLean as any)._id },
      {
        $pull: {
          highlights: { _id: removeObjectId },
          "gameDays.$[].highlights": { _id: removeObjectId },
        },
      }
    );

    if (!removeResult.modifiedCount) {
      return res.status(404).json({ success: false, message: "Highlight not found." });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Delete highlight error:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

export default router;
