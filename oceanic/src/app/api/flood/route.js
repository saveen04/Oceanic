import { NextResponse } from "next/server";

const COASTAL_CITIES = [
  { name: "Mumbai", lat: 18.96, lon: 72.82 },
  { name: "Chennai", lat: 13.08, lon: 80.27 },
  { name: "Kochi", lat: 9.93, lon: 76.26 },
  { name: "Visakhapatnam", lat: 17.68, lon: 83.21 },
  { name: "Kolkata", lat: 22.57, lon: 88.36 },
  { name: "Surat", lat: 21.17, lon: 72.83 },
  { name: "Panaji", lat: 15.49, lon: 73.82 },
];

export async function GET() {
  try {
    const floodData = await Promise.all(
      COASTAL_CITIES.map(async (city) => {
        const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${city.lat}&longitude=${city.lon}&daily=river_discharge,river_discharge_mean&models=seamless_v4&forecast_days=7`;
        const res = await fetch(url);
        const data = await res.json();
        
        // Simple logic: if river discharge is significantly above mean, it's a flood risk
        const latestDischarge = data.daily?.river_discharge?.[0] || 0;
        const meanDischarge = data.daily?.river_discharge_mean?.[0] || 1;
        const riskLevel = latestDischarge > meanDischarge * 1.5 ? "high" : (latestDischarge > meanDischarge * 1.2 ? "moderate" : "low");
        
        return {
          ...city,
          discharge: latestDischarge,
          mean: meanDischarge,
          risk: riskLevel,
          timestamp: new Date().toISOString()
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: floodData,
      source: "Open-Meteo Flood API"
    });
  } catch (error) {
    console.error("Flood API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
