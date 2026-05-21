"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { TimelineControl } from "@/components/map/TimelineControl";
import { LayerPanel } from "@/components/map/LayerPanel";

// Dynamic import for DisasterMap to avoid SSR issues
const DisasterMap = dynamic(
  () => import("@/components/DisasterMap").then((mod) => mod.DisasterMap),
  { ssr: false }
);

export function MapExperience() {
  const [panelState, setPanelState] = useState({
    satellite: false,
    heatmap: false,
    layers: { csvWeather: false, tsunami: false, cyclone: false, sst: false, tideSwell: false, mooredBuoy: false, flood: false, aqi: false },
  });
  
  const [timeline, setTimeline] = useState({ index: 0, playing: false, speed: 2 });

  const { data: incoisData } = useSWR("/api/weather/csv-data", fetcher, {
    refreshInterval: 30000,
  });

  const { data: sstCsvData } = useSWR("/api/weather/sst-csv", fetcher, {
    refreshInterval: 30000,
  });

  const { data: sstNetcdfData } = useSWR("/api/incois/sst", fetcher, {
    refreshInterval: 60000,
  });

  const currentFrame = useMemo(() => {
    if (!incoisData?.data) return null;
    return incoisData.data[timeline.index % incoisData.data.length];
  }, [incoisData, timeline.index]);

  const currentSst = useMemo(() => {
    // Priority 1: NetCDF median anomaly if available and SST layer is on
    if (panelState.layers.sst && sstNetcdfData?.medianAnomaly !== undefined) {
        return { sst: sstNetcdfData.medianAnomaly, source: "NetCDF" };
    }
    // Priority 2: CSV data
    if (!sstCsvData?.data) return null;
    return sstCsvData.data[timeline.index % sstCsvData.data.length];
  }, [sstCsvData, sstNetcdfData, timeline.index, panelState.layers.sst]);

  const setLayer = (layerId) => {
    console.log("Toggling layer:", layerId);
    setPanelState(prev => {
      // Create a new layers object where all values are false
      const newLayers = Object.keys(prev.layers).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      
      // If the clicked layer wasn't previously active, turn it on
      if (!prev.layers[layerId]) {
        newLayers[layerId] = true;
      }

      return { ...prev, layers: newLayers };
    });
  };

  const setSatellite = (val) => setPanelState(p => ({ ...p, satellite: val }));

  // Simulate INCOIS alerts based on the model if needed
  const incoisLike = useMemo(() => {
    const alerts = incoisData?.alerts || [];
    // If cyclone layer is active and no cyclone alert exists, simulate one in Bay of Bengal
    if (panelState.layers.cyclone && !alerts.some(a => a.type.toLowerCase().includes("cyclone"))) {
        alerts.push({
            type: "CYCLONE",
            severity: "HIGH",
            latitude: 15.5,
            longitude: 88.2,
            description: "Simulated Model Vortex"
        });
    }
    return {
      currentFrame,
      currentSst,
      alerts
    };
  }, [currentFrame, currentSst, incoisData, panelState.layers.cyclone]);

  return (
    <main className="relative flex h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-white/90 to-transparent dark:from-zinc-950/90 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
            Oceanic <span className="text-indigo-600">Viz</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Live Indian Ocean Monitoring
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Layer Panel */}
        <LayerPanel 
          layers={panelState.layers} 
          setLayer={setLayer}
          satellite={panelState.satellite}
          setSatellite={setSatellite}
        />

        {/* Map Container */}
        <div className="flex-1 relative">
          <DisasterMap 
            incois={incoisLike} 
            controls={{
              satellite: panelState.satellite,
              layers: {
                csvWeather: panelState.layers.csvWeather,
                tsunami: panelState.layers.tsunami,
                cyclone: panelState.layers.cyclone,
                sst: panelState.layers.sst,
                tideSwell: panelState.layers.tideSwell,
                mooredBuoy: panelState.layers.mooredBuoy,
                flood: panelState.layers.flood
              },
              setLayers: () => {},
              onSelectAlert: () => {},
              timelineIndex: timeline.index
            }}
          />
        </div>
      </div>

      {/* Timeline Controls */}
      <TimelineControl 
        times={incoisData?.data?.map(d => d.time)}
        index={timeline.index}
        setIndex={(val) => setTimeline(prev => ({ ...prev, index: val }))}
        playing={timeline.playing}
        setPlaying={(val) => setTimeline(prev => ({ ...prev, playing: val }))}
        speed={timeline.speed}
        setSpeed={(val) => setTimeline(prev => ({ ...prev, speed: val }))}
      />
    </main>
  );
}
