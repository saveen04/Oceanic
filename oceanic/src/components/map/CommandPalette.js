"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Map, Layers, Zap, X } from "lucide-react";

/**
 * CommandPalette provides a Ctrl + K interface for rapid workspace actions.
 */
export function CommandPalette({ isOpen, onClose, onAction }) {
  const [query, setQuery] = useState("");

  const actions = [
    { id: "goto-mumbai", name: "Go to Mumbai Hub", icon: Map, category: "Navigation" },
    { id: "goto-chennai", name: "Go to Chennai Station", icon: Map, category: "Navigation" },
    { id: "toggle-wind", name: "Toggle Wind Streams", icon: Layers, category: "Layers" },
    { id: "toggle-currents", name: "Toggle Ocean Currents", icon: Layers, category: "Layers" },
    { id: "api-refresh", name: "Force API Refresh", icon: Zap, category: "System" },
  ];

  const filtered = actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-xl glass-dark-heavy border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
            <Search className="w-5 h-5 text-blue-400" />
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white font-bold placeholder:text-white/20 text-lg"
              placeholder="Search locations, layers, or assets..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-white/40 uppercase">
              <Command className="w-3 h-3" />
              K
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filtered.length > 0 ? (
              <div className="space-y-4 p-2">
                {["Navigation", "Layers", "System"].map(cat => (
                  <div key={cat} className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-white/20 tracking-widest pl-4">{cat}</h5>
                    {filtered.filter(a => a.category === cat).map(action => (
                      <button
                        key={action.id}
                        onClick={() => { onAction(action.id); onClose(); }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-blue-600/20 rounded-2xl transition-all group border border-transparent hover:border-blue-500/30"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <action.icon className="w-5 h-5 text-white/40 group-hover:text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover:text-white">{action.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center gap-4 text-white/20">
                <X className="w-12 h-12" />
                <span className="text-xs font-black uppercase tracking-widest">No matching results</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest bg-black/20">
             <span>↑↓ to navigate</span>
             <span>Enter to select</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
