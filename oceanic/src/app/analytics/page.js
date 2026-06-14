"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Waves, 
  Wind, 
  Thermometer,
  FileJson,
  FileText,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const oceanTrends = [
  { month: "Jan", temp: 24, waves: 2.1, wind: 15 },
  { month: "Feb", temp: 25, waves: 2.3, wind: 18 },
  { month: "Mar", temp: 26, waves: 2.5, wind: 20 },
  { month: "Apr", temp: 28, waves: 3.1, wind: 28 },
  { month: "May", temp: 29, waves: 3.8, wind: 42 },
  { month: "Jun", temp: 28, waves: 3.5, wind: 35 },
];

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "#10b981" },
  { name: "Moderate", value: 20, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#f43f5e" },
  { name: "Critical", value: 5, color: "#8b5cf6" },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Ocean Intelligence Analytics</h1>
            <p className="text-slate-400 font-medium">Historical trends, predictive modeling and risk distribution metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-dark border border-white/5 rounded-2xl p-1.5 flex items-center gap-1 shadow-2xl">
              <button className="px-4 py-2 bg-white/5 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Last 6 Months
              </button>
              <button className="px-4 py-2 text-slate-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-ocean-600 rounded-2xl text-white hover:bg-ocean-500 transition-all shadow-xl shadow-ocean-600/20 group">
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-dark p-8 rounded-2xl border border-white/5"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white">Multivariate Ocean Analytics</h3>
              <div className="flex items-center gap-4">
                <button className="text-[10px] uppercase tracking-widest font-black text-ocean-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Export PDF
                </button>
                <button className="text-[10px] uppercase tracking-widest font-black text-emerald-400 flex items-center gap-1">
                  <FileJson className="w-3 h-3" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={oceanTrends}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#ffffff20" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#ffffff10',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="waves" fill="url(#colorWave)" stroke="#0ea5e9" strokeWidth={3} />
                  <Bar dataKey="wind" barSize={30} fill="#6366f1" radius={[6, 6, 0, 0]} opacity={0.6} />
                  <Line type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={4} dot={{ r: 4, fill: '#f43f5e' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-dark p-8 rounded-2xl border border-white/5 flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-2">Global Risk Factor</h3>
            <p className="text-xs text-slate-500 font-medium mb-8">Spatial distribution of ocean hazards</p>
            
            <div className="h-[250px] w-full mb-8 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#ffffff10',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">85%</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Safe Index</span>
              </div>
            </div>

            <div className="space-y-4">
              {riskDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Predictive AI Model", desc: "Using LSTM networks to forecast wave surges 48h in advance.", icon: Activity, color: "ocean" },
            { title: "Seismic Correlation", desc: "Mapping submarine tectonic activity to tsunami potential.", icon: Waves, color: "amber" },
            { title: "Atmospheric Coupling", desc: "Analyzing air-sea interaction for cyclone intensification.", icon: Wind, color: "indigo" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/5 hover:border-ocean-500/30 transition-all group"
            >
              <div className={`p-4 rounded-2xl bg-${feature.color}-500/10 text-${feature.color}-400 mb-6 w-fit group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
