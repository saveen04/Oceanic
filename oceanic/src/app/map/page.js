"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import OceanMap from "@/components/map/OceanMap";
import { 
  Layers, 
  Map as MapIcon, 
  Satellite, 
  ShieldAlert, 
  Activity,
  Wind,
  Maximize2,
  Navigation
} from "lucide-react";
import { motion } from "framer-motion";

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Interactive Intelligence Map</h1>
            <p className="text-slate-400 font-medium">Real-time GIS visualization of global ocean conditions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 glass-dark border border-white/5 rounded-xl text-xs font-bold text-ocean-400">
              <div className="w-1.5 h-1.5 rounded-full bg-ocean-400 animate-pulse" />
              Live GIS Feed Active
            </div>
          </div>
        </div>

        <OceanMap />
      </div>
    </DashboardLayout>
  );
}
