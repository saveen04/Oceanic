import { NextResponse } from "next/server";

// Known INCOIS OMNI Moored Buoy Network locations
// Source: https://incois.gov.in/site/datainfo/OON.jsp
const INCOIS_BUOY_FALLBACK = [
  { id: "AD06", lat: 15.00, lon: 67.00, description: "Arabian Sea - North West Buoy" },
  { id: "AD07", lat: 8.00,  lon: 67.00, description: "Arabian Sea - South West Buoy" },
  { id: "AD08", lat: 11.00, lon: 62.00, description: "Arabian Sea - Far West Buoy" },
  { id: "BD08", lat: 15.00, lon: 90.00, description: "Bay of Bengal - Northern Buoy" },
  { id: "BD09", lat: 12.00, lon: 90.00, description: "Bay of Bengal - Central Buoy" },
  { id: "BD11", lat:  8.00, lon: 90.00, description: "Bay of Bengal - Southern Buoy" },
  { id: "BD14", lat: 18.00, lon: 89.00, description: "Bay of Bengal - North East Buoy" },
  { id: "IO01", lat:  0.00, lon: 80.00, description: "Indian Ocean - Equatorial Buoy (Lakshadweep Sea)" },
  { id: "IO02", lat: -5.00, lon: 80.00, description: "Indian Ocean - South Equatorial Buoy" },
  { id: "IO03", lat:  5.00, lon: 80.00, description: "Indian Ocean - North Central Buoy" },
  { id: "IO04", lat:  2.00, lon: 73.00, description: "Lakshadweep Sea - OMNI Station" },
];

export async function GET() {
  // Try to fetch the INCOIS OON page to extract live buoy table data
  try {
    const response = await fetch("https://incois.gov.in/site/datainfo/OON.jsp", {
      signal: AbortSignal.timeout(5000), // 5 second timeout
      headers: { "User-Agent": "Mozilla/5.0 OceanicViz/1.0" }
    });

    if (response.ok) {
      const html = await response.text();

      // Attempt to extract buoy coordinates from the HTML table rows
      // Pattern: look for lat/lon like "15.00°N" / "67.00°E" or decimal degrees in table cells
      const parsedBuoys = [];
      const tableRowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;

      let rowMatch;
      while ((rowMatch = tableRowPattern.exec(html)) !== null) {
        const rowContent = rowMatch[1];
        const cells = [];
        let tdMatch;
        while ((tdMatch = tdPattern.exec(rowContent)) !== null) {
          const text = tdMatch[1].replace(/<[^>]+>/g, "").trim();
          cells.push(text);
        }

        // Look for a row with id-like name and coordinates
        if (cells.length >= 3) {
          const idLike = cells[0];
          // Try to find lat/lon from adjacent cells using decimal or degree notation
          const latRaw = cells.find(c => /\d+\.?\d*\s*[°˚]\s*[NS]/i.test(c) || /^\s*-?\d{1,2}\.\d+\s*$/.test(c));
          const lonRaw = cells.find(c => /\d+\.?\d*\s*[°˚]\s*[EW]/i.test(c) || /^\s*[6-9]\d\.\d+\s*$/.test(c));

          if (latRaw && lonRaw && idLike && /[A-Z]{2}\d+/.test(idLike)) {
            const lat = parseFloat(latRaw.replace(/[°˚NSEWnsew\s]/g, ""));
            const lon = parseFloat(lonRaw.replace(/[°˚NSEWnsew\s]/g, ""));
            if (!isNaN(lat) && !isNaN(lon) && lat > -40 && lat < 40 && lon > 50 && lon < 120) {
              parsedBuoys.push({
                id: idLike,
                lat,
                lon,
                description: cells[1] || "INCOIS Moored Buoy"
              });
            }
          }
        }
      }

      if (parsedBuoys.length >= 3) {
        return NextResponse.json({
          success: true,
          data: parsedBuoys,
          source: "INCOIS OON (Live Parse)"
        });
      }
    }
  } catch {
    // Timeout or network error — fall through to fallback
  }

  // Return known fallback buoy network
  return NextResponse.json({
    success: true,
    data: INCOIS_BUOY_FALLBACK,
    source: "INCOIS OMNI Network (Fallback – Static Coordinates)"
  });
}
