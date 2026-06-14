import React, { useMemo } from "react";
import { ImageOverlay } from "react-leaflet";

/**
 * DynamicHeatmap renders a raster-style heatmap layer using canvas.
 * Optimized with useMemo to prevent excessive canvas operations.
 */
export function DynamicHeatmap({ type, data, opacity = 0.6, visible = true, bounds }) {
  const heatmapUrl = useMemo(() => {
    if (!visible || !data || !bounds) return null;
    return createHeatmapUrl(type, data);
  }, [type, data, visible, bounds]);

  if (!visible || !data || !heatmapUrl) return null;

  return (
    <ImageOverlay
      bounds={bounds}
      url={heatmapUrl}
      opacity={opacity}
      zIndex={100}
    />
  );
}

// Helper to generate a data URL for the heatmap image
// Optimized: Removed expensive bounds calculation from the image generator itself
function createHeatmapUrl(type, data) {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Create a base gradient based on the type
  const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 240);
  
  if (type === "temp" || type === "sst") {
    gradient.addColorStop(0, "rgba(255, 69, 0, 0.5)");
    gradient.addColorStop(0.5, "rgba(255, 140, 0, 0.2)");
    gradient.addColorStop(1, "rgba(255, 215, 0, 0.05)");
  } else if (type === "wind") {
    gradient.addColorStop(0, "rgba(0, 191, 255, 0.5)");
    gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 255, 0.05)");
  } else if (type === "salinity") {
    gradient.addColorStop(0, "rgba(0, 255, 127, 0.5)");
    gradient.addColorStop(1, "rgba(0, 128, 0, 0.05)");
  } else {
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  return canvas.toDataURL();
}
