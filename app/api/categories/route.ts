import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  try {
    await connectDB();
    
    // Sử dụng aggregation để đếm sản phẩm thay vì import Product model
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$category', '$$categoryId'] },
                    { $eq: ['$isActive', true] }
                  ]
                }
              }
            }
          ],
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          products: 0,
          __v: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    
    return NextResponse.json(
      { success: true, data: categories },
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
