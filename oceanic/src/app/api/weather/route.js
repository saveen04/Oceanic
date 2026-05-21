import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/apiAuth";

const QuerySchema = z.object({
  q: z.string().min(2).max(120),
});

export async function GET(request) {
  // temporarily bypass auth
  // const { errorResponse } = requireAuth(request);
  // if (errorResponse) return errorResponse;

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const parsed = QuerySchema.safeParse({ q });
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide ?q=PlaceName" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        location: parsed.data.q,
        note: "OPENWEATHER_API_KEY not set; returning mock weather.",
        temperature: 29,
        wind: 6.2,
        humidity: 72,
        rainProbability: 0.15,
        stormAlert: false,
      },
      { status: 200 }
    );
  }

  const geoRes = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      parsed.data.q
    )}&limit=1&appid=${apiKey}`,
    { next: { revalidate: 60 } }
  );
  const geo = await geoRes.json();
  if (!geoRes.ok || !Array.isArray(geo) || geo.length === 0) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const { lat, lon, name, country, state } = geo[0];

  const wxRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
    { next: { revalidate: 60 } }
  );
  const wx = await wxRes.json();
  if (!wxRes.ok) {
    return NextResponse.json({ error: "Weather fetch failed", details: wx }, { status: 502 });
  }

  const fcRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
    { next: { revalidate: 60 } }
  );
  const fc = await fcRes.json();

  const temperature = wx?.main?.temp ?? null;
  const feelsLike = wx?.main?.feels_like ?? null;
  const wind = wx?.wind?.speed ?? null;
  const humidity = wx?.main?.humidity ?? null;
  const pressure = wx?.main?.pressure ?? null;
  const visibility = wx?.visibility ?? null;
  const rainProbability = fc?.list?.[0]?.pop ?? null;

  // Simple heuristic: very high wind + precipitation probability
  const stormAlert = Boolean((wind ?? 0) >= 18 && (rainProbability ?? 0) >= 0.5);

  return NextResponse.json({
    location: [name, state, country].filter(Boolean).join(", "),
    lat,
    lon,
    temperature,
    feelsLike,
    wind,
    humidity,
    pressure,
    visibility,
    rainProbability,
    stormAlert,
    raw: { current: wx, forecast: fc },
  });
}

