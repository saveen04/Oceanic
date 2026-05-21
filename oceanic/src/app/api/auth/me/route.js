import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getAuthFromRequest } from "@/lib/auth";

export async function GET(request) {
  const auth = getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ user: null }, { status: 200 });

  try {
    await connectToDatabase();
  } catch {
    // If DB isn't configured, don't break the UI shell.
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const user = await User.findById(auth.payload.sub).lean();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
}

