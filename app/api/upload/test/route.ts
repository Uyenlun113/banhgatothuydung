import { NextResponse } from 'next/server';

// Test endpoint để kiểm tra API có hoạt động không
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Upload API is working',
    cloudinary: {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    },
  });
}

