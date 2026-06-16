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
import { Logo } from "../Logo";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Intelligence", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Ocean GIS", icon: Map, href: "/map" },
    { name: "Marine Weather", icon: CloudRain, href: "/weather" },
    { name: "Coastal Lifestyle", icon: Waves, href: "/coastal-lifestyle" },
    { name: "Disaster Response", icon: Activity, href: "/disasters" },
    { name: "Emergency Hub", icon: ShieldAlert, href: "/emergency" },
    { name: "Global Alerts", icon: Bell, href: "/alerts" },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 300 }}
      className="h-screen bg-[#070b0f] border-r border-white/5 flex flex-col z-50 sticky top-0 shadow-2xl"
    >
      {/* Brand Header */}
      <div className="h-24 flex items-center px-4 overflow-hidden">
        <Link href="/dashboard" className="w-full">
          <Logo collapsed={collapsed} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all group relative ${
                  isActive 
                    ? "text-blue-400 font-bold" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-400" : "group-hover:text-blue-300"}`} />
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
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="/settings">
          <motion.div 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${pathname === '/settings' ? 'text-white' : 'text-slate-500 hover:text-white'}`}
          >
            <Settings className="w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform" />
            {!collapsed && <span className="text-[11px] font-bold uppercase tracking-widest">Settings</span>}
          </motion.div>
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
