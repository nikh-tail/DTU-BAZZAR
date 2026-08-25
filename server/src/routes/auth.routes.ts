import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Anti-spam and anti-brute-force guarded endpoints
router.post('/request-otp', otpRequestLimiter, AuthController.requestOtp);
router.post('/verify-otp', otpVerifyLimiter, AuthController.verifyOtpAndLogin);

// Protected authenticated session endpoint
router.get('/me', requireAuth, AuthController.getMe);

export default router;
