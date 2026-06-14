"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import { useMap } from "react-leaflet";

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

import { LayerPanel } from "./LayerPanel";
import { TimelineControl } from "./TimelineControl";
import { DynamicHeatmap } from "./DynamicHeatmap";
import { WindParticles } from "./WindParticles";
import { TelemetryLayer } from "./TelemetryLayer";
import { VectorFieldLayer } from "./VectorFieldLayer";

import { Layers, Maximize2, Navigation, Activity, ShieldAlert, Wind as WindIcon, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const OceanMap = () => {
  const { data: liveTelemetry } = useSWR("/api/incois/summary", fetcher);
  const { data: datasetTelemetry } = useSWR("/api/telemetry", fetcher);

  // Memoized Combined Telemetry (Live API + CSV Datasets)
  const telemetry = useMemo(() => {
    const live = liveTelemetry?.waves || [];
    const dataset = datasetTelemetry?.data || [];
    return {
      waves: [...live, ...dataset]
    };
  }, [liveTelemetry, datasetTelemetry]);

  const [mounted, setMounted] = useState(false);
  // ... rest of state unchanged
  const [showControls, setShowControls] = useState(true);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // GIS Map Mode (satellite, normal)
  const [mapMode, setMapMode] = useState("normal");

  // 11 GIS Layers State
  const [layers, setLayers] = useState({
    wave: true,
    swell: false,
    sst: false,
    current: false,
    salinity: false,
    cyclone: false,
    wind: true,
    humidity: false,
    bathymetry: false,
    shipping: false,
    satellite: false,
  });

  // Layer Config (Opacity, etc.)
  const [layerConfig, setLayerConfig] = useState(
    Object.keys(layers).reduce((acc, l) => ({ ...acc, [l]: { opacity: 0.6 } }), {})
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setTimelineIndex((prev) => (prev + 1) % 24); // 24hr loop
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [playing, speed]);

  const [mapBounds, setMapBounds] = useState(null);

  const toggleLayer = (id) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setLayerOpacity = (id, val) => {
    setLayerConfig((prev) => ({
      ...prev,
      [id]: { ...prev[id], opacity: val },
    }));
  };

  // Map events to track bounds for heatmaps
  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      if (!mapBounds) setMapBounds(map.getBounds());
      
      const handleMove = () => {
        setMapBounds(map.getBounds());
      };
      
      map.on("moveend", handleMove);
      return () => map.off("moveend", handleMove);
    }, [map]);
    return null;
  };

  if (!mounted) return (
    <div className="w-full h-[700px] bg-[#0a1016] rounded-[40px] flex items-center justify-center border border-white/5">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Syncing Planet Grids...</span>
      </div>
    </div>
  );

  const cyclonePath = [
    [15.5, 88.2],
    [16.8, 89.5],
    [18.2, 90.1],
    [19.5, 91.0],
  ];

  return (
    <div className="relative w-full h-[calc(100vh-180px)] rounded-2xl overflow-hidden border border-white/5 bg-[#0a1016] group flex flex-col shadow-2xl">
      
      {/* Top Map Header */}
      <div className="absolute top-8 left-8 z-[1000] flex items-center gap-4 pointer-events-none">
        <button 
          onClick={() => setShowControls(!showControls)}
          className="p-4 glass-dark border border-white/10 rounded-2xl text-white hover:bg-blue-600 transition-all pointer-events-auto shadow-2xl"
        >
          <Layers className="w-5 h-5" />
        </button>
        <div className="glass-dark border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-2xl pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Geo-Intelligence Active</span>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Layer Controls Sidebar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative z-[1000]"
            >
              <LayerPanel 
                layers={layers} 
                setLayer={toggleLayer} 
                layerConfig={layerConfig}
                setLayerOpacity={setLayerOpacity}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Map Engine */}
        <div className="flex-1 relative bg-[#f8fafc]">
          <MapContainer 
            key={`${mapMode}-${mounted}`} // Force clean remount to fix 'reused instance' errors
            center={[15, 0]} 
            zoom={3} 
            style={{ height: "100%", width: "100%", background: "#f8fafc" }}
            className="z-0"
            zoomControl={false}
          >
            <MapEvents />
            
            {/* Dynamic Tile Layers based on Map Mode */}
            {mapMode === "normal" && (
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
            )}

            {mapMode === "satellite" && (
              <>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                  opacity={0.8}
                />
              </>
            )}
            
            {/* Global Result Heatmaps (SST, Salinity, Humidity) */}
            {["sst", "salinity", "humidity"].map((layerId) => (
              layers[layerId] && (
                <DynamicHeatmap 
                  key={layerId}
                  type={layerId}
                  visible={layers[layerId]}
                  opacity={layerConfig[layerId].opacity}
                  bounds={mapBounds}
                  data={telemetry?.waves || [1]} 
                />
              )
            ))}

            {/* Specialized Wave & Swell Vector Layers */}
            {layers.wave && (
              <TelemetryLayer 
                data={telemetry?.waves} 
                type="wave" 
                visible={layers.wave}
                opacity={layerConfig.wave.opacity}
              />
            )}

            {layers.swell && (
              <VectorFieldLayer 
                type="wave"
                visible={layers.swell}
                opacity={layerConfig.swell.opacity}
              />
            )}

            {/* Windy.com Style Wind Particles */}
            <WindParticles 
              visible={layers.wind} 
              data={telemetry?.waves}
              speedMultiplier={speed * 0.5} 
              opacity={layerConfig.wind.opacity}
            />

            {/* Ocean Current Vectors */}
            {layers.current && (
              <VectorFieldLayer 
                type="current"
                visible={layers.current}
                opacity={layerConfig.current.opacity}
              />
            )}

            {/* Cyclone Tracking & Prediction */}
            {layers.cyclone && (
              <>
                <Polyline 
                  positions={cyclonePath} 
                  pathOptions={{ color: '#f43f5e', weight: 2, dashArray: '8, 8', lineCap: 'round' }}
                />
                {cyclonePath.map((pos, i) => (
                  <Circle
                    key={i}
                    center={pos}
                    radius={150000}
                    pathOptions={{ 
                      fillColor: i === cyclonePath.length - 1 ? '#f43f5e' : '#f43f5e', 
                      fillOpacity: 0.1, 
                      color: '#f43f5e',
                      weight: 1
                    }}
                  >
                    <Popup>
                      <div className="p-3 bg-[#0a1016] text-white border border-white/10 rounded-xl">
                        <div className="text-[10px] font-black uppercase text-rose-500 mb-1">Cyclone Vayu Prediction</div>
                        <div className="text-xs font-bold">Node {i + 1} • T+{i*6}h</div>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </>
            )}

            {/* Tsunami Propagation Simulation */}
            {layers.tsunami && (
              <Circle 
                center={[0, 120]} 
                radius={800000} 
                pathOptions={{ color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.05, weight: 1, dashArray: '10, 10' }}
              >
                <div className="absolute inset-0 bg-amber-500 animate-ping opacity-20" />
              </Circle>
            )}
          </MapContainer>

          {/* Floating Map Actions */}
          <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-4">
             {/* Map Mode Switcher */}
             <div className="flex flex-col gap-2 p-2 glass-dark border border-white/10 rounded-3xl shadow-2xl">
               {[
                 { id: "normal", label: "Intelligence", icon: Navigation },
                 { id: "satellite", label: "Satellite", icon: Layers }
               ].map((mode) => (
                 <button
                   key={mode.id}
                   onClick={() => setMapMode(mode.id)}
                   className={`p-3 rounded-2xl transition-all flex items-center gap-3 group relative ${
                     mapMode === mode.id ? "bg-blue-600 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                   }`}
                 >
                   <mode.icon className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block absolute right-full mr-4 bg-black/80 px-3 py-2 rounded-lg whitespace-nowrap">
                     {mode.label} Mode
                   </span>
                 </button>
               ))}
             </div>

             <button className="p-4 glass-dark border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all shadow-2xl mt-4">
               <Maximize2 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Cinematic Timeline Slider */}
      <TimelineControl 
        times={Array.from({length: 24}, (_, i) => `${i}:00 UTC`)}
        index={timelineIndex}
        setIndex={setTimelineIndex}
        playing={playing}
        setPlaying={setPlaying}
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
};

export default OceanMap;
