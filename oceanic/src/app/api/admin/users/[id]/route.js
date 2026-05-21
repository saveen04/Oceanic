import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/apiAuth";

const PatchSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  name: z.string().min(2).max(80).optional(),
});

export async function PATCH(request, { params }) {
  const { auth, errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;
  if (auth.payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const updated = await User.findByIdAndUpdate(
    params.id,
    { $set: parsed.data },
    { new: true, projection: { password: 0 } }
  ).lean();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: String(updated._id),
      name: updated.name,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
    },
  });
}

export async function DELETE(request, { params }) {
  const { auth, errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;
  if (auth.payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();
  const deleted = await User.findByIdAndDelete(params.id).lean();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

