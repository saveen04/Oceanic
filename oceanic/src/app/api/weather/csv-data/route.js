import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseOpenMeteoCsv } from "@/lib/openMeteoCsv";

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "datasets", "open-meteo-52.52N13.42E38m (1).csv");
    const csvText = fs.readFileSync(csvPath, "utf-8");
    const parsed = parseOpenMeteoCsv(csvText);

    return NextResponse.json({
      success: true,
      ...parsed
    });
  } catch (error) {
    console.error("CSV API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
