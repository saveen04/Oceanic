"use client";

import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

/**
 * WindParticles renders animated streamlines (Windy.com style) on a canvas overlay.
 */
export function WindParticles({ data, visible = true, speedMultiplier = 1, opacity = 0.6 }) {
  const map = useMap();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible || !data) return;

    const panes = map?.getPanes();
    if (!panes?.overlayPane) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "400";
    canvas.style.opacity = opacity.toString();
    
    const container = panes.overlayPane;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    let animationId;
    const particles = [];
    const particleCount = 2500;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        age: Math.random() * 100,
      });
    }

    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(10, 16, 22, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();

      particles.forEach((p) => {
        // 1. Establish Latitudinal Global Baseline (General Circulation)
        const point = map.containerPointToLatLng([p.x, p.y]);
        const absLat = Math.abs(point.lat);
        
        let baseVx = 1.0;
        let baseVy = 0;
        
        if (absLat < 23.5) {
          // Trade Winds (East to West)
          baseVx = -1.2;
          // India-Specific Monsoonal Blend (approx 5-30N, 60-100E)
          if (point.lat > 5 && point.lat < 35 && point.lng > 60 && point.lng < 100) {
             baseVx = 1.5; // Stronger North-Easterly flow as per image
             baseVy = -0.5;
          }
        } else if (absLat < 60) {
          // Westerlies (West to East)
          baseVx = 1.8;
        } else {
          // Polar Easterlies
          baseVx = -0.8;
        }

        let vx = baseVx;
        let vy = baseVy;

        // 2. Blend with Local Telemetry (if available)
        if (data && data.length > 0) {
          let closestNode = data[0];
          let minDistance = Infinity;
          
          data.forEach(node => {
            const dist = Math.sqrt(Math.pow(node.lat - point.lat, 2) + Math.pow(node.lng - point.lng, 2));
            if (dist < minDistance) {
              minDistance = dist;
              closestNode = node;
            }
          });

          // Only blend if station is reasonably close (< 20 degrees)
          if (minDistance < 20) {
            const velocity = closestNode.windSpeed || closestNode.currentVelocity || 1.0;
            const direction = (closestNode.windDirection || closestNode.currentDirection || 90) * (Math.PI / 180);
            const nodeVx = Math.cos(direction) * velocity;
            const nodeVy = Math.sin(direction) * velocity;
            
            // Influence decreases with distance
            const weight = Math.max(0, 1 - (minDistance / 20));
            vx = (vx * (1 - weight)) + (nodeVx * weight * 0.7);
            vy = (vy * (1 - weight)) + (nodeVy * weight * 0.7);
          }
        }

        // Apply speed multiplier and jitter
        vx *= speedMultiplier * 0.9;
        vy *= speedMultiplier * 0.9;

        // 3. Color Coding based on Latitude (Visual Patterns)
        if (absLat < 23.5) {
          ctx.strokeStyle = "rgba(251, 113, 133, 0.85)"; // Trade Winds (Rose)
        } else if (absLat < 60) {
          ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";  // Westerlies (Amber)
        } else {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";  // Polar Easterlies (Sky)
        }

        ctx.lineWidth = 2.4; // ENLARGED
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        p.x += vx;
        p.y += vy;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        p.age++;
        if (p.age > 180 || p.x > canvas.width || p.y > canvas.height || p.x < 0 || p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.age = 0;
        }
      });

      ctx.stroke();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [map, visible, data, speedMultiplier, opacity]);

  return null;
}
