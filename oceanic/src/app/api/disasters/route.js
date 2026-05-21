import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { Disaster } from "@/models/Disaster";
import { requireAuth } from "@/lib/apiAuth";

const CreateDisasterSchema = z.object({
  type: z.enum(["tsunami", "cyclone", "high_waves", "tide", "storm_surge", "coastal_flooding"]),
  location: z.string().min(2).max(120),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  severity: z.enum(["low", "moderate", "high", "critical"]).optional(),
  waveHeight: z.number().nullable().optional(),
  tideLevel: z.number().nullable().optional(),
  source: z.string().optional(),
  meta: z.record(z.any()).optional(),
});

export async function GET(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
  const type = searchParams.get("type");
  const severity = searchParams.get("severity");

  const query = {};
  if (type) query.type = type;
  if (severity) query.severity = severity;

  await connectToDatabase();
  const items = await Disaster.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  return NextResponse.json({ items });
}

export async function POST(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  const body = await request.json().catch(() => null);
  const parsed = CreateDisasterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const created = await Disaster.create({
    ...parsed.data,
    severity: parsed.data.severity ?? "low",
    source: parsed.data.source ?? "manual",
    meta: parsed.data.meta ?? {},
  });

  return NextResponse.json({ item: created }, { status: 201 });
}

