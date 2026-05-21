import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/apiAuth";
import { loadOceanCsv } from "@/lib/datasetCsv";
import { connectToDatabase } from "@/lib/mongodb";
import { Disaster } from "@/models/Disaster";

async function syncAlerts(alerts) {
  if (!alerts || !alerts.length) return;
  try {
    await connectToDatabase();
    for (const alert of alerts) {
      // Find if alert exists (check type, location and approx time)
      const exists = await Disaster.findOne({
        type: alert.type,
        location: alert.location,
        createdAt: { $gte: new Date(Date.now() - 3600000) } // Within last hour
      });
      
      if (!exists) {
        await Disaster.create({
          type: alert.type,
          location: alert.location,
          latitude: alert.latitude || 0,
          longitude: alert.longitude || 0,
          severity: alert.severity || "low",
          waveHeight: alert.waveHeight || null,
          source: "incois_sync",
          meta: alert.meta || {}
        });
      }
    }
  } catch (e) {
    console.error("Failed to sync alerts to MongoDB:", e);
  }
}

function mock() {
  return {
    note: "INCOIS credentials not configured; returning mock ocean conditions.",
    updatedAt: new Date().toISOString(),
    waves: [
      { location: "Visakhapatnam", latitude: 17.6868, longitude: 83.2185, waveHeight: 2.4 },
      { location: "Chennai", latitude: 13.0827, longitude: 80.2707, waveHeight: 1.8 },
      { location: "Kochi", latitude: 9.9312, longitude: 76.2673, waveHeight: 2.9 },
    ],
    tides: [{ location: "Chennai", tideLevel: 1.1 }],
    alerts: [
      { type: "high_waves", location: "Kochi", severity: "high", waveHeight: 2.9 },
      { type: "cyclone", location: "Bay of Bengal (Simulated)", latitude: 15.0, longitude: 85.0, severity: "critical", waveHeight: 6.5 }
    ],
  };
}

export async function GET(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  let finalData = {
    source: "hybrid",
    updatedAt: new Date().toISOString(),
    waves: [],
    alerts: [],
    sst: []
  };

  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    // 1. Fetch Real-time Signals from MongoDB (populated by Python backend)
    const mongoWaves = await db.collection("waves").find({}).toArray();
    const mongoSst = await db.collection("sst").find({}).toArray();
    const mongoDisasters = await db.collection("disasters").find({
      createdAt: { $gte: (Date.now() / 1000) - 86400 } // Last 24 hours
    }).toArray();

    finalData.waves = mongoWaves.map(w => ({
      location: w.location,
      waveHeight: w.waveHeight,
      timestamp: w.timestamp
    }));

    finalData.sst = mongoSst.map(s => ({
      location: s.location,
      temp: s.temp,
      lat: s.lat,
      lng: s.lng
    }));

    finalData.alerts = mongoDisasters.map(d => ({
      type: d.type,
      location: d.location,
      severity: d.severity,
      timestamp: d.createdAt
    }));

    // 2. Fallback to mock/CSV if MongoDB is empty
    if (finalData.waves.length === 0) {
      const mockData = mock();
      finalData.waves = mockData.waves;
      finalData.alerts = [...finalData.alerts, ...mockData.alerts];
    }

  } catch (e) {
    console.error("MongoDB Fetch Error in Summary:", e);
    finalData = mock();
  }

  return NextResponse.json(finalData);
}

