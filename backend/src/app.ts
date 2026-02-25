import 'dotenv/config'; 
import express from 'express';
import type { Express } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import contractsRouter from './routes/contracts.js'; 
import usersRouter from './routes/user.js';

const app: Express = express();
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: ORIGIN,
  credentials: true
}));
app.use(express.json());

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
app.use('/api/users', usersRouter);

export default app;
