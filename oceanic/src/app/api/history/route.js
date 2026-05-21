import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { Disaster } from "@/models/Disaster";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 100), 500);
  const type = searchParams.get("type");
  const severity = searchParams.get("severity");
  const q = searchParams.get("q");

  const query = {};
  if (type) query.type = type;
  if (severity) query.severity = severity;
  if (q) query.location = { $regex: q, $options: "i" };

  await connectToDatabase();
  const items = await Disaster.find(query).sort({ createdAt: -1 }).limit(limit).lean();

  return NextResponse.json({ items });
}

