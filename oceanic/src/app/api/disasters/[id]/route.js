import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { Disaster } from "@/models/Disaster";
import { requireAuth } from "@/lib/apiAuth";

export async function DELETE(request, { params }) {
  const { auth, errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  if (auth.payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDatabase();
  const deleted = await Disaster.findByIdAndDelete(params.id).lean();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

