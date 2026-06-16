"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NeuralSupportHub } from "@/components/dashboard/NeuralSupportHub";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, 
  Search, 
  BookOpen, 
  ArrowUpRight, 
  Loader2, 
  Wind, 
  Anchor, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Camera,
  MapPin,
  Globe
} from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function CoastalLifestylePage() {
  const [searchTerm, setSearchTerm] = useState("Indian Ocean");
  const [selectedResult, setSelectedResult] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Use the new MediaWiki REST API for search (limit 20)
  const { data: searchData, error: searchError, isLoading } = useSWR(
    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(searchTerm)}&limit=20`,
    fetcher
  );

  const getAIInsight = async (text, context) => {
    setAiLoading(true);
    try {
      const resp = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context })
      });
      const result = await resp.json();
      setAiInsight(result.insight || "No tactical perspective available.");
    } catch (err) {
      setAiInsight("Neural link failure: Could not generate situational insight.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResult?.excerpt) {
      getAIInsight(selectedResult.excerpt.replace(/<[^>]*>?/gm, ''), selectedResult.title);
    }
  }, [selectedResult]);

  return (
    <DashboardLayout>
      <div className="max-w-[1700px] mx-auto space-y-12 pb-32 relative">
        {/* Page Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-1 bg-blue-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400">Node Hub 04 // Discovery Grid</span>
          </div>
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <h1 className="text-7xl md:text-9xl font-operational text-white uppercase italic leading-[0.8] tracking-tighter">
              Coastal <span className="text-white/20">Lifestyle</span> <br /> & Neural Discovery
            </h1>
            <div className="relative w-full xl:w-[500px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search global maritime knowledge..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all backdrop-blur-3xl shadow-2xl"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Discovery Hub (Restored to Legacy Prominence) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-dark p-12 rounded-[64px] border border-white/10 relative overflow-hidden bg-[#0a1016]/80 shadow-3xl"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Intelligence Node</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Linked to Multi-Vector REST API</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-[24px] border border-white/5 backdrop-blur-md">
                  {["Indian Ocean", "Coastal Life", "Mangrove", "Artisanal Fishing", "Tsunami History"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
                        searchTerm === tag 
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discovery Content */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <motion.h4 
                      key={selectedResult?.title || searchTerm}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-6xl font-operational text-white tracking-tighter uppercase italic leading-[0.9] border-l-8 border-blue-600 pl-8"
                    >
                      {selectedResult?.title || searchTerm}
                    </motion.h4>
                    <p className="text-xl text-slate-300 font-bold leading-relaxed italic border-b border-white/5 pb-10 pr-4">
                      {selectedResult?.excerpt?.replace(/<[^>]*>?/gm, '') || "Initializing situational neural link to maritime discovery node..."}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => window.open(`https://en.wikipedia.org/wiki/${selectedResult?.title || searchTerm}`, "_blank")}
                      className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-[20px] text-[12px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                      Full Report <ArrowUpRight className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-4 px-8 py-5 glass-premium rounded-[20px] text-[12px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition-all">
                      Archive Node <Anchor className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[4/5] rounded-[52px] overflow-hidden border-2 border-white/10 bg-slate-900 shadow-3xl group">
                  {selectedResult?.thumbnail?.url ? (
                    <img 
                      src={selectedResult.thumbnail.url.replace('60px', '400px')} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000 ease-out" 
                      alt="Intelligence Asset" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 italic">Decrypting Asset...</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1016] via-transparent to-transparent opacity-90" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Neural & Grid Column */}
          <div className="space-y-8">
            {/* Discovery Grid Grid Selection (Mini) */}
            <div className="glass-dark p-8 rounded-[40px] border border-white/5 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic px-2">Discovery Node Selection</h4>
               <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                 {searchData?.pages?.map((page, i) => (
                   <div 
                     key={page.key} 
                     onClick={() => setSelectedResult(page)}
                     className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                       selectedResult?.key === page.key ? 'border-blue-500 scale-95 shadow-lg shadow-blue-500/20' : 'border-white/5 hover:border-white/20'
                     }`}
                   >
                     {page.thumbnail?.url ? (
                        <img src={page.thumbnail.url} className="w-full h-full object-cover" alt="Node" />
                     ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[8px] text-slate-700 font-bold uppercase">{page.title}</div>
                     )}
                   </div>
                 ))}
               </div>
            </div>

            {/* AI Neural Perspective Node */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark p-10 rounded-[48px] border border-white/10 bg-gradient-to-br from-blue-900/10 to-transparent relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Validation</h3>
                  </div>
                  {aiLoading && <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />}
                </div>

                <div className="space-y-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block border-b border-white/5 pb-2">Tactical Perspective</span>
                   <p className="text-lg font-bold text-slate-300 italic leading-relaxed">
                     "{aiInsight || "Awaiting neural validation of maritime data clusters..."}"
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Neural Support Hub */}
        <NeuralSupportHub />
      </div>
    </DashboardLayout>
  );
}
