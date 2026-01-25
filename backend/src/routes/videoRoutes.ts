import express from "express";
import {
  getAllVideos,
  getVideoById,
  createVideo,
} from "../controllers/videoControllers.js";
import { isLawyer } from "../middleware/isLawyer.js";
import { isAuthenticated } from "../middleware/auth.js";


const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/", isAuthenticated, isLawyer, createVideo);

export default router;