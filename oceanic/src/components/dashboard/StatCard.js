"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({ title, value, unit, trend, icon: Icon, color, delay = 0 }) => {
  const colorMap = {
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    ocean: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-[20px] transition-all duration-500 group-hover:scale-110 ${colorMap[color] || 'text-white bg-white/10'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-light text-white tracking-tighter">{value}</h3>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{unit}</span>
        </div>
      </div>

      {/* Cinematic subtle glow */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 opacity-20 blur-3xl rounded-full transition-all duration-700 group-hover:scale-125 group-hover:opacity-30 ${color === 'rose' ? 'bg-rose-500' : color === 'ocean' ? 'bg-blue-500' : 'bg-indigo-500'}`} />
    </motion.div>
  );
};
