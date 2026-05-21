import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "oceanic_token";

async function verifyToken(token) {
  const raw = process.env.JWT_SECRET;
  if (!raw) return null;
  const secret = new TextEncoder().encode(raw);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

function isApiRequest(pathname) {
  return pathname.startsWith("/api/");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // If JWT isn't configured, treat all protected routes as unauthenticated.
  if (!process.env.JWT_SECRET) {
    if (isApiRequest(pathname)) {
      return NextResponse.json(
        { error: "Server not configured (missing JWT_SECRET)" },
        { status: 500 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!token) {
    if (isApiRequest(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) throw new Error("Invalid token");

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (payload?.role !== "admin") {
        if (isApiRequest(pathname)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    const res = NextResponse.next();
    res.headers.set("x-oceanic-user", String(payload?.sub ?? ""));
    res.headers.set("x-oceanic-role", String(payload?.role ?? ""));
    return res;
  } catch {
    if (isApiRequest(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/map/:path*",
    "/weather/:path*",
    "/disasters/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/api/disasters/:path*",
    "/api/history/:path*",
    "/api/admin/:path*",
  ],
};

