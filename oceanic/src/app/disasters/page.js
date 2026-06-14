"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Activity, 
  Wind, 
  Waves, 
  ShieldAlert, 
  ArrowRight,
  Search,
  Filter,
  BarChart3,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetcher } from "@/lib/fetcher";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const TYPES = [
  { id: "tsunami", label: "Tsunami", icon: Waves, color: "text-blue-400" },
  { id: "cyclone", label: "Cyclone", icon: Wind, color: "text-cyan-400" },
  { id: "high_waves", label: "High waves", icon: Activity, color: "text-emerald-400" },
  { id: "tide", label: "Normal Tide", icon: MapPin, color: "text-indigo-400" },
  { id: "storm_surge", label: "Storm Surge", icon: AlertTriangle, color: "text-rose-400" },
  { id: "coastal_flooding", label: "Flooding", icon: Activity, color: "text-amber-400" },
];

const SEVERITIES = [
  { id: "low", label: "Monitoring", color: "bg-blue-500/20 text-blue-400" },
  { id: "moderate", label: "Elevated", color: "bg-amber-500/20 text-amber-400" },
  { id: "high", label: "Critical", color: "bg-orange-500/20 text-orange-400" },
  { id: "critical", label: "Catastrophic", color: "bg-rose-500/20 text-rose-400" },
];

export default function DisastersPage() {
  const { data, mutate } = useSWR("/api/disasters?limit=50", fetcher);
  const items = data?.items ?? [];
  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    type: "high_waves",
    location: "Chennai Coast",
    latitude: 13.0827,
    longitude: 80.2707,
    severity: "moderate",
    waveHeight: 2.2,
    tideLevel: null,
    windSpeed: null,
  });

  async function handleCreate(e) {
    if (e) e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/disasters", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          waveHeight: formData.waveHeight ? Number(formData.waveHeight) : null,
          tideLevel: formData.tideLevel ? Number(formData.tideLevel) : null,
          windSpeed: formData.windSpeed ? Number(formData.windSpeed) : null,
          source: "manual",
        }),
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out?.error || "Registration Failed");

      toast.success("Disaster Protocol Initialized");
      await mutate();
      setShowAdd(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 min-h-screen pb-20 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center border border-rose-500/30">
                <ShieldAlert className="text-rose-500 w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Vulnerability Node // Global Safety</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              Disaster Center
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide max-w-xl">
              Real-time monitoring and specialized emergency response infrastructure for global coastal safety.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl flex items-center gap-3"
            >
              {showAdd ? "Close Protocol" : "Initialize Detection"}
              <Plus className={`w-4 h-4 transition-transform ${showAdd ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch pt-4">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-2xl border border-rose-500/10 hover:border-rose-500/30 transition-all group overflow-hidden relative">
                <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldAlert className="w-40 h-40 text-rose-500" />
                </div>
                <div className="relative z-10">
                  <div className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-4 w-fit border border-rose-500/20">
                    High Priority
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic mb-2">Women Protection Hub</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-4 bg-rose-600/10 rounded-xl border border-rose-500/10 group-hover:bg-rose-600 transition-all cursor-pointer">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Women Helpline</span>
                      <span className="text-sm font-black text-white uppercase italic">1091 // SOS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MapPin className="w-40 h-40 text-blue-500" />
                </div>
                <div className="relative z-10">
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-4 w-fit border border-blue-500/20">
                    Spatial Monitoring
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic mb-2">Nearby Police Stations</h3>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2.5 bg-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                      Locate Stations
                    </button>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">8 Nodes Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                  <Activity className="text-blue-500 w-4 h-4" /> Real-time Hazard Intelligence
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center glass rounded-2xl border border-white/5 text-white/20 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Satellite Ping...</span>
                  </div>
                ) : (
                  items.map((event, idx) => {
                    const typeInfo = TYPES.find(t => t.id === event.type) || TYPES[2];
                    const severityInfo = SEVERITIES.find(s => s.id === event.severity) || SEVERITIES[0];
                    return (
                      <motion.div 
                        key={event._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-xl p-8 flex flex-col gap-6 relative group overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                      >
                         <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                               <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${typeInfo.color}`}>
                                  <typeInfo.icon className="w-8 h-8" />
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{typeInfo.label}</h4>
                                  <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                     <MapPin className="w-3 h-3 text-rose-500" /> {event.location}
                                  </div>
                               </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${severityInfo.color}`}>
                               {severityInfo.label}
                            </div>
                         </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <AnimatePresence>
              {showAdd && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-8 rounded-2xl border border-rose-500/20 shadow-2xl"
                >
                  <h3 className="text-xs font-black uppercase tracking-tight text-white mb-8 border-b border-white/5 pb-4">Initialize Protocol</h3>
                  <form onSubmit={handleCreate} className="space-y-6 text-black">
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:border-rose-500/30 transition-all font-black uppercase tracking-widest"
                    >
                      {TYPES.map(t => <option key={t.id} value={t.id} className="bg-[#0a1016] text-white">{t.label}</option>)}
                    </select>
                    <input 
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-white text-xs placeholder:text-white/10 outline-none focus:border-rose-500/30 transition-all font-bold"
                      placeholder="Target Location..."
                    />
                    <button 
                      disabled={creating}
                      className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-rose-900/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                      {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Detection"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Emergency Directives</h3>
              <div className="space-y-4 text-xs font-medium text-white/40 leading-relaxed italic">
                <p>1. In case of storm surges, move to inland elevated shelters above 15m altitude.</p>
                <p>2. Women travelers are advised to share real-time GPS nodes via the protection hub.</p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">General Emergency</span>
                   <span className="text-sm font-black text-white">108</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}