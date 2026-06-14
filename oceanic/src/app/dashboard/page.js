"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  ShieldAlert, 
  Wind, 
  Waves, 
  Activity, 
  Map as MapIcon, 
  ArrowUpRight,
  Clock,
  ExternalLink,
  Satellite
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const mockPerformanceData = [
  { time: "00:00", waves: 2.1, wind: 15 },
  { time: "04:00", waves: 2.3, wind: 18 },
  { time: "08:00", waves: 2.8, wind: 25 },
  { time: "12:00", waves: 3.5, wind: 42 },
  { time: "16:00", waves: 3.2, wind: 35 },
  { time: "20:00", waves: 2.9, wind: 22 },
];

export default function DashboardPage() {
  const { data, error } = useSWR("/api/incois/summary", fetcher, {
    refreshInterval: 30000 // Refresh every 30s
  });

  const waves = data?.waves || [];
  const alerts = data?.alerts || [];
  
  const avgWaveHeight = waves.length 
    ? (waves.reduce((acc, w) => acc + (w.waveHeight || 0), 0) / waves.length).toFixed(1)
    : "1.8";

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ocean Monitoring Overview</h1>
            <p className="text-slate-400 font-medium">Real-time global ocean conditions and active disaster intelligence.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-sm font-bold text-slate-300">
              <Clock className="w-4 h-4 text-ocean-400" />
              Last Update: {data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : "Syncing..."}
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 ${error ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} rounded-xl text-xs font-bold`}>
              <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
              {error ? "Telemetry Link Interrupted" : data?.source === "firestore_live" ? "Live Satellite Feed Active" : "Operational (Fallback Mode)"}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Ocean Alerts" 
            value={alerts.length.toString()} 
            unit="Alerts" 
            icon={ShieldAlert} 
            color="rose" 
            trend={alerts.length > 0 ? 100 : 0}
            delay={0.1}
          />
          <StatCard 
            title="Nodes Tracking" 
            value={waves.length.toString()} 
            unit="Sectors" 
            icon={Wind} 
            color="ocean" 
            trend={5}
            delay={0.2}
          />
          <StatCard 
            title="Avg Wave Height" 
            value={avgWaveHeight} 
            unit="Meters" 
            icon={Waves} 
            color="indigo" 
            trend={2}
            delay={0.3}
          />
          <StatCard 
            title="Sync Quality" 
            value={data ? "99.4" : "0"} 
            unit="Percent" 
            icon={Satellite} 
            color="amber" 
            delay={0.4}
          />
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass-dark p-6 rounded-3xl border border-white/5"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Ocean Conditions Trend</h3>
                <p className="text-xs text-slate-500 font-medium">Wave height and wind speed across monitored zones</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-ocean-500" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Waves</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Wind</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="colorWaves" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#ffffff10',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="waves" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorWaves)" />
                  <Area type="monotone" dataKey="wind" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWind)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Actions / Activity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-dark p-6 rounded-3xl border border-white/5 flex flex-col"
          >
            <h3 className="text-lg font-bold text-white mb-6">Active Intelligence Map</h3>
            <div className="flex-grow w-full bg-slate-900 rounded-2xl relative overflow-hidden mb-6 group cursor-pointer border border-white/5">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link href="/map">
                  <div className="p-3 bg-ocean-600 rounded-full shadow-2xl shadow-ocean-600/50 group-hover:scale-125 transition-all">
                    <MapIcon className="w-6 h-6 text-white" />
                  </div>
                </Link>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ocean-400">Live GIS Feed</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Events</h4>
              {[
                { type: "Cyclone", name: "Amphan", location: "Bay of Bengal", time: "1h ago", color: "ocean" },
                { type: "Tsunami", name: "Level 1 Watch", location: "Java Sea", time: "3h ago", color: "rose" },
                { type: "Tide", name: "High Surge", location: "Florida Coast", time: "5h ago", color: "amber" },
              ].map((event, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 bg-${event.color}-500/50 rounded-full group-hover:bg-${event.color}-500 transition-colors`} />
                    <div>
                      <p className="text-sm font-bold text-white">{event.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{event.location} • {event.time}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
