import rateLimit from 'express-rate-limit';

/**
 * 1. Global API Rate Limiter
 * Generous threshold for normal browsing & active student usage
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this device, please try again after a few minutes.',
  },
});

/**
 * 2. OTP Request Limiter
 * Generous threshold (100 requests per 10 minutes) to prevent proxy locking
 */
export const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests for this account. Please wait a few minutes before requesting a new code.',
  },
});

/**
 * 3. OTP Verification Limiter
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many incorrect OTP attempts. Please wait a few minutes.',
  },
});

/**
 * 4. Create Listing Limiter (Anti-Spam)
 */
export const createListingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Hourly listing limit reached. Please try again later.',
  },
});

/**
 * 5. Chat Message Limiter (Anti-Flooding)
 */
export const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You are sending messages too fast. Please slow down.',
  },
});
