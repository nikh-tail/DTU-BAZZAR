import { Router } from 'express';
import { ListingController } from '../controllers/listing.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadImages } from '../middleware/upload.middleware.js';
import { createListingLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes
router.get('/', ListingController.getListings);
router.get('/categories-summary', ListingController.getCategoriesSummary);
router.get('/:id', ListingController.getListingById);

// Protected routes
router.post(
  '/',
  requireAuth,
  createListingLimiter,
  uploadImages.array('images', 5),
  ListingController.createListing
);
router.put('/:id', requireAuth, ListingController.updateListing);
router.patch('/:id/sold', requireAuth, ListingController.markAsSold);
router.delete('/:id', requireAuth, ListingController.deleteListing);

export default router;
