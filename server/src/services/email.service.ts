import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import https from 'https';
import { config } from '../config/env.js';

export class EmailService {
  private static resendClient: Resend | null = null;
  private static smtpTransporter: nodemailer.Transporter | null = null;

  private static getResend(): Resend | null {
    if (!this.resendClient && config.email.resendApiKey) {
      this.resendClient = new Resend(config.email.resendApiKey);
    }
    return this.resendClient;
  }

  private static getTransporter(): nodemailer.Transporter | null {
    if (!this.smtpTransporter && config.email.smtp.user && config.email.smtp.pass) {
      this.smtpTransporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.pass,
        },
      });
    }
    return this.smtpTransporter;
  }

  /**
   * Generates a styled dark-theme DTU Bazaar HTML email template
   */
  private static generateEmailHtml(otp: string, purpose: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #070B14; color: #F1F5F9; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background-color: #0E1526; border: 1px solid #1E293B; border-radius: 24px; padding: 32px; text-align: center; }
          .logo { font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 8px; }
          .logo-badge { color: #C6FF3D; }
          .title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin-top: 16px; margin-bottom: 8px; }
          .subtitle { font-size: 13px; color: #94A3B8; line-height: 1.5; margin-bottom: 24px; }
          .otp-box { background: linear-gradient(135deg, rgba(198, 255, 61, 0.1) 0%, rgba(198, 255, 61, 0.03) 100%); border: 2px dashed #C6FF3D; border-radius: 16px; padding: 18px 24px; margin: 24px 0; }
          .otp-code { font-size: 36px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #C6FF3D; }
          .expiry { font-size: 12px; color: #8E9EB5; margin-top: 16px; }
          .footer { font-size: 11px; color: #64748B; margin-top: 32px; border-top: 1px solid #1E293B; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ DTU <span class="logo-badge">BAZAAR</span></div>
          <div class="title">${purpose === 'LOGIN' ? 'Login Verification Code' : 'Welcome to DTU Bazaar'}</div>
          <p class="subtitle">Use the verification code below to complete your login or registration on DTU Bazaar.</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="expiry">⏰ Valid for <strong>${config.otpExpiryMinutes} minutes</strong>. Do not share this code with anyone.</p>
          
          <div class="footer">
            <p>Delhi Technological University Student Marketplace<br>Bawana Road, Shahbad Daulatpur, Delhi 110042</p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Sends real email via Brevo REST API
   */
  private static async sendViaBrevoApi(apiKey: string, email: string, otp: string, purpose: string): Promise<boolean> {
    return new Promise((resolve) => {
      const payload = JSON.stringify({
        sender: { name: 'DTU Bazaar', email: config.email.smtp.user || 'dtubazaar.help@gmail.com' },
        to: [{ email }],
        subject: `⚡ Your DTU Bazaar Verification Code: ${otp}`,
        htmlContent: this.generateEmailHtml(otp, purpose),
        textContent: `Your DTU Bazaar verification code is: ${otp}`,
      });

      const req = https.request('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Real email delivered via Brevo API to ${email}! Response: ${body}`);
            resolve(true);
          } else {
            console.error(`❌ Brevo API error (${res.statusCode}):`, body);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        console.error('❌ Brevo API Network error:', err);
        resolve(false);
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Sends actual real OTP to the student's email inbox
   */
  static async sendOtp(email: string, otp: string, purpose: 'SIGNUP' | 'LOGIN' = 'SIGNUP'): Promise<boolean> {
    const subject = `⚡ Your DTU Bazaar Verification Code: ${otp}`;
    const htmlContent = this.generateEmailHtml(otp, purpose);
    const textContent = `Your DTU Bazaar verification code is: ${otp}. Valid for ${config.otpExpiryMinutes} minutes.`;

    // 1. Try Brevo API if configured
    const brevoKey = process.env.BREVO_API_KEY || (config.email.resendApiKey?.startsWith('xkeysib-') ? config.email.resendApiKey : null);
    if (brevoKey) {
      console.log(`📧 Sending real email via Brevo API to ${email}...`);
      const sent = await this.sendViaBrevoApi(brevoKey, email, otp, purpose);
      if (sent) return true;
    }

    // 2. Try Brevo / Custom Nodemailer SMTP
    const transporter = this.getTransporter();
    if (transporter) {
      try {
        console.log(`📧 Sending real email via SMTP (${config.email.smtp.host}) to ${email}...`);
        const info = await transporter.sendMail({
          from: `"DTU Bazaar" <${config.email.smtp.user}>`,
          to: email,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`✅ Real email successfully delivered via SMTP to ${email}! (Message ID: ${info.messageId})`);
        return true;
      } catch (err) {
        console.error('❌ SMTP dispatch error:', err);
      }
    }

    // 3. Try Resend API
    const resend = this.getResend();
    if (resend && !config.email.resendApiKey?.startsWith('xkeysib-') && !config.email.resendApiKey?.startsWith('xsmtpsib-')) {
      try {
        console.log(`📧 Sending real email via Resend to ${email}...`);
        const { data, error } = await resend.emails.send({
          from: config.email.from,
          to: email,
          subject,
          html: htmlContent,
          text: textContent,
        });

        if (error) {
          console.error('❌ Resend API Error:', error);
        } else {
          console.log(`✅ Real email successfully delivered via Resend to ${email}! (ID: ${data?.id})`);
          return true;
        }
      } catch (err) {
        console.error('❌ Resend dispatch error:', err);
      }
    }

    // 4. Server console logger fallback
    console.log('\n======================================================');
    console.log(`🎓 [DTU BAZAAR EMAIL SERVICE] -> TO: ${email}`);
    console.log(`🔑 PURPOSE: ${purpose}`);
    console.log(`⚡ OTP CODE: >>>  ${otp}  <<<`);
    console.log(`⏰ VALID FOR: ${config.otpExpiryMinutes} minutes`);
    console.log('======================================================\n');
    return false;
  }
}
