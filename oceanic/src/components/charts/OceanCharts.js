"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function OceanCharts({ series }) {
  const data = (series || []).map((d) => ({
    time: d.time?.slice?.(11, 16) ?? d.time,
    wind: toNum(d.wind_speed_10m),
    temp: toNum(d.temperature_2m),
    hum: toNum(d.relative_humidity_2m),
  }));

  return (
    <div className="pointer-events-auto h-full w-[360px] min-w-0 border-l border-black/10 bg-white/85 p-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <div className="text-sm font-semibold text-zinc-900 dark:text-white">Analytics</div>
      <div className="mt-3 space-y-4">
        <Chart title="Wind speed (m/s)" data={data} dataKey="wind" color="#f59e0b" />
        <Chart title="Temperature (°C)" data={data} dataKey="temp" color="#ef4444" />
        <Chart title="Humidity (%)" data={data} dataKey="hum" color="#3b82f6" />
      </div>
    </div>
  );
}

function Chart({ title, data, dataKey, color }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{title}</div>
      <div className="mt-2 w-full">
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function toNum(v) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

