"use client";

import useSWR from "swr";
import { AlertTriangle, Waves, Wind, Radar, Activity, CheckCircle2, Zap, Clock, ShieldCheck, ArrowUpRight, Plus } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { fetcher } from "@/lib/fetcher";
import SatelliteMap from "@/components/SatelliteMap";

export default function DashboardPage() {
  const { data: incois } = useSWR("/api/incois/summary", fetcher);
  const { data: disasters } = useSWR("/api/disasters?limit=10", fetcher);

  const alerts = incois?.alerts ?? [];
  const wavePoints = (incois?.waves ?? []).slice(0, 10).map((w, idx) => ({
    name: w.location?.split(',')[0] || `B${idx + 1}`,
    wave: w.waveHeight ?? 0,
    intensity: (w.waveHeight ?? 0) * 1.5
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-1">
            <Activity size={12} />
            Live Intelligence
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Command Center</h1>
          <p className="mt-1 text-sm font-bold text-zinc-800 dark:text-zinc-400">
            Real-time synchronization with INCOIS buoy network and satellite arrays.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Systems Active</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Intelligence & Map */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Satellite Map Widget */}
          <section className="h-[450px] w-full">
            <SatelliteMap />
          </section>

          {/* Waves Trend Chart */}
          <section className="jira-card">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                  <Waves size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-black dark:text-white">Live Wave Magnitude</h2>
                  <p className="text-xs font-bold text-zinc-600">Buoy network live stream (meters)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Source</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">INCOIS Real-Time</p>
              </div>
            </div>

            <div className="h-64 w-full">
              {wavePoints.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500 italic">Establishing buoy link...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wavePoints}>
                    <defs>
                      <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: "#000" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: "#000" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#000", border: "none", borderRadius: "16px", color: "#fff", padding: "12px" }}
                      itemStyle={{ color: "#3b82f6", fontWeight: "900", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="wave" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorWave)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Alerts & Logs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Alerts List */}
          <section className="jira-card">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Regional Threats</h2>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <p className="text-sm font-black text-black dark:text-white">Coastline Secure</p>
                <p className="text-xs font-bold text-zinc-500">No active tsunami or cyclone signals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-500/30 dark:bg-red-950/30"
                  >
                    <AlertTriangle size={18} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-red-950 dark:text-red-200 uppercase tracking-tight">
                        {labelType(a.type)} Alert
                      </p>
                      <p className="text-[10px] font-bold text-red-800/80 dark:text-red-400/80">{a.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Detection Logs */}
          <section className="jira-card !p-0 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Activity Logs</h2>
            </div>
            <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {(disasters?.items ?? []).slice(0, 8).map((d) => (
                <div key={d._id} className="p-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      {labelType(d.type)}
                    </span>
                    <SeverityBadge value={d.severity} />
                  </div>
                  <p className="text-xs font-black text-black dark:text-white">{d.location}</p>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-tighter">
                    {d.createdAt ? new Date(d.createdAt).toLocaleTimeString() : "Syncing..."}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-white/5 text-center">
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black">
                Archive Logs
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function HealthItem({ icon, label, status }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-400">{label}</span>
      </div>
      <span className="text-xs font-black text-black dark:text-zinc-100">{status}</span>
    </div>
  );
}

function SeverityBadge({ value }) {
  const v = value || "low";
  const cls =
    v === "critical"
      ? "bg-red-500/10 text-red-600 border-red-500/20"
      : v === "high"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
        : "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return <span className={`inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>{v}</span>;
}

function labelType(t) {
  const map = {
    tsunami: "Tsunami",
    cyclone: "Cyclone",
    high_waves: "High Waves",
    tide: "Tide Tracker",
    storm_surge: "Storm Surge",
    coastal_flooding: "Flood Watch",
  };
  return map[t] || t || "General Signal";
}

