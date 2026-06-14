"use client";

import React from "react";
import useSWR from "swr";
import { 
  Bell, 
  AlertCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  Waves,
  Wind,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { fetcher } from "@/lib/fetcher";

const ALERT_CATEGORIES = [
  { id: "critical", label: "Urgent Alarm", bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-500" },
  { id: "warning", label: "Warning Signal", bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-500" },
  { id: "info", label: "Intelligence Update", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-500" },
];

export default function AlertsPage() {
  const { data, error } = useSWR("/api/incois/summary", fetcher);
  const alerts = data?.alerts || [
    { id: 1, type: "Tsunami Watch", region: "Andaman & Nicobar", severity: "critical", time: "2 mins ago", icon: Waves, desc: "Seismic activity detected in Sumatra trench. Tsunami watch active for coastal areas." },
    { id: 2, type: "Cyclone Impact", region: "Odisha Coast", severity: "warning", time: "14 mins ago", icon: Wind, desc: "Cyclone 'REMAL' intensifying. Expected landfall between Paradip and Balasore." },
    { id: 3, type: "Storm Surge", region: "West Bengal", severity: "warning", time: "45 mins ago", icon: Zap, desc: "High tide combined with wind forcing creating 2.5m surge in Sundarbans." },
    { id: 4, type: "Routine Sync", region: "Global Network", severity: "info", time: "1 hour ago", icon: MapPin, desc: "Satellite constellation ODS-04 synced with ground station. All sensors nominal." },
  ];

  return (
    <div className="space-y-10 min-h-screen pb-20">
      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 animate-pulse">
                <Bell className="text-blue-500 w-6 h-6" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Global Pulse // Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Global <span className="text-blue-600 not-italic">Alerts</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-wide max-w-xl">
            Live intelligence stream from INCOIS and satellite constellations. Real-time hazardous notification grid.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-3 glass-dark border border-white/5 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Link: 100%</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Alert Column */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3 mb-4">
             <AlertCircle className="text-blue-500 w-4 h-4" /> Live Intelligence Stream
           </h3>

           <div className="space-y-4">
              {alerts.map((alert, idx) => {
                const cat = ALERT_CATEGORIES.find(c => c.id === alert.severity) || ALERT_CATEGORIES[2];
                const Icon = alert.icon || Info;
                
                return (
                  <motion.div 
                    key={alert.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`glass-premium border ${cat.border} p-6 rounded-[32px] flex items-start gap-6 relative overflow-hidden group hover:bg-white/[0.02] transition-all shadow-2xl shadow-black/40`}
                  >
                     {/* Depth Glow */}
                     <div className={`absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-all ${cat.bg}`} />
                     
                     <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center border border-white/10 shrink-0 shadow-inner`}>
                        <Icon className={`w-8 h-8 ${cat.text} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                     </div>
                     
                     <div className="flex-1 space-y-2 relative z-10">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{alert.type}</h4>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/5 ${cat.bg} ${cat.text}`}>
                                 {cat.label}
                              </span>
                           </div>
                           <div className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
                              <Clock className="w-3 h-3" /> {alert.time}
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                           <MapPin className="w-3 h-3 text-blue-500" /> {alert.region}
                        </div>
                        
                        <p className="text-white/60 text-sm font-medium leading-relaxed">
                           {alert.desc}
                        </p>
                        
                        <div className="pt-4 flex items-center justify-between">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white/5 border border-[#0a1016] flex items-center justify-center text-[8px] font-black text-white/30">
                                   A{i}
                                </div>
                              ))}
                           </div>
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-all">
                              Initiate Protocol <ArrowUpRight className="w-3 h-3" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                );
              })}
           </div>
        </div>

        {/* Intelligence Context Column */}
        <div className="space-y-8">
           <div className="glass-dark border border-white/5 p-8 rounded-[40px] space-y-6 bg-gradient-to-br from-blue-600/5 to-transparent">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40">
                 <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Safety <span className="text-blue-500 not-italic">Engine</span></h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                 The Oceanic AI safety engine is currently monitoring 512 coastal nodes. In case of emergency, the protocol will automatically trigger local broadcasts.
              </p>
              <ul className="space-y-4">
                 {[
                   "Tsunami Propagation Models",
                   "Tropical Cyclone Trajectories",
                   "Storm Surge Inundation Maps",
                   "Coastal Flood Watch"
                 ].map((node, i) => (
                   <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {node}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="glass-dark border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Network Health</h4>
              <div className="flex items-end gap-2 mb-4">
                 <div className="text-4xl font-black text-white tracking-tighter italic">98.2<span className="text-emerald-500 text-xl not-italic">%</span></div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[98%]" />
              </div>
              <p className="mt-4 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">All Global Ground Stations Active</p>
           </div>
        </div>
      </div>
    </div>
  );
}
