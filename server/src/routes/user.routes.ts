import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public student profile
router.get('/profile/:id', UserController.getUserProfile);

// User specific protected routes
router.put('/profile', requireAuth, UserController.updateProfile);
router.get('/my-listings', requireAuth, UserController.getMyListings);
router.post('/saved/toggle', requireAuth, UserController.toggleSaveListing);
router.get('/saved', requireAuth, UserController.getSavedListings);

export default router;
