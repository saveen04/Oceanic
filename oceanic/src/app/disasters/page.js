"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

import { fetcher } from "@/lib/fetcher";

const TYPES = [
  "tsunami",
  "cyclone",
  "high_waves",
  "tide",
  "storm_surge",
  "coastal_flooding",
];

const SEVERITIES = ["low", "moderate", "high", "critical"];

export default function DisastersPage() {
  const { data, mutate } = useSWR("/api/disasters?limit=50", fetcher);
  const items = data?.items ?? [];

  const [type, setType] = useState("high_waves");
  const [location, setLocation] = useState("Chennai");
  const [latitude, setLatitude] = useState(13.0827);
  const [longitude, setLongitude] = useState(80.2707);
  const [severity, setSeverity] = useState("moderate");
  const [waveHeight, setWaveHeight] = useState(2.2);
  const [tideLevel, setTideLevel] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createDisaster(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/disasters", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          location,
          latitude: Number(latitude),
          longitude: Number(longitude),
          severity,
          waveHeight:
            waveHeight === "" || waveHeight === null
              ? null
              : Number(waveHeight),
          tideLevel:
            tideLevel === "" || tideLevel === null ? null : Number(tideLevel),
          windSpeed:
            windSpeed === "" || windSpeed === null ? null : Number(windSpeed),
          source: "manual",
        }),
      });

      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error || "Failed to create");

      toast.success("Detection saved");
      await mutate();
    } catch (err) {
      toast.error(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Disasters
      </h1>

      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Create a detection manually (useful for demos) and view recent records.
      </p>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <PlusCircle
              size={18}
              className="text-blue-700 dark:text-blue-300"
            />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              New detection
            </h2>
          </div>

          <form onSubmit={createDisaster} className="mt-4 grid gap-3">
            <Row label="Type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {labelType(t)}
                  </option>
                ))}
              </select>
            </Row>

            <Row label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                required
              />
            </Row>

            <div className="grid gap-3 sm:grid-cols-2">
              <Row label="Latitude">
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                  required
                />
              </Row>

              <Row label="Longitude">
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                  required
                />
              </Row>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <Row label="Severity">
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Row>

              <Row label="Wave (m)">
                <input
                  value={waveHeight ?? ""}
                  onChange={(e) => setWaveHeight(e.target.value)}
                  type="number"
                  step="0.1"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </Row>

              <Row label="Tide">
                <input
                  value={tideLevel ?? ""}
                  onChange={(e) => setTideLevel(e.target.value)}
                  type="number"
                  step="0.1"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </Row>

              <Row label="Wind (km/h)">
                <input
                  value={windSpeed ?? ""}
                  onChange={(e) => setWindSpeed(e.target.value)}
                  type="number"
                  step="0.1"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
                />
              </Row>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save detection"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Recent detections
          </h2>

          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                No detections yet.
              </div>
            ) : (
              items.map((d) => (
                <div
                  key={d._id}
                  className={`rounded-2xl border px-4 py-3 text-white ${windColor(
                    d.windSpeed
                  )}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">
                      {labelType(d.type)} • {d.location}
                    </div>

                    <span className="text-xs">
                      {d.createdAt
                        ? new Date(d.createdAt).toLocaleString()
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    Severity: <span className="font-semibold">{d.severity}</span>
                    {typeof d.waveHeight === "number"
                      ? ` • Wave: ${d.waveHeight} m`
                      : ""}
                    {typeof d.tideLevel === "number"
                      ? ` • Tide: ${d.tideLevel}`
                      : ""}
                    {typeof d.windSpeed === "number"
                      ? ` • Wind: ${d.windSpeed} km/h`
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Row({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </div>
      {children}
    </label>
  );
}

function labelType(t) {
  const map = {
    tsunami: "Tsunami",
    cyclone: "Cyclone",
    high_waves: "High waves",
    tide: "Tide",
    storm_surge: "Storm surge",
    coastal_flooding: "Coastal flooding",
  };
  return map[t] || t || "—";
}

function windColor(speed) {
  if (!speed) return "bg-gray-400";
  if (speed < 10) return "bg-green-500";
  if (speed < 25) return "bg-yellow-500";
  if (speed < 40) return "bg-orange-500";
  return "bg-red-600 animate-pulse";
}