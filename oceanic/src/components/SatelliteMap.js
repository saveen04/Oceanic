"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

import HeatmapLayer from "./HeatmapLayer";

export default function SatelliteMap() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("satellite"); // satellite, street, sst
  const [sstData, setSstData] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetch("/api/incois/sst").then(res => res.json()).then(data => {
      if (Array.isArray(data)) setSstData(data);
    });
    
    // Fix leaflet icon issue
    import("leaflet").then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    });
  }, []);

  if (!mounted) return <div className="h-full w-full bg-zinc-100 animate-pulse rounded-3xl" />;

  const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-inner bg-zinc-900">
      <MapContainer 
        center={[15.5937, 78.9629]} 
        zoom={4} 
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          url={view === "street" ? streetUrl : satelliteUrl}
          attribution='&copy; ESRI Imagery'
        />

        {view === "sst" && sstData.length > 0 && (
          <HeatmapLayer
            points={sstData.map(p => [p.lat, p.lng, p.temp])}
            options={{
              radius: 30,
              blur: 15,
              max: 35,
              minOpacity: 0.7,
              gradient: {
                0.4: 'rgba(0, 0, 255, 0.5)',
                0.6: 'rgba(0, 255, 255, 0.6)',
                0.7: 'rgba(0, 255, 0, 0.7)',
                0.8: 'rgba(255, 255, 0, 0.8)',
                1.0: 'rgba(255, 0, 0, 1)'
              }
            }}
          />
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button 
          onClick={() => setView("satellite")}
          className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md transition ${view === "satellite" ? "bg-blue-600 text-white" : "bg-white/90 text-zinc-900"}`}
        >
          Satellite
        </button>
        <button 
          onClick={() => setView("street")}
          className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md transition ${view === "street" ? "bg-blue-600 text-white" : "bg-white/90 text-zinc-900"}`}
        >
          Street
        </button>
        <button 
          onClick={() => setView("sst")}
          className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md transition ${view === "sst" ? "bg-blue-600 text-white" : "bg-white/90 text-zinc-900"}`}
        >
          SST Heatmap
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-[400] rounded-xl bg-zinc-950/80 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)] ${view === "sst" ? "bg-red-500" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-black uppercase tracking-wider text-white">
            {view === "sst" ? "Live Thermal Monitoring" : "Live Satellite Feed"}
          </span>
        </div>
      </div>
    </div>
  );
}
