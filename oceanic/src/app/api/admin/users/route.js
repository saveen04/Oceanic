import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(request) {
  const { auth, errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;
  if (auth.payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({
    users: users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
  });
}

