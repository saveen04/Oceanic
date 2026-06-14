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
              radius={20000}
              pathOptions={{
                color: "white",
                fillColor: color,
                fillOpacity: 0.8 * opacity,
                weight: 2
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="bg-[#0a1016] text-white p-2 rounded-lg border border-white/10 shadow-2xl">
                  <div className="text-[10px] font-black uppercase text-white/40 mb-1">{point.location || "Ocean Node"}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase text-white/30">Wave</span>
                      <span className="text-xs font-bold text-ocean-400">{point.waveHeight || "0.0"}m</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase text-white/30">Temp</span>
                      <span className="text-xs font-bold text-amber-400">{point.temp || "28.1"}°C</span>
                    </div>
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div className="p-4 bg-[#0a1016] text-white border border-white/10 rounded-2xl min-w-[200px]">
                  <h4 className="text-sm font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isWarning ? 'bg-rose-500 animate-pulse' : 'bg-ocean-500'}`} />
                    Station: {point.location}
                  </h4>
                  <p className="text-[10px] text-white/40 mb-4 font-medium italic">
                    Real-time satellite link via ODS-{point.id || 'SYNC'}. All sensors reporting nominal telemetry.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-[9px] uppercase text-white/20 mb-1">Humidity</div>
                      <div className="text-xs font-bold text-white">82%</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-[9px] uppercase text-white/20 mb-1">Pressure</div>
                      <div className="text-xs font-bold text-white">1012hp</div>
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
