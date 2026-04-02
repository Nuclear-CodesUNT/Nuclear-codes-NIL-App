import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { isLawyer } from "../middleware/isLawyer.js";
import { presignUpload } from "../controllers/uploadControllers.js";

const router = Router();

// Only lawyers can request upload URLs
router.post("/presign", isAuthenticated, isLawyer, presignUpload);

export default router;
