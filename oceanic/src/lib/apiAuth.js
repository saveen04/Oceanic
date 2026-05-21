import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";

export function requireAuth(request) {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    return { auth: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { auth, errorResponse: null };
}

