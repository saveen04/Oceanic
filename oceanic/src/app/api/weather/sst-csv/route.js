import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseSstCsv } from "@/lib/sstCsvParser";

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "datasets", "open-meteo-sst.csv");
    const csvText = fs.readFileSync(csvPath, "utf-8");
    const parsed = parseSstCsv(csvText);

    return NextResponse.json({
      success: true,
      ...parsed
    });
  } catch (error) {
    console.error("SST CSV API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
