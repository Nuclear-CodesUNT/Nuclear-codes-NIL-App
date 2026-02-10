import 'dotenv/config';
console.log("Bucket:", process.env.S3_BUCKET_NAME);
console.log("Region:", process.env.AWS_REGION);

import express, { type Express } from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videoRoutes.js';
import progressRoutes from "./routes/progressRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import uploadRouter from './routes/upload.js';

import { isLawyer } from './middleware/isLawyer.js';

const app: Express = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI! }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// PROTECTED upload route (lawyers only)
app.use('/api/upload', isLawyer, uploadRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
