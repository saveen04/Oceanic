import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signJwt } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1).max(200),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Database not configured" },
      { status: 500 }
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

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

