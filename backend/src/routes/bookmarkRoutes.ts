import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addBookmark,
  removeBookmark,
  listBookmarks,
  isBookmarked,
} from "../controllers/bookmarkControllers.js";

const router = Router();

// List all bookmarked videos for current user
router.get("/", isAuthenticated, listBookmarks);

// Toggle on a specific video
router.get("/:id", isAuthenticated, isBookmarked);
router.post("/:id", isAuthenticated, addBookmark);
router.delete("/:id", isAuthenticated, removeBookmark);

export default router;
