"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import { useMap, useMapEvents } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import { 
  Layers, 
  Maximize2, 
  Navigation, 
  Activity, 
  ShieldAlert, 
  Wind as WindIcon, 
  AlertTriangle, 
  Search, 
  Crosshair, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Zap
} from "lucide-react";

// ---------------- GIS Components ----------------
import { GISControlCenter } from "./GISControlCenter";
import { ContextIntelligence } from "./ContextIntelligence";
import { CommandPalette } from "./CommandPalette";
import { TimelineControl } from "./TimelineControl";
import { MaritimeHeatmap } from "./MaritimeHeatmap";
import { TelemetryLayer } from "./TelemetryLayer";
import { WindParticles } from "./WindParticles";
import { CurrentStreamlines } from "./CurrentStreamlines";
import { VectorFieldLayer } from "./VectorFieldLayer";

// Dynamic Tsunami Layer (Created in next step)
const TsunamiLayer = dynamic(() => import("./TsunamiLayer").then(mod => mod.TsunamiLayer), { ssr: false });

// ---------------- Dynamic Leaflet Core ----------------
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

const OceanMap = () => {
  const { data: telemetryData } = useSWR("/api/incois/summary", fetcher, { refreshInterval: 30000 });

  const [mounted, setMounted] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapMode, setMapMode] = useState("satellite"); // Default to high-fidelity satellite
  
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [layers, setLayers] = useState({
    wave: true,
    wind: true,
    current: true,
    tsunami: true, // New Tsunami Layer
    sst: false,
    salinity: false,
    cyclone: false,
    swell: false,
    shipping: false
  });

  useEffect(() => { setMounted(true); }, []);

  const toggleLayer = (id) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      switch(e.key.toLowerCase()) {
        case 'l': setLeftSidebarOpen(prev => !prev); break;
        case 'f': {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const latlng = e.latlng;
        setSelectedLocation({
          name: "Marine Intelligence Point",
          lat: latlng.lat,
          lng: latlng.lng,
          telemetry: telemetryData?.waves?.[0] || {}
        });
        setRightSidebarOpen(true);
      }
    });
    return null;
  };

  if (!mounted) return (
    <div className="w-full h-full bg-[#050B14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Syncing Planet Grids...</span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden bg-[#050B14] flex flex-col shadow-2xl">
      
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Control Center (Dark/Glass) */}
        <AnimatePresence>
          {leftSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="z-[2000] relative border-r border-white/5 h-full bg-[#050B14]/80 backdrop-blur-2xl"
            >
              <GISControlCenter 
                layers={layers} 
                toggleLayer={toggleLayer} 
              />
              
              <button 
                onClick={() => setLeftSidebarOpen(false)}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050B14] border border-white/10 flex items-center justify-center text-white/40 hover:text-white z-[3000] shadow-xl backdrop-blur-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!leftSidebarOpen && (
          <button 
            onClick={() => setLeftSidebarOpen(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050B14] border border-white/10 flex items-center justify-center text-white/40 hover:text-white z-[2000] shadow-xl backdrop-blur-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Primary Map Engine */}
        <div className="flex-1 relative bg-[#050B14] z-0">
          <MapContainer 
            center={[15, 80]} 
            zoom={5} 
            style={{ height: "100%", width: "100%", background: "#050B14" }}
            zoomControl={false}
          >
            <MapClickHandler />
            
            <TileLayer
              attribution='&copy; ESRI &copy; CARTO'
              url={mapMode === "satellite" 
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              }
            />

            {/* Core Intelligence Layers */}
            {layers.sst && <MaritimeHeatmap type="sst" visible={layers.sst} data={telemetryData?.waves} />}
            {layers.salinity && <MaritimeHeatmap type="salinity" visible={layers.salinity} data={telemetryData?.waves} />}
            
            {/* Dynamic Vector Layers */}
            {layers.wind && <WindParticles visible={layers.wind} data={telemetryData?.waves} speedMultiplier={speed * 0.5} mapMode={mapMode} />}
            {layers.current && <CurrentStreamlines visible={layers.current} data={telemetryData?.waves} speedMultiplier={0.8} mapMode={mapMode} />}
            
            {layers.swell && <VectorFieldLayer type="swell" visible={layers.swell} spacing={1.5} />}

            {/* Tsunami Monitoring (New) */}
            {layers.tsunami && <TsunamiLayer data={telemetryData?.tsunami} visible={layers.tsunami} />}

            {/* Telemetry Hubs */}
            <TelemetryLayer data={telemetryData?.waves} type="wave" visible={layers.wave} />

            {layers.cyclone && (
              <Polyline 
                positions={[[10, 86], [12, 87], [15, 88.5], [17.5, 90], [20, 91.5]]} 
                pathOptions={{ color: '#f43f5e', weight: 2, dashArray: '8, 8' }} 
              />
            )}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-3">
             <div className="flex flex-col gap-2 p-2 bg-[#050B14]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl">
                <button 
                  onClick={() => setMapMode(prev => prev === "normal" ? "satellite" : "normal")}
                  className={`p-3 rounded-xl transition-all ${mapMode === "satellite" ? "bg-blue-600 text-white" : "text-white/40 hover:bg-white/5"}`}
                  title="Toggle Satellite"
                >
                   <Layers className="w-5 h-5" />
                </button>
                <div className="h-px bg-white/5 mx-2" />
                <button 
                  className="p-3 hover:bg-white/5 rounded-xl text-emerald-400/50 hover:text-emerald-400 transition-colors"
                  title="Situational Reset"
                  onClick={() => setMounted(false)}
                >
                   <Navigation className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Context Intelligence: Right Sidebar (Dark/Glass) */}
        <AnimatePresence>
          {rightSidebarOpen && (
            <ContextIntelligence 
              visible={rightSidebarOpen}
              selectedLocation={selectedLocation}
              telemetry={telemetryData?.waves}
              onClose={() => setRightSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Timeline Control */}
      <div className="flex-none z-[1000] border-t border-white/5 bg-[#050B14]">
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
    </div>
  );
};

export default OceanMap;