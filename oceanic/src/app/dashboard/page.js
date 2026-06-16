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
  Satellite,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const chartData = [
  { time: "00:00", tides: 1.2, swells: 1.8, currents: 0.8 },
  { time: "04:00", tides: 1.4, swells: 2.1, currents: 1.2 },
  { time: "08:00", tides: 1.8, swells: 2.8, currents: 1.5 },
  { time: "12:00", tides: 2.4, swells: 3.5, currents: 2.1 },
  { time: "16:00", tides: 2.1, swells: 3.2, currents: 1.8 },
  { time: "20:00", tides: 1.6, swells: 2.9, currents: 1.2 },
  { time: "24:00", tides: 1.3, swells: 2.4, currents: 0.9 },
];

export default function DashboardPage() {
  const { data, error } = useSWR("/api/incois/summary", fetcher, {
    refreshInterval: 30000 // Refresh every 30s
  });

  const [activeSlide, setActiveSlide] = React.useState(0);

  const slides = [
    { 
      id: "01", 
      title: "Disaster Detection", 
      desc: "Instant hazard telemetry and tsunami warning radius analytics.", 
      image: "/disaster_intelligence_v2.png" 
    },
    { 
      id: "02", 
      title: "Depth Topology Engine", 
      desc: "Advanced bathymetry analysis of the Indian Ocean basin floors.", 
      image: "/depth_topology_v2.png" 
    },
    { 
      id: "03", 
      title: "Oceanic AI GIS Intelligence", 
      desc: "Real-time vector mapping of global maritime currents and monsoonal flow patterns.", 
      image: "/gis_intelligence_node_v2.png" 
    },
    { 
      id: "04", 
      title: "Weather Dynamic Vectors", 
      desc: "Satellite-backed atmospheric modeling and storm surge trajectory.", 
      image: "/weather_forecast_v2.png" 
    }
  ];

  const waves = data?.waves || [];
  const alerts = data?.alerts || [];
  
  const avgWaveHeight = waves.length 
    ? (waves.reduce((acc, w) => acc + (w.waveHeight || 0), 0) / waves.length).toFixed(1)
    : "1.8";

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Brand Integration above main context */}
        <div className="mb-4">
          <Logo />
        </div>
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic leading-none">
              Ocean <span className="text-blue-500">Intelligence</span> Overview
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time global ocean conditions and active disaster intelligence.</p>
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

        {/* 3.1 Refined Top Layout (Carousel + Ocean Monitor) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Carousel (2/3) */}
          <div className="lg:col-span-2 relative h-[380px] w-full rounded-[40px] overflow-hidden group border border-white/5 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={slides[activeSlide].image} 
                  className="w-full h-full object-cover opacity-60"
                  alt={slides[activeSlide].title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1016] via-[#0a1016]/40 to-transparent" />
              </motion.div>
            </AnimatePresence>
  
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <div className="max-w-2xl space-y-4">
                <motion.span 
                  key={`id-${activeSlide}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-7xl font-black text-white/20 italic tracking-tighter block leading-none"
                >
                  {slides[activeSlide].id}
                </motion.span>
                <motion.h2 
                  key={`title-${activeSlide}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-4xl font-operational text-white uppercase italic tracking-tighter leading-none"
                >
                  {slides[activeSlide].title}
                </motion.h2>
                <motion.p 
                  key={`desc-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg text-slate-300 font-bold max-w-xl italic leading-tight"
                >
                  {slides[activeSlide].desc}
                </motion.p>
              </div>
  
              <div className="absolute bottom-12 right-12 flex gap-3">
                {slides.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1 transition-all duration-500 rounded-full ${activeSlide === i ? 'w-10 bg-blue-500' : 'w-3 bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Ocean Monitor (1/3) */}
          <div className="lg:col-span-1 glass-dark p-8 rounded-[40px] border border-white/10 flex flex-col space-y-6 relative overflow-hidden h-[380px]">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity className="w-24 h-24 text-blue-500" />
             </div>
             <div>
               <h3 className="text-xl font-operational text-white uppercase italic tracking-tighter">Tactical Ocean Monitor</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mt-1 italic">Real-time Swells & Tides</p>
             </div>
             
             <div className="flex-grow w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={chartData}>
                   <defs>
                      <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                   <Area type="monotone" dataKey="tides" fill="url(#colorTide)" stroke="none" />
                   <Line type="monotone" dataKey="swells" stroke="#60a5fa" strokeWidth={3} dot={false} />
                   <Bar dataKey="currents" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={4} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                     itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                   />
                 </ComposedChart>
               </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tides</p>
                   <p className="text-lg font-operational text-white">2.4m</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Swells</p>
                   <p className="text-lg font-operational text-blue-400">3.5m</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Speed</p>
                   <p className="text-lg font-operational text-emerald-400">12kt</p>
                </div>
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
            title="Intelligence Sync" 
            value="Operational" 
            unit="Active" 
            icon={Satellite} 
            color="emerald" 
            delay={0.4}
          />
        </div>

        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
          {/* Tactical Alerts Node */}
          <div className="lg:col-span-1 glass-dark p-8 rounded-[32px] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Tactical Alerts</h3>
              <div className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-lg animate-pulse uppercase tracking-widest border border-red-500/20">
                Live Feed
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { type: "Tsunami Advisory", loc: "Java Trench", time: "12m ago", color: "text-red-500" },
                { type: "Storm Surge", loc: "Bay of Bengal", time: "45m ago", color: "text-orange-500" },
                { type: "Vessel Distress", loc: "Arabian Sea", time: "1h ago", color: "text-yellow-500" }
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                  <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${alert.color}`}>{alert.type}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{alert.loc}</p>
                  </div>
                  <span className="text-[9px] text-slate-600 font-black uppercase">{alert.time}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.4em] rounded-[24px] border border-white/5 transition-all text-blue-400">
              Access Alerts Hub
            </button>
          </div>

          {/* Operational GIS Feed Preview */}
          <div className="lg:col-span-2 glass-dark p-10 rounded-[40px] border border-white/5 flex flex-col min-h-[400px]">
            <div className="flex-grow w-full bg-slate-900 rounded-3xl relative overflow-hidden mb-6 group cursor-pointer border border-white/5">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link href="/map">
                  <div className="p-4 bg-blue-600 rounded-full shadow-2xl shadow-blue-600/50 group-hover:scale-125 transition-all">
                    <MapIcon className="w-8 h-8 text-white" />
                  </div>
                </Link>
              </div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Live GIS Intelligence</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mt-1">Satellite Feed // Active</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Integrity</span>
                 </div>
                 <h4 className="text-3xl font-operational text-white uppercase italic leading-none">Nominal</h4>
               </div>
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Sensors</span>
                 </div>
                 <h4 className="text-3xl font-operational text-white uppercase italic leading-none">1,248</h4>
               </div>
            </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
