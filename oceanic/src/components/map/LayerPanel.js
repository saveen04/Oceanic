"use client";

export function LayerPanel({ layers, setLayer, satellite, setSatellite }) {
  return (
    <aside className="pointer-events-auto h-full w-[320px] border-r border-black/10 bg-white/90 p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_60px_rgba(0,0,0,0.20)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 mt-16">
      <div className="text-sm font-semibold text-zinc-900 dark:text-white border-b border-black/5 pb-2 mb-4">MAP CONTROLS</div>
      
      <div className="space-y-3 text-sm">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Base Vision</div>
        <Check label="Satellite View" checked={satellite ?? false} onChange={() => setSatellite(!satellite)} />
        
        <div className="mt-6 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
          Atmospheric System
        </div>
        <Check label="Wind Atmospheric Movements" checked={layers.csvWeather ?? false} onChange={() => setLayer("csvWeather")} />
        
        <div className="mt-6 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
          Oceanic Monitoring
        </div>
        <div className="flex items-center gap-3 mb-2 px-1 text-[9px] font-bold">
          <span className="flex items-center gap-1"><span style={{background:'#10b981',display:'inline-block',width:8,height:8,borderRadius:'50%'}}/>Safe</span>
          <span className="flex items-center gap-1"><span style={{background:'#7c3aed',display:'inline-block',width:8,height:8,borderRadius:'50%'}}/>Normal</span>
          <span className="flex items-center gap-1"><span style={{background:'#fbbf24',display:'inline-block',width:8,height:8,borderRadius:'50%'}}/>Danger</span>
        </div>
        <Check label="Sea Surface Temp (SST)" checked={layers.sst ?? false} onChange={() => setLayer("sst")} />
        <Check label="Air Quality (AQI)" checked={layers.aqi ?? false} onChange={() => setLayer("aqi")} />
        <Check label="Tide & Swell Monitoring" checked={layers.tideSwell ?? false} onChange={() => setLayer("tideSwell")} />
        <Check label="Moored Buoy (INCOIS)" checked={layers.mooredBuoy ?? false} onChange={() => setLayer("mooredBuoy")} />
        <Check label="Flood Monitoring" checked={layers.flood ?? false} onChange={() => setLayer("flood")} />
        <div className="h-px bg-black/5 dark:bg-white/5 my-2" />
        <Check label="Tsunami Alerts" checked={layers.tsunami} onChange={() => setLayer("tsunami")} />
        <Check label="Cyclone Tracks" checked={layers.cyclone} onChange={() => setLayer("cyclone")} />
      </div>

      <div className="mt-auto pt-6 border-t border-black/5 mt-8">
        <div className="rounded-2xl border border-black/10 bg-zinc-50/50 p-3 text-[10px] text-zinc-500 font-medium leading-relaxed dark:border-white/10 dark:bg-zinc-900/50">
          Professional hybrid monitoring active. Wind vectors are synchronized with atmospheric grids, while Tide Intensity is derived from real-time swell datasets.
        </div>
      </div>
    </aside>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-2.5 transition-all hover:border-indigo-500/30 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900">
      <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">{label}</span>
      <div className="relative inline-flex items-center">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange} 
          className="peer sr-only"
        />
        <div className="h-4 w-8 rounded-full bg-zinc-200 peer-checked:bg-indigo-600 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4"></div>
      </div>
    </label>
  );
}
