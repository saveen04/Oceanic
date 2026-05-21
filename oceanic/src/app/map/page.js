"use client";

import { Map } from "lucide-react";

import { MapExperience } from "@/components/map/MapExperience";

export default function MapPage() {
  return (
    <main className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <Map size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Ocean OSF map</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Open‑Meteo hourly JSON → interactive layers + timeline animation + heatmaps.
            </p>
          </div>
        </div>
      </div>

      <MapExperience />
    </main>
  );
}

