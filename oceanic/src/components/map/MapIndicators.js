import React from "react";
import { motion } from "framer-motion";
import { Waves, Thermometer, Droplets, ArrowUpCircle, Activity, Wind } from "lucide-react";

/**
 * MapIndicators displays high-fidelity real-time metrics in separate, professional cards.
 * Now supports 'horizontal' and 'vertical' layouts for workspace integration.
 */
export function MapIndicators({ telemetry, layout = "horizontal" }) {
  // Filter for Indian nodes (Mumbai, Chennai, Kochi, etc.)
  const indianNodes = telemetry?.filter(node => 
    ["Mumbai", "Chennai", "Kochi", "Vizag", "Mangalore"].includes(node.location)
  ) || [];

  const activeNode = indianNodes[0] || telemetry?.[0] || { temp: 28.4, salinity: 35.1, currentVelocity: 0.8, tideLevel: 1.2 };

  const metrics = [
    {
      id: "waveHeight",
      label: "Wave Height",
      value: telemetry?.[0]?.waveHeight || 1.2,
      unit: "m",
      icon: Waves,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      id: "windSpeed",
      label: "Wind Speed",
      value: telemetry?.[0]?.windSpeed || 14.5,
      unit: "kn",
      icon: Wind,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      id: "temp",
      label: "Sea Temp",
      value: telemetry?.[0]?.temp || 28.4,
      unit: "°C",
      icon: Thermometer,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    },
    {
      id: "salinity",
      label: "Salinity",
      value: telemetry?.[0]?.salinity || 35.2,
      unit: "psu",
      icon: Droplets,
      color: "text-[#4C9AFF]",
      bg: "bg-[#4C9AFF]/10",
      border: "border-[#4C9AFF]/20"
    }
  ];

  return (
    <div className={`grid ${layout === "vertical" ? "grid-cols-1 gap-4" : "grid-cols-2 md:grid-cols-4 gap-4"}`}>
      {metrics.map((metric) => (
        <motion.div 
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 glass-dark ${metric.bg} ${metric.border} border rounded-2xl flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl group`}
        >
          <div className={`p-3 rounded-xl ${metric.bg} group-hover:scale-110 transition-transform`}>
            <metric.icon className={`w-5 h-5 ${metric.color}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{metric.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}</span>
              <span className={`text-[10px] font-black ${metric.color}`}>{metric.unit}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
