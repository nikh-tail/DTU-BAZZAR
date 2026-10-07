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

// Root landing route
app.get('/', (req: Request, res: Response) => {
  if (req.accepts('html')) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DTU Bazaar — Backend API</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070B14; color: #F8FAFC; margin: 0; padding: 40px 20px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
    .card { background: #0E1526; border: 1px solid #1E293B; border-radius: 24px; padding: 36px; max-width: 520px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: center; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(198, 255, 61, 0.12); border: 1px solid #C6FF3D; color: #C6FF3D; border-radius: 999px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
    h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    h1 span { color: #C6FF3D; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .stat { background: #131C31; border: 1px solid #1E293B; border-radius: 14px; padding: 14px; text-align: left; }
    .stat-title { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; }
    .stat-value { font-size: 15px; color: #F8FAFC; font-weight: 800; margin-top: 4px; }
    .btn-group { display: flex; flex-direction: column; gap: 10px; }
    .btn { display: block; padding: 12px 20px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 13px; transition: all 0.2s ease; text-align: center; }
    .btn-primary { background: #C6FF3D; color: #0F172A; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: #1E293B; color: #F8FAFC; border: 1px solid #334155; }
    .btn-secondary:hover { background: #334155; }
    .footer { font-size: 11px; color: #475569; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚡ Status: Online & Running</div>
    <h1>DTU <span>BAZAAR</span> API</h1>
    <p>The backend gateway and real-time Socket.io engine for Delhi Technological University student marketplace is active.</p>
    
    <div class="grid">
      <div class="stat">
        <div class="stat-title">API Version</div>
        <div class="stat-value">v2.6.0</div>
      </div>
      <div class="stat">
        <div class="stat-title">Database</div>
        <div class="stat-value">PostgreSQL 16</div>
      </div>
      <div class="stat">
        <div class="stat-title">Realtime</div>
        <div class="stat-value">Socket.io Active</div>
      </div>
      <div class="stat">
        <div class="stat-title">OTP Security</div>
        <div class="stat-value">4 Digits (Active)</div>
      </div>
    </div>

    <div class="btn-group">
      <a class="btn btn-primary" href="/api/health">⚡ View Health Status (/api/health)</a>
      <a class="btn btn-secondary" href="/api/listings">📦 Browse Live Listings API (/api/listings)</a>
    </div>

    <div class="footer">
      To open the Web Client, run <code>npm run dev:client</code> at <code>http://localhost:5173</code>.<br>
      To run the Mobile App, open the <code>mobile/</code> project in Flutter.
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.status(200).json({
    status: 'ok',
    name: 'DTU Bazaar API Gateway',
    version: '2.6.0',
    health: '/api/health',
    listings: '/api/listings',
  });
});

// Health check route
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    version: '2.6.0',
    otpDigits: 4,
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

  // Keep-alive ping to prevent idle timeout during active usage
  setInterval(() => {
    http.get(`http://localhost:${config.port}/api/health`, () => {}).on('error', () => {});
  }, 5 * 60 * 1000);
}

export default app;
