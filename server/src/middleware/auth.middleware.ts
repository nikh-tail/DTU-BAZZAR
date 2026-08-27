import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthenticatedRequest, AuthUser } from '../types/index.js';
import prisma from '../config/prisma.js';

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ success: false, message: 'Invalid token format.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        branch: true,
        year: true,
        userType: true,
        hostel: true,
        isVerified: true,
        maxListings: true,
        isProSeller: true,
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User session expired or not found.' });
      return;
    }

    req.user = user as AuthUser;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            name: true,
            branch: true,
            year: true,
            userType: true,
            hostel: true,
            maxListings: true,
            isProSeller: true,
          },
        });
        if (user) {
          req.user = user as AuthUser;
        }
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
};
