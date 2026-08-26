import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config/env.js';
import { StorageService } from './services/storage.service.js';
import { SocketService } from './services/socket.service.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';

// Initialize storage folders
StorageService.init();

export const app = express();
app.set('trust proxy', 1);
export const httpServer = http.createServer(app);

// 1. Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows uploaded images to be rendered by client
    contentSecurityPolicy: false, // Disabled for development, enable custom CSP on production
  })
);

// 2. Global Rate Limiter
app.use('/api', globalLimiter);

// 3. Setup Socket.io
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

SocketService.init(io);

// 4. Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads route
const uploadPath = path.resolve(process.cwd(), config.uploadDir);
app.use('/uploads', express.static(uploadPath));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'DTU Bazaar API is running smoothly with Helmet & Rate-Limiting active ⚡',
    timestamp: new Date().toISOString(),
    allowedDomains: config.allowedDomains,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server if not imported by test runner
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(config.port, () => {
    console.log(`\n🚀 DTU Bazaar Server running at http://localhost:${config.port}`);
    console.log(`🎓 Restricted to verified DTU students: ${config.allowedDomains.join(', ')}`);
    console.log(`🛡️  Helmet security headers & express-rate-limit active`);
    console.log(`💬 Real-time Socket.io active`);
    console.log(`📁 Local storage uploads ready at ${uploadPath}\n`);
  });
}

export default app;
