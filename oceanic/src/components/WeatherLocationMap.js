"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix marker icons in Next.js */
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export function WeatherLocationMap({ lat, lon, label }) {

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const [satellite, setSatellite] = useState(true);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const labelIcon = useMemo(
    () => createLabelIcon(label || "Selected location"),
    [label]
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">

      {/* MAP TYPE TOGGLE */}
      <div className="absolute left-3 top-3 z-[1000] flex gap-2">

        <button
          onClick={() => setSatellite((v) => !v)}
          className="rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold shadow backdrop-blur dark:bg-zinc-900/80"
        >
          {satellite ? "Satellite" : "Map"}
        </button>

      </div>

      <MapContainer
        key={`${lat}-${lon}-${satellite}`}
        center={[lat, lon]}
        zoom={9}
        scrollWheelZoom
        className="h-full w-full"
      >

        {/* SATELLITE OR NORMAL MAP */}

        {satellite ? (

          mapboxToken ? (

            <TileLayer
              attribution="&copy; Mapbox"
              url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`}
            />

          ) : (

            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

          )

        ) : (

          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        )}

        {/* FIX MAP RESIZE */}
        <EnsureMapSized />

        {/* LOCATION LABEL */}
        <Marker position={[lat, lon]} icon={labelIcon} interactive={false} />

        {/* LOCATION PIN */}
        <Marker position={[lat, lon]}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">Location</div>
              <div>{label || `${lat}, ${lon}`}</div>
            </div>
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}

/* FIX MAP RESIZE INSIDE FLEX/GRID */

function EnsureMapSized() {
  const map = useMap();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => cancelAnimationFrame(id);
  }, [map]);

  return null;
}

/* CUSTOM LABEL ICON */

function createLabelIcon(text) {

  const safe = String(text).slice(0, 60);

  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    html: `
      <div style="
        transform: translate(-50%, -42px);
        white-space: nowrap;
        font-size: 12px;
        font-weight: 700;
        color: white;
        background: rgba(0,0,0,0.65);
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(6px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      ">
        ${escapeHtml(safe)}
      </div>
    `,
  });
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}