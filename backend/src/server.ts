import "dotenv/config";

import express, { type Express } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videoRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import uploadRouter from "./routes/upload.js";

import { isLawyer } from "./middleware/isLawyer.js";

// ---- Config helpers ----
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const MONGO_URI = requireEnv("MONGO_URI");
const SESSION_SECRET = requireEnv("SESSION_SECRET");

const PORT = Number(process.env.PORT ?? 4000);
const ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

// Optional debug logs (safe)
console.log("Bucket:", process.env.S3_BUCKET_NAME);
console.log("Region:", process.env.AWS_REGION);

const app: Express = express();

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// ---- Main startup ----
async function start() {
  try {
    // 1) Connect to Mongo first (fail fast)
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // faster failure when Atlas unreachable
    });
    console.log("✅ MongoDB connected");

    // 2) Only set up sessions after DB is reachable
    app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGO_URI }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
      })
    );

    // 3) Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/videos", videoRoutes);
    app.use("/api/progress", progressRoutes);
    app.use("/api/bookmarks", bookmarkRoutes);
    app.use("/api/upload", isLawyer, uploadRouter);

    // 4) Start server last
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

start();
