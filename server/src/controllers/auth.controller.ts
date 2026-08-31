import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { config } from '../config/env.js';
import { OtpService } from '../services/otp.service.js';
import { AuthenticatedRequest } from '../types/index.js';

const requestOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  purpose: z.enum(['SIGNUP', 'LOGIN']).optional().default('SIGNUP'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  name: z.string().min(2, 'Name must have at least 2 characters').optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  userType: z.enum(['HOSTELER', 'DAY_SCHOLAR']).optional().default('HOSTELER'),
  hostel: z.string().optional(),
  phone: z.string().optional(),
});

export class AuthController {
  /**
   * Request OTP for DTU Student email
   */
  static async requestOtp(req: Request, res: Response): Promise<void> {
    try {
      const validation = requestOtpSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid input parameters',
        });
        return;
      }

      const { email, purpose } = validation.data;
      const result = await OtpService.generateAndSendOtp(email, purpose);

      res.status(200).json({
        success: true,
        message: result.message,
        debugOtp: result.debugOtp,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to send OTP.',
      });
    }
  }

  /**
   * Verify OTP and Login / Register DTU Student
   */
  static async verifyOtpAndLogin(req: Request, res: Response): Promise<void> {
    try {
      const validation = verifyOtpSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid input parameters',
        });
        return;
      }

      const { email, otp, name, branch, year, userType, hostel, phone } = validation.data;
      const cleanEmail = email.trim().toLowerCase();

      // Verify OTP
      await OtpService.verifyOtp(cleanEmail, otp);

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      const isNewUser = !user;

      if (!user) {
        // Derive initial name from email prefix if not supplied
        const defaultName = name || cleanEmail.split('@')[0];
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            name: defaultName,
            branch: branch || 'Computer Science & Engineering',
            year: year || '2nd Year',
            userType: userType || 'HOSTELER',
            hostel: hostel || 'Aryabhatta Hostel',
            phone: phone || null,
            isVerified: true,
          },
        });
      } else if (name || branch || year || hostel || phone) {
        // Update user profile info if provided
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            branch: branch || user.branch,
            year: year || user.year,
            userType: userType || user.userType,
            hostel: hostel || user.hostel,
            phone: phone || user.phone,
          },
        });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '7d',
      });

      res.status(200).json({
        success: true,
        message: isNewUser ? 'Welcome to DTU Bazaar!' : 'Logged in successfully.',
        isNewUser: Boolean(isNewUser),
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          branch: user.branch,
          year: user.year,
          userType: user.userType,
          hostel: user.hostel,
          roomNumber: user.roomNumber,
          phone: user.phone,
          rating: user.rating,
          reviewCount: user.reviewCount,
          avatar: user.avatar,
        },
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'OTP verification failed.',
      });
    }
  }

  /**
   * Get Current Authenticated User profile
   */
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          _count: {
            select: {
              listings: true,
              savedListings: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          branch: user.branch,
          year: user.year,
          userType: user.userType,
          hostel: user.hostel,
          roomNumber: user.roomNumber,
          phone: user.phone,
          rating: user.rating,
          reviewCount: user.reviewCount,
          avatar: user.avatar,
          totalListings: user._count.listings,
          savedCount: user._count.savedListings,
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  }
}
