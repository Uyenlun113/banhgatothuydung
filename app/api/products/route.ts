import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// Ensure Category model is registered before Product uses it for populate
const _Category = Category;

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate mỗi 60 giây

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '0');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // If no filter, show all active products
    if (!category && featured !== 'true' && !search) {
      query.isActive = true;
    }

    let productsQuery = Product.find(query)
      .populate('category', 'name slug')
      .select('-__v')
      .sort({ createdAt: -1 });

    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery;

    return NextResponse.json(
      { success: true, data: products },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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
    const product = await Product.create(body);
    await product.populate('category');
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

