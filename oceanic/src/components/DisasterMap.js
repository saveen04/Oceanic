"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const DEFAULT_CENTER = [13.0827, 80.2707];

// --- PRECISION LAND MASK (Exclusion Boxes for actual Land masses) ---
function isPointOverLand(lat, lon) {
  const lands = [
    { n: 37, s: 20, e: 95, w: 68 }, // North India
    { n: 20, s: 8, e: 88, w: 72 },  // South India
    { n: 28, s: 10, e: 60, w: 35 }, // Arabian Peninsula
    { n: 10, s: -35, e: 52, w: 30 }, // African Land
    { n: 28, s: 15, e: 108, w: 98 }, // SE Asia Land
  ];
  return lands.some(b => lat <= b.n && lat >= b.s && lon <= b.e && lon >= b.w);
}

// --- REFINED OCEAN HEATMAP (INCOIS SST & CSV TIDE) ---
// --- FLOOD MONITORING LAYER (OPEN-METEO REAL DATA) ---
function FloodMonitoringLayer() {
  const map = useMap();
  const { data: res } = useSWR("/api/flood", fetcher, { refreshInterval: 30000 }); 
  const floodPoints = res?.data;

  useEffect(() => {
    if (!floodPoints) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;z-index:450;opacity:1.0;`;
    const container = map.getContainer();
    const sz = () => { const s = container.getBoundingClientRect(); canvas.width = s.width; canvas.height = s.height; };
    sz();
    container.appendChild(canvas);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      floodPoints.forEach(p => {
        try {
          const pt = map.latLngToContainerPoint([p.lat, p.lon]);
          if (pt.x < 0 || pt.x > canvas.width || pt.y < 0 || pt.y > canvas.height) return;
          
          const isHigh = p.risk === "high";
          const isMod = p.risk === "moderate";
          
          if (isHigh || isMod) {
            const time = Date.now();
            const pulse = 1 + Math.sin(time / 300) * 0.3;
            
            // Outer glow
            ctx.fillStyle = isHigh ? "#ff0000" : "#ffcc00"; 
            ctx.globalAlpha = 0.5 * pulse;
            ctx.filter = "blur(15px)"; 
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isHigh ? 70 : 50, 0, Math.PI * 2); 
            ctx.fill();

            // Core alert icon (Nuclear-style pulse)
            ctx.filter = "none";
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = isHigh ? "#ff0000" : "#ffcc00";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
            ctx.fill();

            // Emergency Area Label
            ctx.fillStyle = isHigh ? "rgba(220, 38, 38, 0.95)" : "rgba(234, 179, 8, 0.95)";
            const label = `⚠️ ${p.name.toUpperCase()}: ${isHigh ? "CRITICAL FLOOD" : "MODERATE RISK"}`;
            ctx.font = "900 12px Inter, sans-serif";
            const metrics = ctx.measureText(label);
            
            // Rounded background for label
            const bgW = metrics.width + 16;
            const bgH = 20;
            const bgX = pt.x - bgW/2;
            const bgY = pt.y + 18;
            ctx.beginPath();
            ctx.roundRect(bgX, bgY, bgW, bgH, 10);
            ctx.fill();
            
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(label, pt.x, pt.y + 32);
          }
        } catch {}
      });
    };

    const anim = setInterval(draw, 50); 
    map.on("move zoom", draw);
    return () => { 
      clearInterval(anim);
      container.removeChild(canvas); 
      map.off("move zoom", draw); 
    };
  }, [map, floodPoints]);

  return null;
}

import HeatmapLayer from "./HeatmapLayer";

function OceanHeatmapLayer({ type, timelineIndex }) {
  const apiRoute = type === "sst" ? "/api/incois/sst" : "/api/weather/ocean-data";
  const { data: res } = useSWR(apiRoute, fetcher, { refreshInterval: 60000 });
  const allData = res?.data || res; // Handle different API response structures
  
  const points = useMemo(() => {
    if (!allData || !Array.isArray(allData)) return [];
    
    // Select the set of points matching the timeline index if it's dynamic ocean data
    let grid = allData;
    if (type !== "sst") {
      const pointsPerFrame = 12; 
      const totalFrames = Math.floor(allData.length / pointsPerFrame);
      if (totalFrames > 0) {
        const frameIndex = timelineIndex % totalFrames;
        const startIdx = frameIndex * pointsPerFrame;
        grid = allData.slice(startIdx, startIdx + pointsPerFrame);
      }
    }

    return grid.map(p => {
      const lat = p.lat || p.latitude;
      const lon = p.lon || p.longitude || p.lng;
      const intensity = type === "sst" ? (p.temp || p.anomaly || 25) : (p.swell || p.current || 0.5);
      return [lat, lon, intensity];
    });
  }, [allData, timelineIndex, type]);

  if (points.length === 0) return null;

  return (
    <HeatmapLayer 
      points={points} 
      options={{
        radius: 35,
        blur: 15,
        max: type === "sst" ? 35 : 5,
        minOpacity: 0.7,
        gradient: {
          0.4: 'rgba(0, 0, 255, 0.5)',    // Cold (Blue)
          0.6: 'rgba(0, 255, 255, 0.6)',  // Moderate (Cyan)
          0.7: 'rgba(0, 255, 0, 0.7)',    // Normal (Green)
          0.8: 'rgba(255, 255, 0, 0.8)',  // Warm (Yellow)
          1.0: 'rgba(255, 0, 0, 1)'       // Hot (Red)
        }
      }}
    />
  );
}

// --- CANVAS WIND ENGINE (REAL-TIME MOTION) ---
const PARTICLE_COUNT = 4500;
const MAX_AGE = 180;

function spawnAcrossEntireSea() {
  return {
    lat: -30 + Math.random() * 70, 
    lon: 40 + Math.random() * 85,  
    age: Math.floor(Math.random() * MAX_AGE)
  };
}

function getWindVector(grid, lat, lon, activeAlert = null) {
  if (activeAlert) {
    const dx = lon - activeAlert.longitude;
    const dy = lat - activeAlert.latitude;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 18) {
      const angle = Math.atan2(dy, dx) + (Math.PI / 2) + 0.35; 
      const strength = Math.max(3, 15 - dist);
      return { u: Math.cos(angle) * strength, v: Math.sin(angle) * strength };
    }
  }

  if (!grid || grid.length === 0) return { u: 1.2, v: 0.6 }; 
  
  const nearest = grid.reduce((a, b) => {
    const distA = Math.sqrt((a.lat - lat)**2 + (a.lon - lon)**2);
    const distB = Math.sqrt((b.lat - lat)**2 + (b.lon - lon)**2);
    return distA < distB ? a : b;
  });

  return { u: nearest.u, v: nearest.v };
}

function WindParticleLayer({ csvWeather, oscatActive, alerts }) {
  const map = useMap();
  const apiRoute = oscatActive ? "/api/incois/cyclone-wind" : "/api/weather/wind-live";
  const { data: gridRes } = useSWR(apiRoute, fetcher, { refreshInterval: 60000 });
  const grid = gridRes?.data;
  
  const activeAlert = alerts?.find(a => a.type.toLowerCase().includes("cyclone") || a.type.toLowerCase().includes("tsunami"));

  const particles = useRef(Array.from({ length: PARTICLE_COUNT }, () => spawnAcrossEntireSea()));

  useEffect(() => {
    const c = document.createElement("canvas");
    c.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:650;";
    const container = map.getContainer();
    const sz = () => { const s = container.getBoundingClientRect(); c.width = s.width; c.height = s.height; };
    sz();
    container.appendChild(c);
    
    let rid = null, cancel = false;
    const ps = particles.current;

    function dr() {
      if (cancel) return;
      const ctx = c.getContext("2d");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.12)"; 
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "source-over";

      for (const p of ps) {
        if (isPointOverLand(p.lat, p.lon)) {
           Object.assign(p, spawnAcrossEntireSea());
           continue;
        }

        const vector = getWindVector(grid, p.lat, p.lon, activeAlert);
        const isVortex = activeAlert && (Math.sqrt((p.lon - activeAlert.longitude)**2 + (p.lat - activeAlert.latitude)**2) < 18);
        const intensity = (oscatActive || isVortex) ? 1.5 : (csvWeather ? (csvWeather.wind_speed_10m / 10) : 1);
        const u = vector.u * intensity;
        const v = vector.v * intensity;

        const nl = p.lat + v * 0.002, no = p.lon + u * 0.002;

        try {
          const a = map.latLngToContainerPoint([p.lat, p.lon]);
          const b = map.latLngToContainerPoint([nl, no]);
          
          if (a.x >= 0 && a.x <= c.width && a.y >= 0 && a.y <= c.height) {
            ctx.strokeStyle = isVortex ? `rgba(255, 60, 60, 0.9)` : `rgba(220, 230, 240, 0.75)`; 
            ctx.lineWidth = isVortex ? 2.5 : 1.4; 
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        } catch { }

        p.lat = nl; p.lon = no; p.age++;
        if (p.age > MAX_AGE || p.lat < -35 || p.lat > 55 || p.lon < 35 || p.lon > 130) {
          Object.assign(p, spawnAcrossEntireSea());
        }
      }
      rid = requestAnimationFrame(dr);
    }
    dr();
    return () => { cancel = true; cancelAnimationFrame(rid); container.removeChild(c); };
  }, [map, grid, csvWeather, oscatActive, activeAlert]);

  return null;
}

// --- PREMIUM OCEAN CLEAR OVERLAY (WITH DYNAMIC SST COLOR) ---
function OceanClearLayer({ sstValue, active, satellite }) {
  const map = useMap();
  console.log("OceanClearLayer - sstValue:", sstValue, "active:", active, "satellite:", satellite);
  
  const getSstColor = (temp) => {
    if (temp === null || temp === undefined || !active) return "#006994"; // Default tropical blue
    
    // Check if it looks like an anomaly (small value) or absolute temperature
    if (temp > -10 && temp < 10) {
      // Anomaly based: Reddish for positive, Bluish for negative, Emerald for near 0
      // Lowering thresholds for better visibility of 0.3-0.5 range
      if (temp > 0.2) return "#ef4444";  // Red (Warmer)
      if (temp < -0.2) return "#3b82f6"; // Blue (Colder)
      return "#10b981";                 // Emerald/Normal
    }
    
    // Absolute Temperature Scale
    if (temp <= 15) return "#3b82f6";  // Blue (Cold)
    if (temp <= 25) return "#10b981";  // Emerald (Safe/Optimal)
    if (temp <= 30) return "#f59e0b";  // Amber (Warm)
    return "#ef4444";                  // Red (Very Hot)
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const opacity = satellite ? "0.45" : "0.65";
    canvas.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;z-index:300;opacity:${opacity};transition: all 0.5s ease;`;
    if (satellite) {
        canvas.style.mixBlendMode = "soft-light";
    }
    const container = map.getContainer();
    const sz = () => { const s = container.getBoundingClientRect(); canvas.width = s.width; canvas.height = s.height; };
    sz();
    container.appendChild(canvas);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = getSstColor(sstValue); 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Subtle depth gradients
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.2)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    draw();
    map.on("move zoom", draw);
    return () => { container.removeChild(canvas); map.off("move zoom", draw); };
  }, [map, sstValue, active]);
  return null;
}

// --- TIDE & SWELL MARKER LAYER (COMBINED) ---
function TideSwellMarkerLayer({ timelineIndex }) {
  const map = useMap();
  const { data: res } = useSWR("/api/weather/ocean-data", fetcher, { refreshInterval: 60000 });
  const allData = res?.data;

  // Select the set of points matching the timeline index
  const grid = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    // The API now returns a grid of 12 points for each time entry
    const pointsPerFrame = 12; 
    const totalFrames = Math.floor(allData.length / pointsPerFrame);
    if (totalFrames === 0) return allData; 
    
    const frameIndex = timelineIndex % totalFrames;
    const startIdx = frameIndex * pointsPerFrame;
    return allData.slice(startIdx, startIdx + pointsPerFrame);
  }, [allData, timelineIndex]);

  const createCombinedIcon = (tideColor, swellColor) => {
    return L.divIcon({
      className: "custom-combined-icon",
      html: `
        <div style="position:relative; width:30px; height:30px; display:flex; justify-content:center; align-items:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="position:absolute; top:0; left:0;">
             <path d="M12 4L4 20H20L12 4Z" fill="${tideColor}" stroke="white" stroke-width="2"/>
          </svg>
          <div style="position:absolute; bottom:-6px; right:-6px; width:14px; height:14px; background:${swellColor}; border:2px solid white; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  if (!grid) return null;

  return grid.map((p, i) => {
    if (isPointOverLand(p.lat, p.lon)) return null;

    const tVal = p.tide;
    const sVal = p.swell;
    
    // Thresholds
    const isTideHigh = tVal > 0.5;
    const isSwellHigh = sVal > 1.0;
    
    const tideColor = isTideHigh ? "#ef4444" : "#22c55e"; // Red/Green
    const swellColor = isSwellHigh ? "#f97316" : "#0ea5e9"; // Orange/OceanBlue for swell circle

    return (
      <Marker key={`tideswell-${i}`} position={[p.lat, p.lon]} icon={createCombinedIcon(tideColor, swellColor)}>
        <Popup>
          <div className="p-3 font-sans min-w-[160px]">
            <h3 className="font-bold uppercase text-[10px] text-zinc-500 mb-2 border-b pb-1">Ocean Metrics</h3>
            <div className="flex justify-between items-end mb-2">
              <div>
                 <div className="text-[10px] uppercase font-bold text-zinc-400">Tide MSL</div>
                 <div className="text-lg font-black text-zinc-900 leading-none">{tVal.toFixed(2)} m</div>
              </div>
              <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isTideHigh ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {isTideHigh ? "HIGH" : "SAFE"}
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                 <div className="text-[10px] uppercase font-bold text-zinc-400">Swell</div>
                 <div className="text-lg font-black text-zinc-900 leading-none">{sVal.toFixed(2)} m</div>
              </div>
              <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSwellHigh ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {isSwellHigh ? "ALERT" : "NORMAL"}
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}

// --- MOORED BUOY LAYER (INCOIS) ---
function MooredBuoyLayer() {
  const { data: res } = useSWR("/api/weather/moored-buoy", fetcher, { refreshInterval: 600000 });
  const buoys = res?.data || [];

  const createBuoyIcon = () => {
    return L.divIcon({
      className: "incois-buoy-icon",
      html: `
        <div style="background: #0284c7; border: 2.5px solid white; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  };

  if (!buoys.length) return null;

  return buoys.map((buoy, i) => (
    <Marker key={`buoy-${i}`} position={[buoy.lat, buoy.lon]} icon={createBuoyIcon()}>
      <Popup>
        <div className="p-2 font-sans">
          <h3 className="font-black uppercase text-[12px] text-sky-600 mb-1 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            INCOIS Moored Buoy
          </h3>
          <div className="text-sm font-bold text-zinc-800 mb-1">{buoy.id}</div>
          <p className="text-[10px] text-zinc-500">{buoy.description}</p>
          <div className="mt-2 text-[9px] font-bold bg-sky-50 text-sky-700 px-2 py-1 rounded inline-block">
            {buoy.lat.toFixed(2)}°N, {buoy.lon.toFixed(2)}°E
          </div>
        </div>
      </Popup>
    </Marker>
  ));
}

export function DisasterMap({ incois, mapboxToken, controls }) {
  const satellite = controls?.satellite ?? false;
  const layers = controls?.layers ?? { csvWeather: false, tideSwell: false, mooredBuoy: false, sst: false, flood: false };
  const timelineIndex = controls?.timelineIndex ?? 0;
  const oscatActive = layers.cyclone || false;

  return (
    <div className="h-full w-full overflow-hidden relative">
      <MapContainer center={DEFAULT_CENTER} zoom={5} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='Tiles' url={satellite ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        
        <OceanClearLayer 
          sstValue={incois?.currentSst?.sst} 
          active={layers.sst}
          satellite={satellite}
        />

        {layers.sst && <OceanHeatmapLayer key="sst-heatmap" type="sst" timelineIndex={timelineIndex} />}
        {layers.aqi && (
          <TileLayer
            key="aqi-tiles"
            url={`https://airquality.googleapis.com/v1/mapTypes/US_AQI/heatmapTiles/{z}/{x}/{y}?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}`}
            opacity={0.65}
            zIndex={400}
          />
        )}
        {layers.tideSwell && <TideSwellMarkerLayer key="tideswell-markers" timelineIndex={timelineIndex} />}
        {layers.mooredBuoy && <MooredBuoyLayer key="buoy-layer" />}
        {layers.flood && <FloodMonitoringLayer key="flood-layer" />}

        {layers.csvWeather && (
          <WindParticleLayer 
            key="wind-layer"
            csvWeather={incois?.currentFrame} 
            oscatActive={oscatActive} 
            alerts={incois?.alerts} 
          />
        )}

        <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 min-w-[240px]">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Telemetry Engine</div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <div className="space-y-5">
            {layers.sst && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">Thermal Scale (SST)</div>
                  <span className="text-[10px] font-black text-blue-600">LIVE</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-lime-400 via-yellow-400 to-red-600 shadow-inner border border-black/5"></div>
                <div className="flex justify-between text-[8px] text-zinc-400 font-black px-0.5 mt-0.5">
                  <span>20°C</span><span>28°C</span><span>35°C</span>
                </div>
              </div>
            )}

            {layers.aqi && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">Air Quality (AQI)</div>
                  <span className="text-[10px] font-black text-emerald-600">ACTIVE</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 via-red-500 via-purple-600 to-rose-900 shadow-inner border border-black/5"></div>
                <div className="flex justify-between text-[8px] text-zinc-400 font-black px-0.5 mt-0.5">
                  <span>GOOD</span><span>MODERATE</span><span>HAZARDOUS</span>
                </div>
              </div>
            )}

            {(layers.tideSwell) && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">Ocean Dynamics</div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-sm bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 uppercase">Tide Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                    <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 uppercase">Tide High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]"></div>
                    <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 uppercase">Swell Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 uppercase">Swell Alert</span>
                  </div>
                </div>
              </div>
            )}
            
            {layers.mooredBuoy && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">Signal Sources</div>
                <div className="flex items-center gap-2 rounded-xl bg-sky-50 p-2 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
                  <div className="w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                  <span className="text-[9px] font-black text-sky-700 dark:text-sky-300 uppercase">INCOIS OMNI STATION</span>
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-800 transition-all">
                <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></div>
                <span className="tracking-widest uppercase">Syncing Deep Data</span>
              </div>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
