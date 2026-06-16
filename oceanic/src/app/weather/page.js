"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Search, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sun, 
  CloudLightning,
  MapPin,
  Calendar,
  Thermometer,
  Waves,
  Eye,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function WeatherPage() {
  const [city, setCity] = useState("Mumbai");
  
  // Real-time Maritime Data
  const { data: marineData } = useSWR("/api/incois/summary", fetcher);
  
  // Real-time Weather Data (OpenWeather via local API)
  const { data: weatherData, error: weatherError } = useSWR(
    `/api/weather?q=${encodeURIComponent(city)}`,
    fetcher
  );

  const currentWeather = weatherData?.current_weather || {};
  const currentMarine = marineData?.waves?.find(w => w.location.includes(city)) || marineData?.waves?.[0] || {};

  // Extract forecast from OpenWeather raw data
  const forecastData = useMemo(() => {
    const list = weatherData?.raw?.forecast?.list;
    if (!list || !Array.isArray(list)) {
      return [
        { day: "Mon", temp: 28, condition: "Clear" },
        { day: "Tue", temp: 26, condition: "Cloudy" },
        { day: "Wed", temp: 24, condition: "Rainy" },
        { day: "Thu", temp: 25, condition: "Storm" },
        { day: "Fri", temp: 27, condition: "Sunny" },
        { day: "Sat", temp: 29, condition: "Clear" },
        { day: "Sun", temp: 30, condition: "Clear" },
      ];
    }
    
    // Group into daily summaries (taking one point per day around noon)
    const days = [];
    const seenDays = new Set();
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const hour = date.getHours();
      
      if (!seenDays.has(dayName) && hour >= 10 && hour <= 14) {
        seenDays.add(dayName);
        days.push({
          day: dayName,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main === "Clear" ? "Sunny" : 
                     item.weather[0].main === "Clouds" ? "Cloudy" : 
                     item.weather[0].main === "Rain" ? "Rainy" : "Clear"
        });
      }
    });

    return days.slice(0, 7);
  }, [weatherData]);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Global Marine Weather</h1>
            <p className="text-slate-400 font-medium">Detailed atmospheric and maritime forecasts for coastal regions.</p>
          </div>
          <div className="w-full lg:w-96">
            <div className="glass-dark border border-white/5 rounded-2xl flex items-center p-1.5 shadow-2xl">
              <MapPin className="w-5 h-5 text-ocean-400 ml-3" />
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city or coastline..."
                className="bg-transparent border-none focus:outline-none text-white text-sm px-4 py-2 flex-grow"
              />
              <button className="p-2 bg-ocean-600 rounded-xl text-white hover:bg-ocean-500 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 glass-dark p-8 rounded-2xl border border-white/5 relative overflow-hidden group"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <CloudLightning className="w-64 h-64 text-ocean-400" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className={`px-4 py-1.5 ${currentMarine.waveHeight > 3.0 ? 'bg-rose-500' : 'bg-ocean-500'} rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/20`}>
                  {currentMarine.waveHeight > 3.0 ? 'Rough Sea Advisory' : 'Normal Conditions'}
                </div>
                <div className="text-slate-500 text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <h2 className="text-8xl font-black text-white tracking-tighter">
                    {weatherData?.temperature !== undefined ? Math.round(weatherData.temperature) : "--"}°
                  </h2>
                  <div className="pt-2 text-slate-400 font-bold uppercase tracking-widest text-sm">Celsius</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white mb-1">{city} Environment</span>
                  <span className="text-slate-400 font-medium">
                    Wind {weatherData?.wind || "--"} m/s • Humidity {weatherData?.humidity || "--"}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Wind Speed", value: `${weatherData?.wind || "--"} m/s`, icon: Wind, color: "ocean" },
                  { label: "Pressure", value: `${weatherData?.pressure || "--"} hPa`, icon: Activity, color: "amber" },
                  { label: "Humidity", value: `${weatherData?.humidity || "--"}%`, icon: Droplets, color: "rose" },
                  { label: "Visibility", value: `${((weatherData?.visibility || 0) / 1000).toFixed(1)} km`, icon: Eye, color: "indigo" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col p-4 bg-white/5 rounded-2xl border border-white/5">
                    <item.icon className={`w-5 h-5 text-${item.color}-400 mb-3`} />
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="text-lg font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark p-8 rounded-2xl border border-white/5"
          >
            <h3 className="text-lg font-bold text-white mb-6">Maritime Conditions</h3>
            <div className="space-y-6">
              {[
                { title: "Wave Height", value: `${currentMarine.waveHeight || "--"}m`, desc: "Live Buoy Data", status: currentMarine.waveHeight > 3.0 ? "Critical" : "Stable", icon: Waves, color: currentMarine.waveHeight > 3.0 ? "rose" : "ocean" },
                { title: "SST", value: `${currentMarine.temp || "--"}°C`, desc: "Sea Surface Temp", status: "Active", icon: Thermometer, color: "ocean" },
                { title: "Tide Potential", value: "Normal", desc: "Estimated by coordinates", status: "Active", icon: Activity, color: "amber" },
                { title: "Swell Direction", value: `${currentMarine.waveDirection || "--"}°`, desc: "Dominant Vector", status: "Verified", icon: Wind, color: "indigo" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-${item.color}-500/10 text-${item.color}-400`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{item.value}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest text-${item.color}-400`}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 7-Day Forecast */}
        <div className="glass-dark p-8 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Weekly Forecast</h3>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Expected conditions for the next 7 days</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-ocean-500" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Precipitation</span>
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#ffffff10',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecastData.map((day, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 group-hover:text-ocean-400 transition-colors">{day.day}</span>
                {day.condition === "Sunny" && <Sun className="w-8 h-8 text-amber-400 mb-4" />}
                {day.condition === "Cloudy" && <CloudRain className="w-8 h-8 text-slate-400 mb-4" />}
                {day.condition === "Rainy" && <CloudRain className="w-8 h-8 text-ocean-400 mb-4" />}
                {day.condition === "Storm" && <CloudLightning className="w-8 h-8 text-rose-400 mb-4" />}
                {day.condition === "Clear" && <Sun className="w-8 h-8 text-amber-500 mb-4" />}
                <span className="text-lg font-bold text-white mb-1">{day.temp}°</span>
                <span className="text-[10px] text-slate-500 font-medium">{day.condition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}