import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  userType: z.enum(['HOSTELER', 'DAY_SCHOLAR']).optional(),
  hostel: z.string().optional(),
  roomNumber: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export class UserController {
  /**
   * Get public profile of a student seller
   */
  static async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          branch: true,
          year: true,
          userType: true,
          hostel: true,
          rating: true,
          reviewCount: true,
          avatar: true,
          createdAt: true,
          listings: {
            where: { status: 'ACTIVE' },
            include: {
              images: { take: 1, orderBy: { order: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'Student profile not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch profile' });
    }
  }

  /**
   * Update authenticated user's own profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid profile data',
        });
        return;
      }

      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: validation.data,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update profile' });
    }
  }

  /**
   * Get all listings created by the authenticated user
   */
  static async getMyListings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const listings = await prisma.listing.findMany({
        where: { sellerId: req.user.id },
        include: {
          images: { orderBy: { order: 'asc' } },
          _count: {
            select: { conversations: true, savedBy: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const active = listings.filter((l) => l.status === 'ACTIVE');
      const sold = listings.filter((l) => l.status === 'SOLD');

      res.status(200).json({
        success: true,
        data: {
          all: listings,
          active,
          sold,
          stats: {
            totalListings: listings.length,
            activeCount: active.length,
            soldCount: sold.length,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch your listings' });
    }
  }

  /**
   * Toggle save/bookmark listing
   */
  static async toggleSaveListing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { listingId } = req.body;
      if (!listingId) {
        res.status(400).json({ success: false, message: 'Listing ID is required' });
        return;
      }

      const existing = await prisma.savedListing.findUnique({
        where: {
          userId_listingId: {
            userId: req.user.id,
            listingId: listingId as string,
          },
        },
      });

      if (existing) {
        await prisma.savedListing.delete({
          where: { id: existing.id },
        });
        res.status(200).json({
          success: true,
          saved: false,
          message: 'Item removed from saved wishlist',
        });
      } else {
        await prisma.savedListing.create({
          data: {
            userId: req.user.id,
            listingId: listingId as string,
          },
        });
        res.status(200).json({
          success: true,
          saved: true,
          message: 'Item saved to wishlist',
        });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to toggle save listing' });
    }
  }

  /**
   * Get saved/bookmarked listings for logged in user
   */
  static async getSavedListings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const saved = await prisma.savedListing.findMany({
        where: { userId: req.user.id },
        include: {
          listing: {
            include: {
              images: { orderBy: { order: 'asc' } },
              seller: {
                select: { id: true, name: true, branch: true, year: true, hostel: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: saved.map((s) => s.listing),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch saved listings' });
    }
  }
}
