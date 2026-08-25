import prisma from '../config/prisma.js';
import { config } from '../config/env.js';
import { EmailService } from './email.service.js';

export class OtpService {
  /**
   * Validate if email is allowed (supports all emails including Gmail or specific whitelist)
   */
  static isAllowedEmail(email: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];
    if (!domain) return false;

    // If '*' is configured, allow all domains (Gmail, Yahoo, Outlook, DTU, etc.)
    if (config.allowedDomains.includes('*') || config.allowedDomains.includes('all')) {
      return true;
    }

    return config.allowedDomains.some(
      (allowed) => domain === allowed || domain.endsWith('.' + allowed)
    );
  }

  /**
   * Generate and persist a 6-digit OTP code for the given email
   */
  static async generateAndSendOtp(email: string, purpose: 'SIGNUP' | 'LOGIN' = 'SIGNUP') {
    const cleanEmail = email.trim().toLowerCase();

    if (!this.isAllowedEmail(cleanEmail)) {
      throw new Error(
        `Please enter a valid email address. (Allowed domains: ${config.allowedDomains.join(', ')})`
      );
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    // Delete any pending OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: { email: cleanEmail },
    });

    // Save newly generated OTP
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otp,
        expiresAt,
      },
    });

    // Send email / log OTP
    await EmailService.sendOtp(cleanEmail, otp, purpose);

    return {
      success: true,
      message: `Verification OTP sent to ${cleanEmail}. Valid for ${config.otpExpiryMinutes} minutes.`,
      // For development convenience in simulated mode:
      debugOtp: config.simulateEmailOtp ? otp : undefined,
    };
  }

  /**
   * Verify provided OTP
   */
  static async verifyOtp(email: string, inputOtp: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();

    const record = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new Error('Invalid or expired OTP. Please request a new verification code.');
    }

    if (record.otp !== inputOtp.trim()) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new Error('Incorrect OTP code. Please verify and enter again.');
    }

    // Successfully verified, clean up used OTP
    await prisma.otpVerification.delete({
      where: { id: record.id },
    });

    return true;
  }
}
