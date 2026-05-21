import { verifyJwt } from "@/lib/jwt";

export const AUTH_COOKIE_NAME = "oceanic_token";

export function getTokenFromRequest(request) {
  return request.cookies?.get?.(AUTH_COOKIE_NAME)?.value ?? null;
}

export function getAuthFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  try {
    const payload = verifyJwt(token);
    return { token, payload };
  } catch {
    return null;
  }
}

