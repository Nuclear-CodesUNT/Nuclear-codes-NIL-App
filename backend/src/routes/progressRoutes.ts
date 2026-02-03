import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getProgress, upsertProgress } from "../controllers/progressControllers.js";

const router = Router();

router.get("/:videoId", isAuthenticated, getProgress);
router.put("/:videoId", isAuthenticated, upsertProgress);

export default router;
