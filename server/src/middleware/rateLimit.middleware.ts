import rateLimit from 'express-rate-limit';

/**
 * 1. Global API Rate Limiter
 * Restricts overall flood traffic to 300 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * 2. OTP Request Limiter (Anti-Email-Spam)
 * Restricts students to max 4 OTP requests per 10 minutes
 * Prevents exhausting third-party email quotas and spamming inboxes
 */
export const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests for this account. Please wait 10 minutes before requesting a new code.',
  },
});

/**
 * 3. OTP Verification Limiter (Anti-Brute-Force)
 * Restricts students to max 8 OTP verification attempts per 10 minutes
 * Prevents brute-forcing 6-digit verification codes
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many incorrect OTP attempts. For campus security, please wait 10 minutes.',
  },
});

/**
 * 4. Create Listing Limiter (Anti-Spam)
 * Restricts creation of listings to 15 items per hour per IP
 */
export const createListingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Hourly listing limit reached (15 items/hr). Please try again later.',
  },
});

/**
 * 5. Chat Message Limiter (Anti-Flooding)
 * Restricts chat messages to 60 messages per minute
 */
export const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You are sending messages too fast. Please slow down.',
  },
});
