"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Filter, Search } from "lucide-react";

import { fetcher } from "@/lib/fetcher";

const TYPES = [
  "",
  "tsunami",
  "cyclone",
  "high_waves",
  "tide",
  "storm_surge",
  "coastal_flooding",
];
const SEVERITIES = ["", "low", "moderate", "high", "critical"];

export default function HistoryPage() {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [q, setQ] = useState("");

  const key = useMemo(() => {
    const sp = new URLSearchParams();
    if (type) sp.set("type", type);
    if (severity) sp.set("severity", severity);
    if (q.trim()) sp.set("q", q.trim());
    sp.set("limit", "200");
    return `/api/history?${sp.toString()}`;
  }, [type, severity, q]);

  const { data, error, isLoading } = useSWR(key, fetcher);
  const items = data?.items ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Detection history</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Stored detections with filters for review and auditing.
      </p>

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
            <Filter size={16} />
            Filters
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
            >
              {TYPES.map((t) => (
                <option key={t || "all"} value={t}>
                  {t ? labelType(t) : "All types"}
                </option>
              ))}
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950"
            >
              {SEVERITIES.map((s) => (
                <option key={s || "all"} value={s}>
                  {s || "All severities"}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search location…"
                className="w-full rounded-2xl border border-black/10 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-950"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Wave</th>
                <th className="px-4 py-3">Tide</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <RowMessage msg="Loading…" />
              ) : error ? (
                <RowMessage msg={error.message || "Failed to load"} />
              ) : items.length === 0 ? (
                <RowMessage msg="No records." />
              ) : (
                items.map((d) => (
                  <tr key={d._id} className="border-t border-black/5 dark:border-white/10">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {labelType(d.type)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{d.location}</td>
                    <td className="px-4 py-3">
                      <SeverityBadge value={d.severity} />
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">
                      {typeof d.waveHeight === "number" ? `${d.waveHeight} m` : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">
                      {typeof d.tideLevel === "number" ? d.tideLevel : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {d.createdAt ? new Date(d.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function RowMessage({ msg }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-300">
        {msg}
      </td>
    </tr>
  );
}

function SeverityBadge({ value }) {
  const v = value || "low";
  const cls =
    v === "critical"
      ? "bg-red-600 text-white"
      : v === "high"
        ? "bg-amber-500 text-zinc-950"
        : v === "moderate"
          ? "bg-blue-600 text-white"
          : "bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-zinc-100";
  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{v}</span>;
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

