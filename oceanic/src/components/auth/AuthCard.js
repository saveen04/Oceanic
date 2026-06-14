"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        if (!formData.fullName) throw new Error("Full name is required");
        await signup(formData.email, formData.password, formData.fullName);
        toast.success("Account created successfully!");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
          {isLogin 
            ? "Access the intelligence node" 
            : "Join the global marine network"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/30 transition-all text-[11px] font-bold"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-blue-500 transition-colors" />
            <input
              type="email"
              required
              placeholder="agent@oceanic.ai"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/30 transition-all text-[11px] font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Password</label>
            {isLogin && (
              <button 
                type="button"
                onClick={() => formData.email && resetPassword(formData.email)}
                className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
              >
                Reset Key
              </button>
            )}
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-blue-500 transition-colors" />
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/30 transition-all text-[11px] font-bold"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isLogin ? "Initialize Access" : "Register Node"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
        {isLogin ? "No active node?" : "Node already active?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-white hover:text-blue-500 transition-colors"
        >
          {isLogin ? "Register" : "Initialize"}
        </button>
      </p>
    </div>
  );
};
