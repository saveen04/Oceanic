"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { CloudRain, CloudSun, Droplets, Wind, Waves } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { OceanCharts } from "@/components/charts/OceanCharts";

const WeatherLocationMap = dynamic(
  () => import("@/components/WeatherLocationMap").then((m) => m.WeatherLocationMap),
  { ssr: false }
);

export default function WeatherPage() {
  const [q, setQ] = useState("Chennai");
  const [submitted, setSubmitted] = useState("Chennai");

  const key = useMemo(() => `/api/weather?q=${encodeURIComponent(submitted)}`, [submitted]);
  const { data, error, isLoading } = useSWR(key, fetcher);
  const { data: ocean } = useSWR("/api/incois/summary", fetcher);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(q.trim());
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Weather monitoring
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Search a place to view conditions, storm hint, and a map pin.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter a place (e.g., Visakhapatnam)"
          className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
        />

        <button
          type="submit"
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">

        {/* LEFT PANEL */}

        <div className="order-2 space-y-4 lg:order-1 lg:col-span-1">

          <Card title="Current conditions" icon={<CloudSun size={18} />}>
            {isLoading ? (
              <SkeletonLines />
            ) : error ? (
              <div className="text-sm text-red-700">{error.message}</div>
            ) : (
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">

                <div className="text-base font-semibold text-zinc-900 dark:text-white">
                  {data?.location || submitted}
                </div>

                {data?.note && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    {data.note}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Metric icon={<CloudRain size={16} />} label="Rain prob." value={fmtPct(data?.rainProbability)} />
                  <Metric icon={<Droplets size={16} />} label="Humidity" value={fmt(data?.humidity, "%")} />
                  <Metric icon={<Wind size={16} />} label="Wind" value={fmt(data?.wind, "m/s")} />
                  <Metric icon={<CloudSun size={16} />} label="Temp" value={fmt(data?.temperature, "°C")} />
                </div>

              </div>
            )}
          </Card>


          {/* ANALYTICS (from Map) */}

          <Card title="Analytics" icon={<Waves size={18} />}>
            {isLoading ? (
              <SkeletonLines />
            ) : data?.raw?.forecast?.list ? (
              <div className="h-[300px] -mx-4 -mb-4 overflow-hidden">
                <OceanCharts 
                  series={data.raw.forecast.list.slice(0, 48).map(f => ({
                    time: f.dt_txt,
                    wind_speed_10m: f.wind?.speed,
                    temperature_2m: f.main?.temp,
                    relative_humidity_2m: f.main?.humidity
                  }))} 
                />
              </div>
            ) : (
              <div className="text-sm text-zinc-500">No chart data available.</div>
            )}
          </Card>

          <Card title="More details" icon={<Droplets size={18} />}>
            {isLoading ? (
              <SkeletonLines />
            ) : error ? (
              <div className="text-sm text-red-700">Unavailable</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Metric icon={<CloudSun size={16} />} label="Feels like" value={fmt(data?.feelsLike, "°C")} />
                <Metric icon={<Wind size={16} />} label="Pressure" value={fmt(data?.pressure, "hPa")} />
                <Metric icon={<CloudRain size={16} />} label="Visibility" value={data?.visibility ? fmt(data.visibility / 1000, "km") : "—"} />
              </div>
            )}
          </Card>

        </div>


        {/* MAP PANEL */}

        <div className="order-1 lg:order-2 lg:col-span-2 space-y-4">

          <Card title="Map" icon={<CloudSun size={18} />}>

            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">

              {isLoading ? (
                <div className="h-full w-full animate-pulse bg-zinc-200/60 dark:bg-white/10" />
              ) : error ? (
                <div className="flex h-full items-center justify-center text-sm">
                  Map unavailable
                </div>
              ) : (
                <WeatherLocationMap
                  key={`${data?.lat}-${data?.lon}`}
                  lat={Number(data?.lat)}
                  lon={Number(data?.lon)}
                  label={data?.location || submitted}
                />
              )}

            </div>

          </Card>

          {/* 5-DAY FORECAST */}

          <Card title="5-Day Forecast" icon={<CloudSun size={18} />}>
            {isLoading ? (
              <SkeletonLines />
            ) : data?.raw?.forecast?.list ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {formatForecast(data.raw.forecast.list).map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-zinc-50/50 p-3 text-center dark:border-white/10 dark:bg-zinc-900/50">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{day.date}</div>
                    <div className="my-2">{getWeatherIcon(day.icon)}</div>
                    <div className="text-sm font-semibold">{Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°</div>
                    <div className="mt-1 text-xs text-zinc-500 capitalize">{day.desc}</div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-sm text-zinc-500">No forecast data available.</div>
            )}
          </Card>

        </div>

      </section>

    </main>
  );
}


/* COMPONENTS */

function Card({ title, icon, children }) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700">
          {icon}
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function SkeletonLines() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-40 animate-pulse rounded bg-zinc-200/70" />
      <div className="h-4 w-full animate-pulse rounded bg-zinc-200/70" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200/70" />
    </div>
  );
}


/* HELPERS */

function fmt(n, unit) {
  if (n === null || n === undefined) return "—";
  const v = typeof n === "number" ? (Math.round(n * 10) / 10).toString() : String(n);
  return unit ? `${v} ${unit}` : v;
}

function fmtPct(n) {
  if (n === null || n === undefined) return "—";
  return `${Math.round(Number(n) * 100)}%`;
}

function formatForecast(list) {
  if (!Array.isArray(list)) return [];
  const days = {};
  
  // Group by day (YYYY-MM-DD)
  list.forEach(item => {
    const dateStr = item.dt_txt.split(" ")[0];
    if (!days[dateStr]) {
      days[dateStr] = {
        date: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        icons: [item.weather[0].icon],
        desc: item.weather[0].description
      };
    } else {
      days[dateStr].tempMin = Math.min(days[dateStr].tempMin, item.main.temp_min);
      days[dateStr].tempMax = Math.max(days[dateStr].tempMax, item.main.temp_max);
      days[dateStr].icons.push(item.weather[0].icon);
    }
  });

  // Pick mostly represented icon per day and return next 5
  return Object.values(days).slice(0, 5).map(day => {
    // simple majority element logic for icon could go here, but taking the first (usually midday or morning) works for now
    return { ...day, icon: day.icons[Math.floor(day.icons.length / 2)] };
  });
}

function getWeatherIcon(iconCode) {
  if (!iconCode) return <CloudSun size={24} className="text-zinc-400" />;
  const c = iconCode.substring(0, 2);
  
  // map OpenWeather icons roughly to lucide
  switch (c) {
    case "01": return <CloudSun size={24} className="text-amber-500" />; // clear sky (using cloud sun as generic)
    case "02": return <CloudSun size={24} className="text-zinc-500" />; // few clouds
    case "03":
    case "04": return <CloudSun size={24} className="text-zinc-500 opacity-80" />; // scattered/broken clouds
    case "09":
    case "10": return <CloudRain size={24} className="text-blue-500" />; // rain
    case "11": return <CloudRain size={24} className="text-purple-500" />; // thunderstorm (using rain roughly)
    case "13": return <CloudRain size={24} className="text-cyan-400" />; // snow
    case "50": return <Wind size={24} className="text-zinc-400" />; // mist
    default: return <CloudSun size={24} className="text-zinc-400" />;
  }
}