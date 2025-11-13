import 'dotenv/config'; 
import express from 'express';
import type { Express } from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import authRoutes from './routes/auth.js'; 
import uploadRouter from './routes/upload.js'

// DEBUG: Check if env vars are loaded
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('UPLOAD_DIR:', process.env.UPLOAD_DIR);
console.log('ROOT_PATH:', process.env.ROOT_PATH);
console.log('Current directory:', process.cwd());

const app: Express = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
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
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));