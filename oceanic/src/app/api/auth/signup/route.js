import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const SignupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(200),
  role: z.enum(["user", "admin"]).optional(),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;

  try {
    await connectToDatabase();
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Database not configured" },
      { status: 500 }
    );
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role: role ?? "user",
  });

  let token;
  try {
    token = signJwt({ sub: String(user._id), role: user.role, email: user.email });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "JWT not configured" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });

  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

