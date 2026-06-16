"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { AuthCard } from "@/components/auth/AuthCard";
import { 
  Waves, 
  Search, 
  ArrowUpRight, 
  Play, 
  Globe,
  Instagram,
  Youtube,
  Twitter,
  X,
  Facebook
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const { user, loading, googleLogin, facebookLogin } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (!hasMounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-[#0a1016] text-white font-sans overflow-x-hidden">
      {/* Cinematic Hero Background */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="none"
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/ocean.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1016]/20 to-[#0a1016]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1016]/40 via-transparent to-transparent" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 lg:px-12">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Logo />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-white/60">
            <Link href="#" className="hover:text-white transition-colors">Films</Link>
            <Link href="#" className="hover:text-white transition-colors">Expeditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Journal</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Impact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={() => setShowAuth(true)}
            className="px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-full text-xs font-bold transition-all"
          >
            Get Access
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 lg:px-12 pt-12 lg:pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                 <img src="/image.png" alt="Intro" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Featured Insight</span>
              </div>
              <h1 className="text-7xl lg:text-9xl font-light leading-none tracking-tighter">
                Depths <br />
                <span className="italic font-serif text-blue-100/80">Unseen</span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-md text-lg text-white/50 leading-relaxed font-light"
            >
              A cinematic journey into the world's last wild places — and the intelligence that depends on their survival.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6"
            >
              <button className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Play size={16} fill="currentColor" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold uppercase tracking-widest">Watch Trailer</div>
                  <div className="text-[10px] text-white/40">2:18</div>
                </div>
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-end justify-center h-full gap-16 text-right pt-24 text-white/60">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Expeditions</div>
              <div className="text-4xl font-light">24</div>
              <div className="w-8 h-[1px] bg-white/20 ml-auto my-2" />
              <div className="text-[10px] uppercase text-white/30">Completed</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Species Documented</div>
              <div className="text-4xl font-light">146+</div>
              <div className="w-8 h-[1px] bg-white/20 ml-auto my-2" />
              <div className="text-[10px] uppercase text-white/30">Across 7 Oceans</div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Recent Stories</h3>
            <div className="grid grid-cols-3 gap-4 h-96">
              <StoryCard title="The Silent Hunters" time="12 min" video="/Globe.mp4" />
              <StoryCard title="Forests Beneath" time="18 min" video="/disaster.mp4" />
              <StoryCard title="Return to Blue" time="22 min" video="/jelly.mp4" isBlue={true} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-white/40">
                <Globe size={24} />
              </div>
              <div className="space-y-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Next Expedition</div>
                <h2 className="text-4xl font-light tracking-tight text-white/90">Galápagos Deep</h2>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/40 font-medium">May 12 — June 3, 2026</div>
                  <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                    Follow <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-8 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 bg-[#0a1016]/40 backdrop-blur-md">
        <div className="flex items-center gap-8 text-white/30">
          <Link href="#"><Instagram size={18} /></Link>
          <Link href="#"><Youtube size={18} /></Link>
          <Link href="#"><Twitter size={18} /></Link>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">© 2026 Oceanic Platform</div>
      </footer>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex"
          >
            <div className="absolute inset-0 bg-[#0a1016]/80 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative ml-auto flex w-full max-w-5xl h-full bg-[#0a1016] shadow-2xl overflow-hidden"
            >
               <div className="hidden lg:block relative w-1/2 h-full border-r border-white/5 bg-black">
                 <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover opacity-60">
                   <source src="/space.mp4" type="video/mp4" />
                 </video>
                  <div className="absolute inset-x-12 bottom-12 z-20">
                     <div className="mb-6">
                        <Logo />
                     </div>
                     <div className="pt-8 border-t border-white/5">
                       <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">Secured Node Protocol // v8.4.2</p>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1016]" />
               </div>

               <div className="flex-1 h-full flex flex-col p-12 lg:p-24 overflow-y-auto bg-[#05080b]">
                  <div className="mb-12 flex items-center justify-end">
                     <button onClick={() => setShowAuth(false)} className="p-3 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <X size={24} />
                     </button>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                     <div className="w-full max-w-sm">
                        <AuthCard />
                        <div className="mt-10 pt-10 border-t border-white/5">
                           <div className="grid grid-cols-2 gap-4">
                              <button onClick={() => googleLogin?.()} className="flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-black transition-all shadow-xl">
                                 <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                 </svg> Google
                              </button>
                              <button onClick={() => facebookLogin?.()} className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1877f2] hover:bg-[#166fe5] rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl">
                                 <Facebook className="fill-white w-4 h-4" /> Facebook
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryCard({ title, time, video, isBlue }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  return (
    <div ref={ref} className={`relative h-full rounded-2xl overflow-hidden group cursor-pointer border ${isBlue ? 'border-blue-500/20' : 'border-white/5'}`}>
      {isInView && (
        <video 
          autoPlay muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      <div className={`absolute inset-0 ${isBlue ? 'bg-blue-900/20 mix-blend-overlay' : 'bg-black/40'} group-hover:bg-transparent transition-all duration-700`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <h4 className="text-md font-bold text-white mb-1 uppercase tracking-tight">{title}</h4>
        <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">{time}</div>
      </div>
    </div>
  );
}
