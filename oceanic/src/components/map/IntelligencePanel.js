"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapIndicators } from "./MapIndicators";
import { Info, Map as MapIcon, Ship, Target } from "lucide-react";

/**
 * IntelligencePanel is the primary workspace controller for regional monitoring.
 * Positioned on the right side of the GIS map view.
 */
export function IntelligencePanel({ telemetry, visible = true }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-8 right-8 z-[1000] w-80 h-[calc(100%-64px)] flex flex-col gap-6 pointer-events-none"
    >
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pointer-events-auto">
        
        {/* Workspace Title Card */}
        <div className="glass-dark border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-blue-400 mb-1">
            <Target className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Indian Workspace</span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight">Maritime Intelligence Hub</h3>
          <p className="text-[10px] text-white/40 font-medium leading-relaxed">
            Real-time multi-metric analysis for the Arabian Sea, Bay of Bengal, and Indian Ocean regions.
          </p>
        </div>

        {/* Real-Time Metrics Group */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-2 text-[9px] font-black uppercase tracking-widest text-white/20">
            <Info className="w-3 h-3" />
            Regional Indicators
          </div>
          <MapIndicators telemetry={telemetry} layout="vertical" />
        </div>

        {/* Shipping & Activity Tracker */}
        <div className="glass-dark border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Active Hubs</span>
              <Ship className="w-4 h-4 text-emerald-400/50" />
           </div>
           <div className="space-y-4">
              {[
                { name: "Mumbai JNPT", status: "Nominal", wave: "1.2m" },
                { name: "Chennai Port", status: "Active", wave: "0.8m" },
                { name: "Kochi Marine", status: "Standby", wave: "1.5m" }
              ].map((hub, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{hub.name}</span>
                    <span className="text-[9px] text-white/30 uppercase tracking-tighter">{hub.status} Telemetry</span>
                  </div>
                  <div className="text-[11px] font-black text-emerald-400">{hub.wave}</div>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* Footer System Status */}
      <div className="glass-dark border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">DSN Satellite: ODS-7 LINK ACTIVE</span>
      </div>
    </motion.div>
  );
}
