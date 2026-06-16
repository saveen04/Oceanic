"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Waves, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Navigation,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MapIndicators } from "./MapIndicators";

/**
 * ContextIntelligence is the right-side collapsible panel triggered by map interaction.
 */
export function ContextIntelligence({ selectedLocation, onClose, telemetry, visible }) {
  if (!visible || !selectedLocation) return null;

  const locTelem = selectedLocation.telemetry || {};
  const riskLevel = locTelem.waveHeight > 3.0 ? "High" : "Low";
  const riskColor = riskLevel === "High" ? "text-rose-400" : "text-emerald-400";

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 z-[2000] w-[400px] h-full glass-dark-heavy border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] p-8 flex flex-col gap-8 backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-xl">
             <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-white">{selectedLocation.name || "Station Intelligence"}</h3>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
               {selectedLocation.lat?.toFixed(4)}, {selectedLocation.lng?.toFixed(4)}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">

        {/* AI Situational Report */}
        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl border border-blue-500/20 relative overflow-hidden">
           <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#4C9AFF]">AI Situational Report</span>
           </div>
           <p className="text-sm font-medium text-white/80 leading-relaxed italic">
              "Current conditions in this sector indicate {locTelem.waveHeight > 2 ? 'elevated' : 'stable'} aquatic activity. Monsoonal vectors remain dominant. Navigation is {riskLevel === 'High' ? 'restricted for small vessels' : 'advised for all classes'}."
           </p>
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
        </div>

        {/* Localized Indicators */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Live Metrics</span>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${riskColor}`}>
                 <AlertTriangle className="w-3 h-3" />
                 {riskLevel} Risk
              </div>
           </div>
           <div className="grid grid-cols-1 gap-3">
              <MapIndicators telemetry={[selectedLocation]} layout="vertical" />
           </div>
        </div>

        {/* Forecast & Risk Analysis */}
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-2 italic">24h Swell Prediction</span>
           <div className="grid grid-cols-4 gap-2">
              {[0.8, 1.2, 1.5, 1.1].map((val, i) => (
                <div key={i} className="glass-dark border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1">
                   <span className="text-[8px] uppercase text-white/30">T+{i*6}h</span>
                   <span className="text-xs font-black text-white">{val}m</span>
                </div>
              ))}
           </div>
        </div>

        {/* Nearby Services */}
        <div className="glass-dark border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Proximities</span>
            <div className="space-y-3">
               {[
                 { name: "Sector Response A", dist: "12nm", type: "SAR" },
                 { name: "Maritime Hub Alpha", dist: "28nm", type: "Port" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-white group-hover:text-blue-400">{item.name}</span>
                       <span className="text-[9px] text-white/20 uppercase font-black">{item.type}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                 </div>
               ))}
            </div>
        </div>

      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Navigation className="w-4 h-4 text-white/20" />
           <span className="text-[10px] font-black uppercase text-white/20">GIS Command v1.2</span>
        </div>
        <div className="text-[9px] font-bold text-[#4C9AFF] uppercase animate-pulse">Encryption: L-SECURE</div>
      </div>
    </motion.div>
  );
}
