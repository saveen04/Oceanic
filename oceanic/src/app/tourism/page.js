"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Hotel, 
  Palmtree, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Search,
  Compass,
  Waves,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const RESORTS = [
  { 
    name: "Azure Bay Resort", 
    location: "Goa, India", 
    price: "$240", 
    rating: 4.9, 
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800",
    tags: ["Private Beach", "Luxury"]
  },
  { 
    name: "Coral Reef Suites", 
    location: "Maldives", 
    price: "$580", 
    rating: 5.0, 
    img: "https://images.unsplash.com/photo-1573843225233-6f36ee0c3451?auto=format&fit=crop&q=80&w=800",
    tags: ["Overwater", "Eco-Friendly"]
  },
  { 
    name: "The Maritime Grand", 
    location: "Dubai, UAE", 
    price: "$310", 
    rating: 4.8, 
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    tags: ["Skyline View", "Spa"]
  },
  { 
    name: "Oceania Haven", 
    location: "Bali, Indonesia", 
    price: "$190", 
    rating: 4.7, 
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    tags: ["Yoga", "Nature"]
  }
];

const PLACES = [
  { name: "Blue Lagoon Cave", type: "Geological", distance: "4.2km", icon: Compass },
  { name: "Sunset Horizon Point", type: "Scenic", distance: "1.8km", icon: Palmtree },
  { name: "Marine Bio-Reserve", type: "Educational", distance: "12km", icon: Waves },
];

export default function TourismPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <Palmtree className="text-blue-500 w-6 h-6" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Maritime Lifestyle // Explorer</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              Coastal <span className="text-blue-600 not-italic">Lifestyle</span>
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide max-w-xl">
              Curated maritime retreats and professional tourism spots for the global coastal voyager.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="glass-dark border border-white/5 rounded-2xl p-1.5 flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                   <Calendar className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black uppercase text-white/60">Check Dates</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                   <Users className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black uppercase text-white/60">2 Guests</span>
                </div>
                <button className="px-6 py-2.5 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                  Search Grids
                </button>
             </div>
          </div>
        </div>

        {/* Resort Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {RESORTS.map((resort, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                <img src={resort.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={resort.name} />
                <div className="absolute top-4 left-4 flex gap-2">
                  {resort.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-white border border-white/10 tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 px-4 py-2 rounded-xl text-xs font-black text-white shadow-xl">
                  {resort.price}/nt
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{resort.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-500" /> {resort.rating}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                  <MapPin className="w-3 h-3" /> {resort.location}
                </div>
                <button className="w-full py-4 bg-white/5 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2">
                  Initialize Booking <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tourism Explorer Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch pt-10">
          <div className="lg:col-span-8 glass-dark p-10 rounded-2xl border border-white/5 flex flex-col justify-center gap-6 overflow-hidden relative">
            <div className="absolute right-0 top-0 p-10 opacity-5">
              <Compass className="w-96 h-96 text-white" />
            </div>
            <div className="relative z-10 w-full max-w-lg">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-4 block">Spatial Discovery</span>
              <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-6">
                Explore Nearby <br /> Professional <span className="text-blue-600 not-italic">Tourism Grids</span>
              </h2>
              <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                The Oceanic engine identifies local marine bio-reserves, scenic viewpoints, and heritage coastal sites using real-time spatial intelligence.
              </p>
              <div className="flex items-center gap-4">
                <button className="px-8 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                  Launch Explorer
                </button>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a1016] overflow-hidden bg-slate-800">
                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-white/30 font-bold">+ 1.2k Explored Today</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 glass p-10 rounded-2xl border border-white/5 space-y-8">
            <h3 className="text-sm font-black uppercase text-white tracking-widest">Recommended Spots</h3>
            <div className="space-y-4">
              {PLACES.map((place, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-blue-600/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <place.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">{place.name}</p>
                      <p className="text-[10px] text-white/30 font-black uppercase">{place.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-blue-500">{place.distance}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 mt-1" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 glass border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
              View All Hotspots
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
