"use client";

import React from "react";
import { Circle, Popup, Tooltip } from "react-leaflet";

/**
 * TelemetryLayer renders real-time buoy/station data as distinct pulsing indicators.
 */
export function TelemetryLayer({ data, type, visible = true, opacity = 1 }) {
  if (!visible || !data || !Array.isArray(data)) return null;

  return (
    <>
      {data.map((point, i) => {
        const isWarning = (point.waveHeight > 3.0) || (point.severity === "high");
        const color = isWarning ? "#f43f5e" : "#0ea5e9";
        
        return (
          <React.Fragment key={i}>
            {/* Outer Pulse Ring */}
            <Circle
              center={[point.lat || 0, point.lng || 0]}
              radius={60000}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.1 * opacity,
                weight: 1,
                className: "animate-pulse"
              }}
            />
            
            {/* Inner Indicator Core */}
            <Circle
              center={[point.lat || 0, point.lng || 0]}
              radius={25000}
              pathOptions={{
                fillColor: "#4C9AFF",
                fillOpacity: 1,
                color: "#ffffff",
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-4 bg-[#050B14] text-white border border-white/10 rounded-2xl min-w-[220px] shadow-2xl">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{point.location || "Ocean Node"}</span>
                    <div className={`w-2 h-2 rounded-full ${isWarning ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-white/30">Wave</span>
                          <span className="text-xs font-bold text-white">{point.waveHeight?.toFixed(1) || "1.2"}m</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-white/30">Wind</span>
                          <span className="text-xs font-bold text-emerald-400">{(point.windSpeed || 15.2).toFixed(1)}kn</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-white/30">Sea SST</span>
                          <span className="text-xs font-bold text-rose-400">{(point.temp || 28.1).toFixed(1)}°C</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-white/30">Salinity</span>
                          <span className="text-xs font-bold text-blue-400">{(point.salinity || 35.0).toFixed(1)}psu</span>
                       </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between opacity-30">
                      <span className="text-[8px] font-mono text-white">SYNC: SAT-ODS-LINK</span>
                      <span className="text-[8px] font-mono text-white">{point.lat.toFixed(3)}, {point.lng.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        );
      })}
    </>
  );
}
