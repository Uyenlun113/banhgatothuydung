import { uploadImage } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Helper function để luôn trả về JSON response
function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  // Wrap toàn bộ function để đảm bảo luôn trả về JSON
  try {
    // Check Cloudinary config
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration missing:', {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      });
      return jsonResponse(
        { success: false, error: 'Cloudinary configuration is missing. Please check your environment variables.' },
        500
      );
    }

    // Parse formData với error handling
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error: any) {
      console.error('FormData parse error:', error);
      return jsonResponse(
        { success: false, error: 'Lỗi đọc dữ liệu file. Vui lòng thử lại.' },
        400
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return jsonResponse({ success: false, error: 'Không có file được cung cấp' }, 400);
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      return jsonResponse({ success: false, error: 'File phải là hình ảnh' }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return jsonResponse({
        success: false,
        error: `Kích thước file phải nhỏ hơn 10MB. File hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      }, 400);
    }

    // Upload với timeout
    try {
      const uploadPromise = uploadImage(file);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timeout - quá thời gian chờ')), 25000)
      );

      const url = await Promise.race([uploadPromise, timeoutPromise]);

      if (!url || typeof url !== 'string') {
        return jsonResponse({ success: false, error: 'Upload thất bại - không nhận được URL' }, 500);
      }

      return jsonResponse({ success: true, url });
    } catch (uploadError: any) {
      console.error('Cloudinary upload error:', uploadError);
      const errorMessage = uploadError?.message || 'Lỗi upload lên Cloudinary';
      return jsonResponse(
        { success: false, error: errorMessage },
        500
      );
    }
  } catch (error: any) {
    // Catch mọi lỗi, kể cả lỗi không mong đợi
    console.error('Upload route error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });

    // Đảm bảo luôn trả về JSON, không bao giờ throw error
    const errorMessage = error?.message || 'Lỗi không xác định';
    return jsonResponse(
      {
        success: false,
        error: errorMessage,
        // Chỉ thêm detail trong development
        ...(process.env.NODE_ENV === 'development' && { detail: error?.stack })
      },
      500
    );
  }
}

// Export OPTIONS để handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

