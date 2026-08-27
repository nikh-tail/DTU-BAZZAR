import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { StorageService } from '../services/storage.service.js';

const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  category: z.enum([
    'CYCLES',
    'ELECTRONICS',
    'BOOKS_ACADEMICS',
    'HOSTEL_ESSENTIALS',
    'LAB_STATIONERY',
    'SPORTS_FITNESS',
    'OTHER',
  ]),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR']),
  campusLocation: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
});

export class ListingController {
  /**
   * Search and filter listings
   */
  static async getListings(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        category,
        condition,
        campusLocation,
        minPrice,
        maxPrice,
        status = 'ACTIVE',
        sortBy = 'newest',
        page = '1',
        limit = '20',
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      // Filter by status (default ACTIVE for marketplace feed)
      if (status !== 'ALL') {
        where.status = status;
      }

      // Search term in title or description
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const query = search.trim();
        where.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { campusLocation: { contains: query } },
        ];
      }

      // Category filter
      if (category && typeof category === 'string' && category !== 'ALL') {
        where.category = category;
      }

      // Condition filter (support comma-separated conditions)
      if (condition && typeof condition === 'string' && condition !== 'ALL') {
        const conditions = condition.split(',').map((c) => c.trim());
        where.condition = { in: conditions };
      }

      // Campus Location / Hostel filter
      if (campusLocation && typeof campusLocation === 'string' && campusLocation !== 'ALL') {
        where.campusLocation = { contains: campusLocation };
      }

      // Price range
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined && !isNaN(Number(minPrice))) {
          where.price.gte = Number(minPrice);
        }
        if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
          where.price.lte = Number(maxPrice);
        }
      }

      // Sorting
      let orderBy: any = { createdAt: 'desc' };
      if (sortBy === 'price_asc') {
        orderBy = { price: 'asc' };
      } else if (sortBy === 'price_desc') {
        orderBy = { price: 'desc' };
      } else if (sortBy === 'popular') {
        orderBy = { viewsCount: 'desc' };
      }

      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            seller: {
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
                isProSeller: true,
              },
            },
          },
          orderBy,
          skip,
          take: limitNum,
        }),
        prisma.listing.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: listings,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch listings' });
    }
  }

  /**
   * Get single listing details and increment view count
   */
  static async getListingById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              branch: true,
              year: true,
              userType: true,
              hostel: true,
              roomNumber: true,
              phone: true,
              rating: true,
              reviewCount: true,
              avatar: true,
              isProSeller: true,
              maxListings: true,
              createdAt: true,
              _count: {
                select: {
                  listings: {
                    where: { status: 'ACTIVE' },
                  },
                },
              },
            },
          },
        },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found.' });
        return;
      }

      // Increment view count asynchronously
      prisma.listing
        .update({
          where: { id },
          data: { viewsCount: { increment: 1 } },
        })
        .catch(() => {});

      // Also fetch 4 related listings in same category
      const relatedListings = await prisma.listing.findMany({
        where: {
          category: listing.category,
          status: 'ACTIVE',
          id: { not: listing.id },
        },
        include: {
          images: { orderBy: { order: 'asc' } },
          seller: {
            select: { id: true, name: true, branch: true, year: true, hostel: true },
          },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: listing,
        related: relatedListings,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch listing details' });
    }
  }

  /**
   * Create a new campus listing
   */
  static async createListing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const validation = createListingSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid listing data',
        });
        return;
      }

      const { title, description, price, category, condition, campusLocation, imageUrls } =
        validation.data;

      // Enforce Listing Quota & Paywall Tier (3 for free, 10 for Pro Seller)
      const currentListingsCount = await prisma.listing.count({
        where: { sellerId: req.user.id, status: { not: 'ARCHIVED' } },
      });

      const maxLimit = req.user.maxListings ?? 3;

      if (currentListingsCount >= maxLimit) {
        res.status(402).json({
          success: false,
          code: 'PAYWALL_LIMIT_REACHED',
          message:
            maxLimit <= 3
              ? 'You have reached the free limit of 3 listings. Upgrade to Campus Seller Pro for ₹10 to unlock up to 10 listings!'
              : `You have reached your maximum seller capacity (${maxLimit} listings).`,
          currentCount: currentListingsCount,
          maxLimit,
          isProSeller: Boolean(req.user.isProSeller),
          upgradePrice: 10,
        });
        return;
      }

      // Handle uploaded files via StorageService (Cloudinary or local)
      const files = req.files as Express.Multer.File[];
      let uploadedUrls: string[] = [];

      if (files && files.length > 0) {
        uploadedUrls = await Promise.all(
          files.map((file) => StorageService.uploadFile(file, req.get('host') || ''))
        );
      }

      // Combine with any provided URL strings
      const allImages = [...uploadedUrls, ...(imageUrls || [])];

      // Fallback default mock image if no photo provided
      if (allImages.length === 0) {
        allImages.push('https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80');
      }

      const listing = await prisma.listing.create({
        data: {
          title,
          description,
          price,
          category,
          condition,
          campusLocation: campusLocation || req.user.hostel || 'DTU Main Campus',
          sellerId: req.user.id,
          images: {
            create: allImages.slice(0, 5).map((url, idx) => ({
              url,
              order: idx,
            })),
          },
        },
        include: {
          images: true,
          seller: {
            select: { id: true, name: true, branch: true, year: true, hostel: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Item listed successfully on DTU Bazaar!',
        data: listing,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to create listing' });
    }
  }

  /**
   * Update an existing listing
   */
  static async updateListing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const id = req.params.id as string;
      const existing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (existing.sellerId !== req.user.id) {
        res.status(403).json({ success: false, message: 'You can only edit your own listings' });
        return;
      }

      const validation = createListingSchema.partial().safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid update data',
        });
        return;
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: validation.data,
        include: {
          images: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Listing updated successfully',
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to update listing' });
    }
  }

  /**
   * Mark listing as SOLD
   */
  static async markAsSold(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const id = req.params.id as string;
      const listing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.sellerId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized to modify this listing' });
        return;
      }

      const updated = await prisma.listing.update({
        where: { id },
        data: { status: 'SOLD' },
      });

      res.status(200).json({
        success: true,
        message: 'Item marked as Sold and archived from active feed.',
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to mark as sold' });
    }
  }

  /**
   * Delete listing
   */
  static async deleteListing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const id = req.params.id as string;
      const listing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.sellerId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
        return;
      }

      await prisma.listing.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Listing removed successfully',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to delete listing' });
    }
  }

  /**
   * Get homepage categories with count and sample image
   */
  static async getCategoriesSummary(req: Request, res: Response): Promise<void> {
    try {
      const counts = await prisma.listing.groupBy({
        by: ['category'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
      });

      const categoriesMap: Record<string, number> = {};
      counts.forEach((c) => {
        categoriesMap[c.category] = c._count.id;
      });

      res.status(200).json({
        success: true,
        data: categoriesMap,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to get categories' });
    }
  }
}
