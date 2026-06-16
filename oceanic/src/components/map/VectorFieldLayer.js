"use client";

import React, { useMemo } from "react";
import { Polyline, Tooltip } from "react-leaflet";

/**
 * Professional Marine Vector Field Layer
 * --------------------------------------
 * - Covers Indian Ocean region.
 * - Displays vectors only over sea regions.
 * - Simulates realistic wind/current/swell directions.
 * - Can later be replaced with real API data.
 */

export function VectorFieldLayer({
  type = "wind", // wind | current | swell
  visible = true,
  opacity = 0.7,
  spacing = 1.75,
}) {
  if (!visible) return null;

  /**
   * Check whether a coordinate belongs to an ocean region.
   * Excludes most land areas.
   */
  const isOceanPoint = (lat, lng) => {
    // Arabian Sea
    if (lng >= 66 && lng <= 76 && lat >= 5 && lat <= 24) return true;

    // Bay of Bengal
    if (lng >= 80 && lng <= 96 && lat >= 5 && lat <= 24) return true;

    // Southern Indian Ocean
    if (lat >= -5 && lat <= 10 && lng >= 60 && lng <= 100) return true;

    // Andaman Sea
    if (lng >= 92 && lng <= 99 && lat >= 6 && lat <= 18) return true;

    // Lakshadweep waters
    if (lng >= 70 && lng <= 75 && lat >= 8 && lat <= 14) return true;

    return false;
  };

  /**
   * Simulated marine directions based on basin.
   * Replace this later with API values.
   */
  const getMarineDirection = (lat, lng, layerType) => {
    // Arabian Sea
    if (lng >= 66 && lng <= 76 && lat >= 5 && lat <= 24) {
      switch (layerType) {
        case "wind":
          return 225; // South-West Monsoon
        case "current":
          return 160;
        case "swell":
          return 230;
        default:
          return 220;
      }
    }

    // Bay of Bengal
    if (lng >= 80 && lng <= 96 && lat >= 5 && lat <= 24) {
      switch (layerType) {
        case "wind":
          return 245;
        case "current":
          return 190;
        case "swell":
          return 250;
        default:
          return 240;
      }
    }

    // Andaman Sea
    if (lng >= 92 && lng <= 99 && lat >= 6 && lat <= 18) {
      switch (layerType) {
        case "wind":
          return 260;
        case "current":
          return 215;
        case "swell":
          return 255;
        default:
          return 250;
      }
    }

    // Central Indian Ocean
    if (lat < 10) {
      switch (layerType) {
        case "wind":
          return 270; // Easterly trade winds
        case "current":
          return 255;
        case "swell":
          return 265;
        default:
          return 260;
      }
    }

    return 220;
  };

  /**
   * Generate vector grid.
   */
  const vectors = useMemo(() => {
    const items = [];

    const startLat = -2;
    const endLat = 28;
    const startLng = 60;
    const endLng = 98;

    for (let lat = startLat; lat <= endLat; lat += spacing) {
      for (let lng = startLng; lng <= endLng; lng += spacing) {
        if (!isOceanPoint(lat, lng)) continue;

        const baseAngle = getMarineDirection(lat, lng, type);

        // Add small variation for realism
        const angle = baseAngle + (Math.random() - 0.5) * 18;

        const length = 0.45;
        const radians = (angle * Math.PI) / 180;

        const endLatVector = lat + Math.cos(radians) * length;
        const endLngVector = lng + Math.sin(radians) * length;

        items.push({
          id: `${lat}-${lng}`,
          start: [lat, lng],
          end: [endLatVector, endLngVector],
          angle: Math.round(angle),
        });
      }
    }

    return items;
  }, [type, spacing]);

  const colorMap = {
    wind: "#0ea5e9",
    current: "#10b981",
    swell: "#6366f1",
  };

  const color = colorMap[type] || "#0ea5e9";

  return (
    <>
      {vectors.map((vector) => (
        <React.Fragment key={vector.id}>
          {/* Main vector line */}
          <Polyline
            positions={[vector.start, vector.end]}
            pathOptions={{
              color,
              weight: 1.2,
              opacity: opacity,
              lineCap: "round",
            }}
          >
            <Tooltip
              sticky
              direction="top"
              opacity={0.95}
              className="marine-tooltip"
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 4px",
                }}
              >
                {type.toUpperCase()}
                <br />
                Direction: {vector.angle}°
              </div>
            </Tooltip>
          </Polyline>

          {/* Arrow Head */}
          <Polyline
            positions={[
              vector.end,
              [
                vector.end[0] -
                  0.08 *
                    Math.cos(((vector.angle - 25) * Math.PI) / 180),
                vector.end[1] -
                  0.08 *
                    Math.sin(((vector.angle - 25) * Math.PI) / 180),
              ],
            ]}
            pathOptions={{
              color,
              weight: 1.2,
              opacity,
            }}
          />

          <Polyline
            positions={[
              vector.end,
              [
                vector.end[0] -
                  0.08 *
                    Math.cos(((vector.angle + 25) * Math.PI) / 180),
                vector.end[1] -
                  0.08 *
                    Math.sin(((vector.angle + 25) * Math.PI) / 180),
              ],
            ]}
            pathOptions={{
              color,
              weight: 1.2,
              opacity,
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
}