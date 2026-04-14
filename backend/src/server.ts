import * as http from 'http';

import app, { sessionMiddleware } from './app.js';
import connectDB from './config/db.js';
import { setupSocket } from './socket.js';

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
await connectDB();

const server = http.createServer(app);
setupSocket(server, sessionMiddleware);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

