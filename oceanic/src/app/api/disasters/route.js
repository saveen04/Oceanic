import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

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
  try {
    const { searchParams } = new URL(request.url);
    const resultLimit = Math.min(Number(searchParams.get("limit") || 50), 200);

    const disastersSnap = await getDocs(
      query(collection(db, "disasters"), orderBy("createdAt", "desc"), limit(resultLimit))
    );

    const items = disastersSnap.docs.map(doc => ({
      ...doc.data(),
      _id: doc.id,
      // Ensure createdAt is serialized as string if it's a Firestore Timestamp
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Firestore Disasters Fetch Error:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = CreateDisasterSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const created = await addDoc(collection(db, "disasters"), {
      ...parsed.data,
      severity: parsed.data.severity ?? "low",
      source: parsed.data.source ?? "manual",
      meta: parsed.data.meta ?? {},
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ item: { id: created.id, ...parsed.data } }, { status: 201 });
  } catch (error) {
    console.error("Firestore Disaster Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

