import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

export async function isLawyer(req: Request, res: Response, next: NextFunction) {
  try {
    // must be logged in first
    if (!req.session.userId) {
      return res.status(401).json({ message: "You must be logged in to access this." });
    }

    const user = await User.findById(req.session.userId).select("role");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "lawyer") {
      return res.status(403).json({ message: "Lawyers only." });
    }

    next();
  } catch (err) {
    console.error("isLawyer error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
