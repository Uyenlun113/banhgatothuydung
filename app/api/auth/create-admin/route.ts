import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        error: "Admin user already exists",
        hint: "Email: " + existingAdmin.email,
      });
    }

    // Create default admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@banhgathuydung.vn",
      password: "admin123",
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      data: {
        email: admin.email,
        password: "admin123",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
