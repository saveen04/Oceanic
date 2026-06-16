"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Plus, 
  ChevronDown,
  AlertTriangle,
  User,
  Settings as SettingsIcon,
  CreditCard,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../Logo";

export const DashboardLayout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [firestoreError, setFirestoreError] = useState(null); // 'api' or 'rules' or null

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }

    // Listen for global Firestore errors
    const handleFirestoreError = (event) => {
      const msg = event.message || event.reason?.message || "";
      if (msg.includes("API has not been used") || msg.includes("disabled")) {
        setFirestoreError("api");
      } else if (msg.includes("insufficient permissions") || msg.includes("permission-denied")) {
        setFirestoreError("rules");
      }
    };

    window.addEventListener("unhandledrejection", handleFirestoreError);
    window.addEventListener("error", handleFirestoreError);
    
    return () => {
      window.removeEventListener("unhandledrejection", handleFirestoreError);
      window.removeEventListener("error", handleFirestoreError);
    };
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="h-screen w-full bg-[#0a1016] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a1016] text-white font-sans overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Firestore Permission Emergency Banner */}
        {firestoreError === "api" && (
          <div className="bg-amber-600 px-10 py-3 flex items-center justify-between gap-6 z-[100] animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-white" />
              <p className="text-[11px] font-black uppercase tracking-widest text-white">
                API Required: Firestore API is disabled. Enable it in Google Cloud Console.
              </p>
            </div>
            <a 
              href="https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=oceanic-app-68b60"
              target="_blank" rel="noopener noreferrer"
              className="px-4 py-1.5 bg-white text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors"
            >
              Enable API
            </a>
          </div>
        )}

        {firestoreError === "rules" && (
          <div className="bg-rose-600 px-10 py-3 flex items-center justify-between gap-6 z-[100] animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-white" />
              <p className="text-[11px] font-black uppercase tracking-widest text-white">
                Access Denied: Firestore Security Rules are blocking the connection.
              </p>
            </div>
            <a 
              href="https://console.firebase.google.com/project/oceanic-app-68b60/firestore/rules"
              target="_blank" rel="noopener noreferrer"
              className="px-4 py-1.5 bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors"
            >
              Update Security Rules
            </a>
          </div>
        )}

        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a1016]/80 backdrop-blur-3xl z-40 shrink-0">
          <div className="flex items-center gap-8 flex-grow max-w-6xl">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8 mr-2 italic">
              <Logo collapsed={true} />
            </div>
            <div className="relative group flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search marine intelligence (Grids, Vessels, Coastal Life)..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-white/20"
              />
            </div>
            
            {/* New Workspace removed for 2.0 declutter */}
          </div>

          <div className="flex items-center gap-6 ml-6">
            <div className="relative group">
              <button className="p-2 text-white/30 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Notification Tooltip */}
              <div className="absolute top-full right-0 mt-4 w-64 glass-dark border border-white/10 rounded-2xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Live Alerts</p>
                <p className="text-[10px] font-bold text-white/60">New Tsunami Detection Node active in Java Sea.</p>
              </div>
            </div>

            <div className="relative group">
              <button className="p-2 text-white/30 hover:text-white transition-colors">
                <HelpCircle size={20} />
              </button>
              
              {/* Help Tooltip */}
              <div className="absolute top-full right-0 mt-4 w-64 glass-dark border border-white/10 rounded-2xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Oceanic Help</p>
                <p className="text-[10px] font-bold text-white/60">Use Ctrl+K to search all maritime intelligence Grids.</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-white/5 mx-2" />
            
            <div className="relative">
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 group cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-8 h-8 rounded-lg object-cover shadow-lg border border-blue-500/30" alt="Profile" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg border border-white/10">
                    <User size={14} className="text-white" />
                  </div>
                )}
                <div className="flex flex-col items-start mr-2">
                  <span className="text-[11px] font-black text-white uppercase tracking-tight leading-none group-hover:text-blue-400 transition-colors">{user?.fullName || "Verified Agent"}</span>
                  <span className="text-[9px] font-black text-blue-500/80 uppercase tracking-widest mt-1">Intelligence Officer</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 group-hover:text-white transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Popover Hub */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-64 bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl z-[60] backdrop-blur-2xl"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black shadow-xl shadow-blue-900/40 border border-white/10">
                          <User size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{user?.fullName || "Authorized Agent"}</p>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Senior Intelligence Officer</p>
                          <p className="text-[9px] text-white/40 truncate w-32 mt-1">{user?.email || "No email synchronized"}</p>
                        </div>
                      </div>

                      <div className="h-px bg-white/5 mx-2" />

                      <nav className="space-y-1">
                        <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                          <User size={14} className="text-blue-500" />
                          My Profile
                        </button>
                        <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                          <SettingsIcon size={14} className="text-blue-500" />
                          Intelligence Settings
                        </button>
                        <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                          <CreditCard size={14} className="text-blue-500" />
                          Premium Plan
                        </button>
                        <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                          <ShieldCheck size={14} className="text-blue-500" />
                          Security & 2FA
                        </button>
                      </nav>

                      <div className="h-px bg-white/5 mx-2" />

                      <button 
                        onClick={logout}
                        className="w-full p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <LogOut size={14} /> Disconnect
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto no-scrollbar bg-[#0a1016]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
