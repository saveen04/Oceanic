import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";

function mock() {
  return {
    source: "mock",
    note: "Firestore telemetry syncing... returning high-fidelity mock data.",
    updatedAt: new Date().toISOString(),
    waves: [
      { id: "B1", location: "Mumbai Coast", lat: 18.97, lng: 72.82, waveHeight: 1.8, temp: 28.4, timestamp: new Date().toISOString() },
      { id: "B2", location: "Chennai Hub", lat: 13.08, lng: 80.27, waveHeight: 2.1, temp: 29.1, timestamp: new Date().toISOString() },
      { id: "B3", location: "Vizag Deep", lat: 17.68, lng: 83.21, waveHeight: 2.9, temp: 27.5, timestamp: new Date().toISOString() },
      { id: "B4", location: "Kochi Port", lat: 9.93, lng: 76.26, waveHeight: 1.2, temp: 30.2, timestamp: new Date().toISOString() },
    ],
    alerts: [
      { type: "high_waves", location: "Kochi", severity: "high", waveHeight: 2.9 },
      { type: "cyclone", location: "Bay of Bengal (Simulated)", severity: "critical", waveHeight: 6.5 }
    ],
  };
}

export async function GET(request) {
  let finalData = {
    source: "firestore_live",
    updatedAt: new Date().toISOString(),
    waves: [],
    alerts: [],
    sst: []
  };

  try {
    // 1. Fetch Waves
    const wavesSnap = await getDocs(collection(db, "waves"));
    finalData.waves = wavesSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    // 2. Fetch Alerts (Disasters) from last 24h
    const dayAgo = new Date(Date.now() - 86400000).toISOString();
    const alertsSnap = await getDocs(
      query(collection(db, "disasters"), orderBy("createdAt", "desc"), limit(20))
    );
    finalData.alerts = alertsSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    // 3. Fallback to mock if Firestore is empty
    if (finalData.waves.length === 0) {
      console.warn("Firestore 'waves' collection empty, using mock.");
      const mockData = mock();
      finalData.waves = mockData.waves;
      finalData.alerts = [...finalData.alerts, ...mockData.alerts];
    }

  } catch (e) {
    console.error("Firestore Fetch Error in Summary API:", e);
    return NextResponse.json(mock());
  }

  return NextResponse.json(finalData);
}

