"use client";

import { 
  Wind, 
  Waves, 
  Thermometer, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  Satellite, 
  Map as MapIcon,
  CloudRain,
  Navigation,
  Info
} from "lucide-react";

export function LayerPanel({ layers, setLayer, layerConfig, setLayerOpacity }) {
  const layerGroups = [
    {
      title: "Atmospheric Grids",
      items: [
        { id: "wind", label: "Wind Speed", icon: Wind },
        { id: "humidity", label: "Relative Humidity", icon: Droplets },
      ]
    },
    {
      title: "Oceanic Dynamics",
      items: [
        { id: "wave", label: "Wave Height", icon: Waves },
        { id: "swell", label: "Swell Intensity", icon: Activity },
        { id: "current", label: "Ocean Currents", icon: Navigation },
        { id: "sst", label: "Surface Temp (SST)", icon: Thermometer },
        { id: "salinity", label: "Salinity Index", icon: Droplets },
        { id: "tide", label: "Tide Levels", icon: Activity },
      ]
    },
    {
      title: "Risk & Disaster",
      items: [
        { id: "cyclone", label: "Cyclone Risk", icon: Wind, color: "text-rose-500" },
        { id: "tsunami", label: "Tsunami Risk", icon: ShieldAlert, color: "text-amber-500" },
        { id: "flood", label: "Coastal Flooding", icon: Activity },
      ]
    }
  ];

  return (
    <aside className="pointer-events-auto h-full w-[350px] border-r border-white/5 bg-[#0a1016]/80 backdrop-blur-3xl p-6 shadow-2xl flex flex-col pt-24 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">GIS Workspace</h2>
          <div className="text-[10px] font-bold text-white/30 uppercase mt-1">11 Active Intelligence Layers</div>
        </div>
        <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/40">
          <Info size={14} />
        </div>
      </div>
      
      <div className="space-y-10">
        {layerGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-white/20 px-1">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <LayerItem 
                   key={item.id}
                   item={item}
                   active={layers[item.id]}
                   opacity={layerConfig?.[item.id]?.opacity || 0.6}
                   onToggle={() => setLayer(item.id)}
                   onOpacityChange={(val) => setLayerOpacity(item.id, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="p-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[32px] border border-blue-500/20">
          <h4 className="text-[10px] font-black uppercase text-white mb-4 tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-blue-400" />
            Global Wind Legend
          </h4>
          <div className="space-y-3">
            {[
              { label: "Trade Winds", color: "bg-rose-400", range: "0° - 23° Lat" },
              { label: "Westerlies", color: "bg-amber-400", range: "23° - 60° Lat" },
              { label: "Polar Easterlies", color: "bg-sky-400", range: "> 60° Lat" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-bold text-white/60">{item.label}</span>
                </div>
                <span className="text-[8px] font-black text-white/20 uppercase">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white/5 rounded-[32px] border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-3">
             <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Health</div>
             <p className="text-[11px] text-white/40 leading-relaxed font-medium">
               Synchronizing with INCOIS-compatible grids and Open-Meteo satellite arrays. Latency: 42ms.
             </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl" />
        </div>
      </div>
    </aside>
  );
}

function LayerItem({ item, active, opacity, onToggle, onOpacityChange }) {
  return (
    <div className={`p-4 rounded-[24px] border transition-all duration-300 ${active ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white/5 ${item.color || 'text-white'}`}>
            <item.icon size={16} />
          </div>
          <span className={`text-[12px] font-bold ${active ? 'text-white' : 'text-white/40'}`}>{item.label}</span>
        </div>
        <button 
          onClick={onToggle}
          className={`w-10 h-5 rounded-full relative transition-all duration-500 ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500 ${active ? 'left-6' : 'left-1'}`} />
        </button>
      </div>
      
      {active && (
        <div className="mt-4 px-1 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
            <span>Layer Opacity</span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={opacity} 
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}
    </div>
  );
}
