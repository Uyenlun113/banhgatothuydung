import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check admin routes
  if (pathname.startsWith("/admin")) {
    // For client-side auth check, we'll handle it in the layout
    // Middleware can't access localStorage, so we pass through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
