"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Logo = ({ className = "", collapsed = false }) => {
  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="relative group shrink-0">
        <motion.div 
          className="w-10 h-10 bg-transparent flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(72,154,255,0.4)]"
          animate={{ 
            y: [0, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="/logo-oceanic-removebg-preview.png" 
            alt="Oceanic Logo" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex flex-col whitespace-nowrap overflow-hidden"
          >
            <span className="text-xl font-black tracking-tight text-white leading-none uppercase italic">
              OCEANIC<span className="text-blue-500">AI</span>
            </span>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mt-0.5">
              Intelligence Hub
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
