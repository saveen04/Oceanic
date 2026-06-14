import { NextResponse } from "next/server";

/**
 * Oceanic AI Middleware
 * Simplified to allow Firebase client-side authentication to manage state.
 * Legacy JWT enforcement has been suspended to prioritize production stability
 * during the high-fidelity UI overhaul.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow all traffic in this phase; client-side AuthContext handles protection
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/map/:path*",
    "/weather/:path*",
    "/disasters/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};

