"use client";

import React, { useMemo } from "react";
import { Circle, Tooltip } from "react-leaflet";

/**
 * MaritimeHeatmap renders a high-fidelity point-based grid of thermal or salt intensity.
 * We use Large Circles with color gradients to avoid the complexity of a custom WebGL heatmap in this step.
 */
export function MaritimeHeatmap({ data, type = "sst", visible = true }) {
  if (!visible || !data) return null;

  // Process data points and map to normalized color intensities
  const points = useMemo(() => {
    return data
      .filter(node => node && node.lat !== undefined && node.lng !== undefined)
      .map((node, i) => {
        const rawVal = type === "sst" ? node.temp : node.salinity;
        const val = typeof rawVal === 'number' ? rawVal : 0;
        
        // Color Mapping
        let color = "#3b82f6"; // Default Blue
        if (type === "sst") {
          // Temperature Gradient: 0C (Blue) -> 30C (Red)
          if (val > 28) color = "#ef4444"; // Hot
          else if (val > 24) color = "#f97316"; // Warm
          else if (val > 20) color = "#eab308"; // Mild
          else if (val > 15) color = "#10b981"; // Cool
        } else {
          // Salinity Gradient: 32psu (Teal) -> 40psu (Indigo)
          if (val > 38) color = "#4338ca"; // High Salinity
          else if (val > 36) color = "#6366f1"; 
          else if (val > 34) color = "#38bdf8"; // Low/Normal Salinity
        }

        return {
          lat: node.lat,
          lng: node.lng,
          val: val.toFixed(1),
          color,
          id: node.id || i
        };
      });
  }, [data, type]);

  const unit = type === "sst" ? "°C" : "PSU";
  const label = type === "sst" ? "Thermal" : "Salinity";

  return (
    <>
      {points.map((p) => (
        <Circle
          key={`${p.id}-${type}`}
          center={[p.lat, p.lng]}
          radius={120000} // Large radius for "heatmap" overlap
          pathOptions={{
            fillColor: p.color,
            fillOpacity: 0.35,
            color: "transparent",
            stroke: false
          }}
        >
          <Tooltip sticky direction="top">
            <div className="p-2 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label} Intelligence</span>
              <div className="text-sm font-black text-white">{p.val}{unit}</div>
            </div>
          </Tooltip>
        </Circle>
      ))}
    </>
  );
}
