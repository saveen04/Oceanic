"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Key, 
  Save, 
  Smartphone, 
  CheckCircle2,
  AlertCircle,
  Crown,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Profile State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [tfaEnabled, setTfaEnabled] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { fullName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Agent Identity", icon: User },
    { id: "security", name: "Security & 2FA", icon: Shield },
    { id: "billing", name: "Premium Plans", icon: CreditCard },
    { id: "intelligence", name: "API & Webhooks", icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Command Settings</h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage your intelligence profile, security hardening, and satellite subscriptions.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <aside className="w-full lg:w-72 shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                        : "text-slate-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : "group-hover:text-blue-500"} />
                    <span className="text-xs font-black uppercase tracking-widest">{tab.name}</span>
                    {isActive && <motion.div layoutId="tab-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-12 p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-[32px]">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="text-amber-400 w-5 h-5" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium Status</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6">You are currently on the <span className="text-blue-400">Standard Agent</span> plan. Upgrade for global real-time satellite imagery.</p>
              <button onClick={() => setActiveTab("billing")} className="w-full py-3 bg-blue-600 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all">
                Check Plans
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.section
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="glass-dark border border-white/5 p-10 rounded-[44px]">
                    <div className="flex items-center gap-8 mb-10">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-2xl relative overflow-hidden">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" />
                          ) : (
                            user?.fullName?.[0] || user?.email?.[0]
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Smartphone size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0a1016] rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2">{user?.fullName || user?.displayName || "Agent"}</h2>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Identity</span>
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest">Operator Role</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">Full Agent Name</label>
                          <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">Official Email Address</label>
                          <input 
                            type="email" 
                            value={user?.email || ""}
                            readOnly
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex items-center gap-6">
                        <button 
                          disabled={loading}
                          className="px-10 py-4 bg-blue-600 rounded-[20px] text-xs font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                        >
                          {loading ? "Syncing..." : <><Save size={16} /> Save Changes</>}
                        </button>
                        {success && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-400">
                             <CheckCircle2 size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Data Synchronized</span>
                          </motion.div>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.section>
              )}

              {activeTab === "security" && (
                <motion.section
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="glass-dark border border-white/5 p-10 rounded-[44px]">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                          <Shield size={24} className="text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">Two-Factor Authentication</h3>
                          <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your intelligence console</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTfaEnabled(!tfaEnabled)}
                        className={`w-14 h-8 rounded-full p-1 transition-all ${tfaEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${tfaEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group">
                        <Fingerprint className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold text-white mb-2">Biometric Verification</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-6 font-medium">Use Windows Hello or TouchID for rapid console access.</p>
                        <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Configure Hardware</button>
                      </div>
                      <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <Smartphone className="w-8 h-8 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold text-white mb-2">Authenticator App</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-6 font-medium">Generate TOTP codes via Google or Microsoft Authenticator.</p>
                        <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Setup App</button>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeTab === "billing" && (
                <motion.section
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[
                    { name: "Global Agent", price: "$49", features: ["Real-time Wave Data", "11 GIS Layers", "Alert History", "Team Access"], active: false },
                    { name: "Fleet Commander", price: "$149", features: ["All Global Features", "Satellites Imagery", "Custom API Webhooks", "Zero-Latency Priority"], active: true },
                  ].map((plan, i) => (
                    <div key={i} className={`p-10 rounded-[44px] border ${plan.active ? 'border-blue-500 bg-blue-600/5 shadow-2xl shadow-blue-500/20' : 'border-white/5 bg-white/5'} transition-all relative overflow-hidden group`}>
                      {plan.active && <div className="absolute top-8 -right-12 bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.3em] px-12 py-1 rotate-45">Current</div>}
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-white">{plan.price}</span>
                        <span className="text-xs font-bold text-slate-500">/mo</span>
                      </div>
                      <ul className="space-y-4 mb-10">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-400">
                            <CheckCircle2 size={16} className="text-blue-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${plan.active ? 'bg-white text-blue-600' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {plan.active ? "Manage Subscription" : "Upgrade Plan"}
                      </button>
                    </div>
                  ))}
                </motion.section>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
