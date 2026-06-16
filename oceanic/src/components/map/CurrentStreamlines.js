"use client";

import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

/**
 * Optimized Current Streamline Engine
 * ----------------------------------
 * Specialized for underwater vector fields (teal/cyan).
 * Uses grid-based optimization for smooth maritime flow.
 */
export function CurrentStreamlines({ data, visible = true, speedMultiplier = 0.8, opacity = 0.8, mapMode = "normal" }) {
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible || !data) return;

    const panes = map?.getPanes();
    if (!panes || !panes.overlayPane) return;

    const dpr = window.devicePixelRatio || 1;
    const mapSize = map.getSize();
    const canvas = document.createElement("canvas");

    canvas.width = mapSize.x * dpr;
    canvas.height = mapSize.y * dpr;
    canvas.style.width = `${mapSize.x}px`;
    canvas.style.height = `${mapSize.y}px`;
    
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "395"; // Just below wind
    canvas.style.opacity = (opacity * 0.9).toString(); // Higher opacity for visibility
    
    const container = panes.overlayPane;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    // --- Grid Vector Field Optimization ---
    const gridSpacing = 40;
    const cols = Math.ceil(mapSize.x / gridSpacing) + 1;
    const rows = Math.ceil(mapSize.y / gridSpacing) + 1;
    const grid = new Float32Array(cols * rows * 2);

    const updateVectorField = () => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * gridSpacing;
          const py = r * gridSpacing;
          const point = map.containerPointToLatLng([px, py]);
          
          let vx = 0.6; // Base drift
          let vy = 0.2;

          // Regional Indian Ocean Basin Currents & Rotational Gyres
          if (point.lat > -25 && point.lat < 35 && point.lng > 45 && point.lng < 115) {
              vx = 1.4;
              vy = -0.3;

              // 1. Arabian Sea Gyre (Rotational Turn)
              const asCenter = { lat: 15, lng: 65 };
              const asDx = point.lng - asCenter.lng;
              const asDy = point.lat - asCenter.lat;
              const asDist = Math.sqrt(asDx*asDx + asDy*asDy);
              if (asDist < 15) {
                vx += (-asDy / (asDist + 1)) * 1.2;
                vy += (asDx / (asDist + 1)) * 1.2;
              }

              // 2. Bay of Bengal Gyre (Rotational Turn)
              const bobCenter = { lat: 14, lng: 90 };
              const bobDx = point.lng - bobCenter.lng;
              const bobDy = point.lat - bobCenter.lat;
              const bobDist = Math.sqrt(bobDx*bobDx + bobDy*bobDy);
              if (bobDist < 15) {
                vx += (-bobDy / (bobDist + 1)) * 1.4;
                vy += (bobDx / (bobDist + 1)) * 1.4;
              }

              // 3. Southern Crossflow (below 0)
              if (point.lat < 0) {
                vx = -1.5;
                vy = 0.2;
              }
          }

          // Telemetry Influence
          if (data && data.length > 0) {
            let totalW = 0, nvx = 0, nvy = 0;
            for (const node of data) {
              const d2 = Math.pow(node.lat - point.lat, 2) + Math.pow(node.lng - point.lng, 2);
              if (d2 < 100) { // 10-degree radius
                const w = 1 / (d2 + 0.5);
                const angle = (node.currentDirection || 90) * (Math.PI / 180);
                const spd = node.currentVelocity || 0.8;
                nvx += Math.cos(angle) * spd * w;
                nvy += -Math.sin(angle) * spd * w;
                totalW += w;
              }
            }
            if (totalW > 0) {
              vx = vx * 0.5 + (nvx / totalW) * 0.5;
              vy = vy * 0.5 + (nvy / totalW) * 0.5;
            }
          }

          const idx = (r * cols + c) * 2;
          grid[idx] = vx * speedMultiplier;
          grid[idx + 1] = vy * speedMultiplier;
        }
      }
    };

    updateVectorField();

    let animationId;
    const particles = [];
    const particleCount = 5000; // Increased for visibility

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * mapSize.x,
        y: Math.random() * mapSize.y,
        age: Math.random() * 180,
      });
    }

    const render = () => {
      const currentSize = map.getSize();
      if (canvas.width !== currentSize.x * dpr) {
         updateVectorField();
         canvas.width = currentSize.x * dpr;
         canvas.height = currentSize.y * dpr;
         canvas.style.width = `${currentSize.x}px`;
         canvas.style.height = `${currentSize.y}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = mapMode === "satellite" ? "rgba(7, 71, 166, 0.04)" : "rgba(255, 255, 255, 0.05)"; 
      ctx.fillRect(0, 0, currentSize.x, currentSize.y);

      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(45, 212, 191, 0.7)"; // Teal/Cyan flow

      for (const p of particles) {
        const c = Math.floor(p.x / gridSpacing);
        const r = Math.floor(p.y / gridSpacing);
        const idx = (Math.min(rows-1, r) * cols + Math.min(cols-1, c)) * 2;
        
        const vx = grid[idx] || 0;
        const vy = grid[idx + 1] || 0;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        p.x += vx;
        p.y += vy;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        p.age++;
        if (p.age > 180 || p.x < 0 || p.x > currentSize.x || p.y < 0 || p.y > currentSize.y) {
          p.x = Math.random() * currentSize.x;
          p.y = Math.random() * currentSize.y;
          p.age = 0;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [map, visible, data, speedMultiplier, opacity, mapMode]);

  return null;
}
