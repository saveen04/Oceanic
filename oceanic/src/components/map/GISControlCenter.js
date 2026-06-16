"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  Activity, 
  Wifi, 
  Database, 
  Cpu, 
  Search,
  Wind,
  Waves,
  Thermometer,
  Eye,
  ShieldAlert,
  Navigation
} from "lucide-react";

/**
 * GISControlCenter is the primary left-side panel for layer management and health.
 */
export function GISControlCenter({ layers, toggleLayer, apiStatus = "online" }) {
  const layerGroups = [
    {
      name: "Oceanic Patterns",
      items: [
        { id: "wind", name: "Wind Streams", icon: Wind },
        { id: "current", name: "Current Flow", icon: Navigation },
        { id: "wave", name: "Wave Height", icon: Waves },
      ]
    },
    {
      name: "Environmental",
      items: [
        { id: "sst", name: "SST Heatmap", icon: Thermometer },
        { id: "salinity", name: "Salinity Index", icon: Eye },
      ]
    },
    {
      name: "Disaster Hub",
      items: [
        { id: "cyclone", name: "Cyclone Track", icon: ShieldAlert },
        { id: "tsunami", name: "Tsunami Zones", icon: Activity },
      ]
    }
  ];

  return (
    <div className="w-80 h-full flex flex-col gap-6 p-4">
      
      {/* Workspace Health Section */}
      <div className="glass-dark border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Workspace Health</span>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
             <Wifi className="w-4 h-4 text-emerald-400" />
             <div className="flex flex-col">
                <span className="text-[8px] uppercase text-white/30">API</span>
                <span className="text-[10px] font-bold text-white uppercase">{apiStatus}</span>
             </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
             <Database className="w-4 h-4 text-[#4C9AFF]" />
             <div className="flex flex-col">
                <span className="text-[8px] uppercase text-white/30">Sync</span>
                <span className="text-[10px] font-bold text-white uppercase">Live</span>
             </div>
          </div>
        </div>
      </div>

      {/* Layer Management Section */}
      <div className="flex-1 glass-dark border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">GIS Layer Manager</span>
          </div>
          <Search className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
        </div>

        <div className="space-y-6">
          {layerGroups.map((group, i) => (
            <div key={i} className="space-y-3">
              <h4 className="text-[9px] font-black uppercase text-white/20 tracking-widest pl-1">{group.name}</h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleLayer(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                      layers[item.id] 
                        ? "bg-blue-600/20 border-blue-500/30 text-white" 
                        : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${layers[item.id] ? "text-blue-400" : "text-white/20"}`} />
                      <span className="text-xs font-bold">{item.name}</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${layers[item.id] ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-white/10"}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="glass-dark border border-white/10 rounded-2xl p-4 flex items-center justify-between text-white/30">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">AI Compute Nodes: 84%</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
      </div>

    </div>
  );
}
