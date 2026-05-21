import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const h = await headers();
    const userId = h.get("x-oceanic-user");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Update failed" }, { status: 500 });
  }
}
