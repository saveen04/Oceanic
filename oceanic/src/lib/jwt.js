import jwt from "jsonwebtoken";

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }
  return JWT_SECRET;
}

export function signJwt(payload, options = {}) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: options.expiresIn ?? "7d",
  });
}

export function verifyJwt(token) {
  return jwt.verify(token, getJwtSecret());
}

