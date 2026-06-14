"use client";

import React from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";

export const Logo = ({ className = "" }) => {
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="relative group">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-tr from-ocean-600 to-ocean-400 rounded-2xl flex items-center justify-center shadow-lg shadow-ocean-500/20 glow-border"
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Waves className="text-white w-7 h-7" />
        </motion.div>
        
        {/* Animated rings around logo */}
        <motion.div 
          className="absolute -inset-2 border border-ocean-400/20 rounded-[20px]"
          animate={{ scale: [1, 1.1, 1], rotate: 180 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -inset-4 border border-ocean-600/10 rounded-[24px]"
          animate={{ scale: [1.1, 1, 1.1], rotate: -180 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tight text-white leading-none">
          OCEANIC<span className="text-ocean-400">AI</span>
        </span>
        <span className="text-[10px] font-bold text-ocean-400/80 uppercase tracking-[0.2em]">
          Intelligence Hub
        </span>
      </div>
    </motion.div>
  );
};
