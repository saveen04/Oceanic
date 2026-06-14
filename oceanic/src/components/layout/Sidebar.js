"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  CloudRain, 
  BarChart3, 
  Bell, 
  Activity, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Waves,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: "Intelligence", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Ocean GIS", icon: Map, href: "/map" },
    { name: "Marine Weather", icon: CloudRain, href: "/weather" },
    { name: "Coastal Lifestyle", icon: Waves, href: "/tourism" },
    { name: "Disaster Response", icon: Activity, href: "/disasters" },
    { name: "Emergency Hub", icon: ShieldAlert, href: "/emergency" },
    { name: "Global Alerts", icon: Bell, href: "/alerts" },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-[#070b0f] border-r border-white/5 flex flex-col z-50 sticky top-0 shadow-2xl"
    >
      {/* Brand Header - Compact Jira Style */}
      <div className="h-20 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0747A6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Waves className="text-white w-6 h-6" />
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-black tracking-tighter text-white uppercase"
            >
              Oceanic<span className="text-[#4C9AFF]">AI</span>
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation - Icon Centric */}
      <nav className="flex-grow px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all group relative ${
                  isActive 
                    ? "bg-[#0747A6]/20 text-[#4C9AFF] font-bold" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#4C9AFF]" : "group-hover:text-blue-400"}`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-bold uppercase tracking-widest"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-[#0747A6] rounded-r-full shadow-[0_0_15px_rgba(7,71,166,0.8)]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer - Settings & Collapse */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="/settings">
          <div className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all group ${pathname === '/settings' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white'}`}>
            <Settings className="w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform" />
            {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest">Settings</span>}
          </div>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};
