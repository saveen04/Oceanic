"use client";

import React from "react";
import { Polyline, Tooltip } from "react-leaflet";

/**
 * VectorFieldLayer renders directional vectors (arrows) for wind/wave/current direction.
 * Uses a fixed grid to ensure consistent performance.
 */
export function VectorFieldLayer({ type, visible = true, opacity = 0.5, resolution = 15 }) {
  if (!visible) return null;

  // Generate a grid of vectors for the current view
  // In a real app, this would be computed based on map bounds
  const vectors = [];
  const startLat = 5, endLat = 25;
  const startLng = 70, endLng = 95;

  for (let lat = startLat; lat <= endLat; lat += 2.5) {
    for (let lng = startLng; lng <= endLng; lng += 2.5) {
      // Create a deterministic direction based on lat/lng for "simulated" vectors
      const angle = (lat * 10 + lng * 5) % 360;
      const length = 0.3; // Degree units
      
      const rad = (angle * Math.PI) / 180;
      const endLatVector = lat + Math.sin(rad) * length;
      const endLngVector = lng + Math.cos(rad) * length;

      vectors.push({
        path: [[lat, lng], [endLatVector, endLngVector]],
        id: `${lat}-${lng}`,
        angle: angle
      });
    }
  }

  const color = type === "wind" ? "#0ea5e9" : type === "wave" ? "#6366f1" : "#10b981";

  return (
    <>
      {vectors.map((v) => (
        <Polyline
          key={v.id}
          positions={v.path}
          pathOptions={{
            color: color,
            weight: 2,
            opacity: opacity,
            lineCap: "round"
          }}
        >
          <Tooltip sticky direction="top" opacity={0.8}>
            <div className="text-[9px] font-black uppercase text-white/50">Vector: {v.angle}°</div>
          </Tooltip>
        </Polyline>
      ))}
    </>
  );
}
