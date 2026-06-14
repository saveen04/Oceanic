import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('station');
    
    // 1. Load the combined dataset
    const dataPath = path.join(process.cwd(), 'src/data/telemetry_data.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
    
    const allData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // 2. Extract latest frame for 'real-time' simulation
    // In a real simulation, we would match 'time' to current time.
    // For now, we return the first record of each station as 'live'
    const liveTelemetry = [];
    
    Object.keys(allData).forEach(key => {
      const records = allData[key];
      if (records && records.length > 0) {
        // Pick the top record as 'Live'
        liveTelemetry.push({
          id: key,
          ...records[0]
        });
      }
    });

    return NextResponse.json({ 
      source: "local_dataset",
      count: liveTelemetry.length,
      data: liveTelemetry 
    });
  } catch (error) {
    console.error("Telemetry API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
