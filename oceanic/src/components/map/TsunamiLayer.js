"use client";

import React from "react";
import { Circle, Popup, Tooltip } from "react-leaflet";
import { AlertTriangle, Zap, ArrowDownCircle } from "lucide-react";

/**
 * TsunamiLayer renders high-fidelity warning zones and danger nodes.
 * Features pulsating reach-radius and estimated arrival time (ETA) telemetry.
 */
export function TsunamiLayer({ data, visible = true }) {
  if (!visible || !data || !Array.isArray(data)) return null;

  return (
    <>
      {data.map((node, i) => {
        const isCritical = node.severity === "critical" || node.magnitude > 7.0;
        const color = isCritical ? "#f43f5e" : "#fbbf24";
        
        return (
          <React.Fragment key={node.id || i}>
            {/* Warning Radius: Pulsating zone indicating danger reach */}
            <Circle
              center={[node.lat, node.lng]}
              radius={150000} // Significant reach zone
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.1,
                weight: 2,
                dashArray: "10, 10",
                className: "animate-pulse"
              }}
            />

            {/* Core Hazard Node */}
            <Circle
              center={[node.lat, node.lng]}
              radius={30000}
              pathOptions={{
                color: "#ffffff",
                fillColor: color,
                fillOpacity: 1,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="p-4 bg-[#050B14] text-white border border-white/10 rounded-2xl min-w-[240px] shadow-2xl">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Tsunami Intelligence</span>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[8px] font-black uppercase whitespace-nowrap animate-pulse">
                      Live Alert
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase text-white/30">Epicenter</span>
                      <span className="text-sm font-bold text-white">{node.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[8px] uppercase text-white/20 mb-1">Magnitude</div>
                          <div className="text-xs font-bold text-rose-400">{node.magnitude || "N/A"} Mw</div>
                       </div>
                       <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[8px] uppercase text-white/20 mb-1">Status</div>
                          <div className="text-xs font-bold text-amber-400 uppercase">{node.severity}</div>
                       </div>
                    </div>

                    <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-rose-500" />
                          <span className="text-[10px] font-bold text-white uppercase">Regional ETA</span>
                       </div>
                       <span className="text-sm font-black text-rose-500">{node.ETA || "TBD"}</span>
                    </div>

                    <div className="pt-1 flex items-center justify-between opacity-30">
                      <span className="text-[8px] font-mono text-white">REF: INCOIS-TEWS-{node.id}</span>
                      <span className="text-[8px] font-mono text-white">{node.lat.toFixed(3)}, {node.lng.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </Popup>

              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="bg-rose-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">
                  Tsunami Alert: {node.severity}
                </div>
              </Tooltip>
            </Circle>
          </React.Fragment>
        );
      })}
    </>
  );
}
