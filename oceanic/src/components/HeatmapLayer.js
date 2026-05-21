"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points, options }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Filter points to ensure they are [lat, lng, intensity]
    const validPoints = points.filter(p => p[0] && p[1] && p[2]);

    const heat = L.heatLayer(validPoints, {
      ...options,
      minOpacity: 0.5,
      scaleRadius: true,
      useLocalExtrema: true
    }).addTo(map);

    return () => {
      if (map && heat) map.removeLayer(heat);
    };
  }, [map, points, options]);

  return null;
}
