import { NextResponse } from "next/server";

export async function GET() {
  try {
    // We define a grid over the Indian Ocean / South Asia region
    // Min Lat: -15, Max Lat: 30 (Steps of 5)
    // Min Lon: 40, Max Lon: 110 (Steps of 5)
    const lats = [];
    for (let lat = -15; lat <= 30; lat += 5) lats.push(lat);
    const lons = [];
    for (let lon = 40; lon <= 110; lon += 5) lons.push(lon);

    const points = [];
    lats.forEach(lat => {
      lons.forEach(lon => {
        points.push({ lat, lon });
      });
    });

    const latQuery = points.map(p => p.lat).join(",");
    const lonQuery = points.map(p => p.lon).join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latQuery}&longitude=${lonQuery}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !Array.isArray(data)) {
        // Handle single point response vs array
        const results = Array.isArray(data) ? data : [data];
        const gridData = results.map((r, i) => {
          const speed = r.current.wind_speed_10m;
          const dir = r.current.wind_direction_10m;
          // Calculate U/V components
          const angle = (dir - 90) * (Math.PI / 180);
          return {
            lat: points[i].lat,
            lon: points[i].lon,
            u: speed * Math.cos(angle),
            v: -speed * Math.sin(angle)
          };
        });

        return NextResponse.json({ success: true, data: gridData });
    }

    const gridData = data.map((r, i) => {
        const speed = r.current.wind_speed_10m;
        const dir = r.current.wind_direction_10m;
        const angle = (dir - 90) * (Math.PI / 180);
        return {
          lat: points[i].lat,
          lon: points[i].lon,
          u: speed * Math.cos(angle),
          v: -speed * Math.sin(angle)
        };
      });

    return NextResponse.json({ success: true, data: gridData });
  } catch (error) {
    console.error("Wind Grid API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
