"use client";

import { Play, Pause, FastForward, Rewind, Clock } from "lucide-react";

export function TimelineControl({
  times,
  index,
  setIndex,
  playing,
  setPlaying,
  speed,
  setSpeed,
}) {
  const currentTime = times?.[index] || "2026-06-14 22:00:00 UTC";

  return (
    <div className="pointer-events-auto w-full border-t border-white/5 bg-[#0a1016]/90 px-8 py-6 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/30 hover:text-white transition-colors">
              <Rewind size={18} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95"
            >
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button className="p-2 text-white/30 hover:text-white transition-colors">
              <FastForward size={18} />
            </button>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Speed</span>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              {[1, 2, 4, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${speed === s ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="flex-grow w-full max-w-2xl group">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
               <Clock size={12} className="text-blue-400" />
               Current Time Orbit
             </div>
             <div className="text-xs font-mono text-white tracking-tight">{currentTime}</div>
          </div>
          <div className="relative">
             <input
              type="range"
              min={0}
              max={Math.max(0, (times?.length || 1) - 1)}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-600 group-hover:h-2 transition-all"
            />
          </div>
        </div>

        {/* Real-time Indicator */}
        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Data Stream</span>
          </div>
          <div className="text-[9px] font-bold text-white/20 uppercase">Syncing Atmospheric Grids</div>
        </div>
      </div>
    </div>
  );
}

