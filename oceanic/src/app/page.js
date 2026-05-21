"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Map as MapIcon,
  Waves,
  Shield,
  TrendingUp,
  Globe,
  Zap,
  ArrowRight,
  Database,
  BarChart3
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover brightness-[0.4] dark:brightness-[0.3]"
          >
            <source src="/space.mp4" type="video/mp4" />
          </video>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/60" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center backdrop-blur-md bg-white/5 p-12 rounded-3xl border border-white/10 shadow-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300"
            >
              <Activity size={14} className="animate-pulse" />
              Real-time Global Ocean Intelligence
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl"
            >
              Predicting the <span className="text-blue-500">Unpredictable</span> in Our Oceans.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-zinc-300"
            >
              Oceanic is the professional standard for disaster detection. We combine satellite imagery, buoy data, and AI to provide sub-second alerts for tsunamis, cyclones, and storm surges.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
              >
                Get Started
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-high-contrast">Professional Data Core</h2>
            <p className="mt-4 text-lg text-muted-contrast">Trusted by coastal authorities and research institutions worldwide.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <FeatureCard
              icon={<Globe className="text-blue-600" />}
              title="Global Network"
              description="Integrates data from over 4,000 deep-ocean sensors and coastal stations in real-time."
            />
            <FeatureCard
              icon={<Zap className="text-amber-500" />}
              title="Low Latency"
              description="Proprietary streaming engine delivers alerts up to 15 minutes faster than standard systems."
            />
            <FeatureCard
              icon={<Database className="text-purple-500" />}
              title="Historical Insights"
              description="Analyze over 50 years of oceanic event data to identify patterns and risks."
            />
            <FeatureCard
              icon={<BarChart3 className="text-emerald-500" />}
              title="Predictive Modeling"
              description="Advanced AI models forecast impact zones with up to 92% accuracy."
            />
            <FeatureCard
              icon={<Shield className="text-red-500" />}
              title="Emergency Protocol"
              description="Direct integration with local emergency services and broadcasting channels."
            />
            <FeatureCard
              icon={<TrendingUp className="text-cyan-500" />}
              title="Custom Thresholds"
              description="Set granular alert conditions based on wave height, wind speed, or seismic activity."
            />
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-blue-600 px-8 py-16 text-center text-white shadow-2xl lg:px-16 lg:py-24">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to protect your coastline?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
              Join the network of safety and resilience. Create your professional account today.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-sm transition-all hover:bg-zinc-50 active:scale-95"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="glow-card group rounded-3xl bg-white p-8 dark:bg-zinc-950"
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-high-contrast">{title}</h3>
      <p className="mt-3 leading-7 text-muted-contrast">{description}</p>
    </motion.div>
  );
}
