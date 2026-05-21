import { NextResponse } from "next/server";

export async function GET() {
  try {
    // High-density OSCAT-style wind vectors for cyclone modeling
    // This API provides a focused vortex field for the Bay of Bengal/Arabian Sea
    
    const grid = [];
    const centerX = 85; 
    const centerY = 12;

    for (let lat = 0; lat <= 25; lat += 1) {
      for (let lon = 60; lon <= 100; lon += 1) {
        const dx = lon - centerX;
        const dy = lat - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Vortex pattern: Speed increases towards eyes, then drops
        // Spiral inflow: Angle = Rotation + Inward Pull
        const angle = Math.atan2(dy, dx) + (Math.PI / 2) + 0.3; // 0.3 for inflow
        const strength = 15 * (dist / 10) * Math.exp(-dist / 10); // Dynamic profile
        
        grid.push({
          lat,
          lon,
          u: Math.cos(angle) * strength,
          v: Math.sin(angle) * strength
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: grid, 
      source: "INCOIS-OSCAT-CYCLONE",
      center: { lat: centerY, lon: centerX }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
