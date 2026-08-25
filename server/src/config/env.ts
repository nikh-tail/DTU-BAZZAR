import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dtu_bazaar_jwt_super_secret_key_2026_campus_token',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  allowedDomains: (process.env.ALLOWED_EMAIL_DOMAINS || '*')
    .split(',')
    .map((d) => d.trim().toLowerCase()),
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
  simulateEmailOtp: process.env.SIMULATE_EMAIL_OTP === 'true',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),

  // Cloudinary Storage Config
  storageProvider: process.env.STORAGE_PROVIDER || (process.env.CLOUDINARY_CLOUD_NAME ? 'cloudinary' : 'local'),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'dtu-bazaar/listings',
  },

  // Real Email Service Config (Resend or Nodemailer SMTP)
  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'DTU Bazaar <onboarding@resend.dev>',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE !== 'false',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
};
