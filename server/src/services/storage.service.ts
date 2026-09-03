import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.js';

// Configure Cloudinary if credentials are provided
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
  console.log('☁️  Cloudinary storage adapter initialized for DTU Bazaar');
}

export class StorageService {
  /**
   * Ensure local upload directory exists
   */
  static init() {
    const uploadPath = path.resolve(process.cwd(), config.uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  /**
   * Check if Cloudinary is configured and active
   */
  static isCloudinaryActive(): boolean {
    return Boolean(
      config.cloudinary.cloudName &&
      config.cloudinary.cloudName !== 'tier' &&
      config.cloudinary.apiKey &&
      config.cloudinary.apiSecret
    );
  }

  /**
   * Process and upload an image file (supports Cloudinary CDN or Local Disk)
   */
  static async uploadFile(file: Express.Multer.File, reqHost: string): Promise<string> {
    if (this.isCloudinaryActive()) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: config.cloudinary.folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' },
          ],
        });

        // Clean up temporary local file after uploading to Cloudinary
        fs.promises.unlink(file.path).catch(() => {});

        return uploadResult.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error, falling back to accessible URL:', err);
      }
    }

    // Accessible relative path served by Express static middleware
    return `/uploads/${file.filename}`;
  }

  /**
   * Converts local filename into a full URL for client consumption
   */
  static getImageUrl(reqHost: string, filename: string): string {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
      return filename;
    }
    const cleanPath = filename.startsWith('/') ? filename : `/${filename}`;
    if (reqHost && !reqHost.includes('localhost')) {
      const protocol = reqHost.includes('localhost') ? 'http' : 'https';
      return `${protocol}://${reqHost}${cleanPath}`;
    }
    return cleanPath;
  }

  /**
   * Delete an image file from local storage or Cloudinary
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      if (imageUrl.includes('cloudinary.com')) {
        const parts = imageUrl.split('/');
        const fileNameWithExt = parts.slice(-2).join('/');
        const publicId = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'));
        await cloudinary.uploader.destroy(publicId);
        return true;
      }

      // Local file delete
      const filename = path.basename(imageUrl);
      const filePath = path.resolve(process.cwd(), config.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
