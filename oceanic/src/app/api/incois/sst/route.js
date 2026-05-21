import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const sst = await db.collection("sst").find({}).toArray();

    return NextResponse.json(sst);
  } catch (error) {
    console.error("SST Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch SST data" }, { status: 500 });
  }
}
