import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.js';
import getprofileRouter from "./routes/getprofile.js";
import usersRouter from './routes/user.js';
import inviteCodeRoutes from './routes/inviteCode.js';
import videoRoutes from "./routes/videoRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import uploadRouter from "./routes/upload.js";
import contractsRouter from "./routes/contracts.js";
import athletesRouter from "./routes/athletes.js";

const app: Express = express();
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: ORIGIN,
  credentials: true
}));
app.use(express.json());

// Local uploads (dev-friendly): serve files written to ./uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI! }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/contracts', contractsRouter);
app.use("/api/profile", getprofileRouter);
app.use('/api/users', usersRouter);
app.use('/api/invite-codes', inviteCodeRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/athletes", athletesRouter);
app.use("/api/progress", progressRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/contracts", contractsRouter);
app.use("/api/upload", uploadRouter);

export default app;
