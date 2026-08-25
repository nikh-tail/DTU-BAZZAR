import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.js';

async function testCloudinary() {
  console.log('☁️ Testing Cloudinary Credentials for DTU Bazaar...\n');
  console.log(`Cloud Name: ${config.cloudinary.cloudName}`);
  console.log(`API Key: ${config.cloudinary.apiKey}`);

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });

  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Ping Successful! Result:', result);

    // Test a sample upload
    const uploadRes = await cloudinary.uploader.upload(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      {
        folder: 'dtu-bazaar/test',
        public_id: 'sample_ping',
      }
    );
    console.log('✅ Cloudinary Test Upload Successful! CDN URL:');
    console.log(uploadRes.secure_url);
    console.log('\n🎉 Cloudinary is 100% active and working for DTU Bazaar!');
  } catch (err: any) {
    console.error('❌ Cloudinary Error:', err);
  }
}

testCloudinary();
