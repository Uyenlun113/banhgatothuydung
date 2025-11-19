import { v2 as cloudinary } from 'cloudinary';

// Validate Cloudinary config
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Chỉ config nếu có đủ thông tin
if (cloudName && apiKey && apiSecret) {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
} else {
  console.warn('Cloudinary configuration is missing. Image uploads will not work.');
}

export default cloudinary;

export const uploadImage = async (file: File | Buffer): Promise<string> => {
  // Validate config trước khi upload
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration is missing');
  }

  let buffer: Buffer;
  
  try {
    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } else {
      buffer = file;
    }
  } catch (error: any) {
    throw new Error(`Error reading file: ${error.message}`);
  }

  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'ap-cake',
          },
          (error: any, result: any) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error(error.message || 'Cloudinary upload failed'));
            } else if (!result || !result.secure_url) {
              reject(new Error('Cloudinary returned invalid response'));
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(buffer);
    } catch (error: any) {
      reject(new Error(`Error starting upload: ${error.message}`));
    }
  });
};

