import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/apiAuth";

const SingleSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

const BulkSchema = z.object({
  points: z
    .array(
      z.object({
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
        id: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .min(1)
    .max(25),
});

function buildUrl(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("models", "gfs_seamless");
  url.searchParams.set("timezone", "UTC");

  // Mirrors the variables from the Python example (trimmed to what we use).
  url.searchParams.set("current", ["temperature_2m", "wind_speed_10m", "wind_direction_10m", "pressure_msl"].join(","));
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "surface_temperature",
      "precipitation",
      "weather_code",
      "pressure_msl",
      "visibility",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(",")
  );
  url.searchParams.set(
    "daily",
    ["uv_index_max", "sunrise", "weather_code", "precipitation_sum"].join(",")
  );

  return url.toString();
}

async function fetchOpenMeteo(lat, lon) {
  const res = await fetch(buildUrl(lat, lon), { next: { revalidate: 300 } });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    return { ok: false, status: res.status, error: "Open-Meteo fetch failed", details: data };
  }

  return {
    ok: true,
    latitude: data.latitude,
    longitude: data.longitude,
    elevation: data.elevation,
    utc_offset_seconds: data.utc_offset_seconds,
    timezone: data.timezone,
    current: data.current,
    hourly: data.hourly,
    daily: data.daily,
  };
}

export async function GET(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  const url = new URL(request.url);
  const parsed = SingleSchema.safeParse({
    lat: url.searchParams.get("lat"),
    lon: url.searchParams.get("lon"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide ?lat=..&lon=.." }, { status: 400 });
  }

  const out = await fetchOpenMeteo(parsed.data.lat, parsed.data.lon);
  if (!out.ok) return NextResponse.json(out, { status: 502 });
  return NextResponse.json(out);
}

export async function POST(request) {
  const { errorResponse } = requireAuth(request);
  if (errorResponse) return errorResponse;

  const body = await request.json().catch(() => null);
  const parsed = BulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const results = [];
  for (const p of parsed.data.points) {
    const out = await fetchOpenMeteo(p.lat, p.lon);
    results.push({
      id: p.id || `${p.lat},${p.lon}`,
      label: p.label || null,
      lat: p.lat,
      lon: p.lon,
      ...out,
    });
  }

  return NextResponse.json({ results });
}

