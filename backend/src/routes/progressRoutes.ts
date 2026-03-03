import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getProgress, upsertProgress, getCompletedVideos } from "../controllers/progressControllers.js";

const router = Router();


// Get all completed video IDs for current user
router.get("/completed", isAuthenticated, getCompletedVideos);

router.get("/:videoId", isAuthenticated, getProgress);
router.put("/:videoId", isAuthenticated, upsertProgress);

export default router;
