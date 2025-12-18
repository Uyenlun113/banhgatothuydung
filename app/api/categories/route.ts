import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate mỗi 5 phút (categories ít thay đổi)

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
    
    // Đếm số sản phẩm cho mỗi danh mục
    const categoriesWithCount = await Promise.all(
      categories.map(async (category: any) => {
        const productCount = await Product.countDocuments({ category: category._id, isActive: true });
        return { ...category, productCount };
      })
    );
    
    return NextResponse.json(
      { success: true, data: categoriesWithCount },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

