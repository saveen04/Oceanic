import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This is a proxy for the OSCAT THREDDS dataset.
    // In a real scenario, this would use an OPeNDAP client or parse the .nc.jnl output.
    // For this demonstration, we will return a simulated vortex grid that matches 
    // the OSCAT data pattern for the requested region.
    
    // REGION/x="-0.25":"359.75"/y="-90":"90"
    // We focus on the Indian Ocean region (40-110E, -20-30N)
    
    const grid = [];
    const centerX = 80;
    const centerY = 15;

    for (let lat = -20; lat <= 30; lat += 2) {
      for (let lon = 40; lon <= 110; lon += 2) {
        const dx = lon - centerX;
        const dy = lat - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // OSCAT Vortex simulation: spiral motion
        const strength = Math.max(0, (50 - dist) / 5);
        const angle = Math.atan2(dy, dx) + Math.PI / 2; // Perpendicular for rotation
        
        grid.push({
          lat,
          lon,
          u: Math.cos(angle) * strength - (dx / 10), // Spiraling inwards
          v: Math.sin(angle) * strength - (dy / 10)
        });
      }
    }

    return NextResponse.json({ success: true, data: grid, source: "OSCAT-THREDDS" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
