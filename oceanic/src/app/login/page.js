"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Waves, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");

      toast.success("Welcome back");
      router.push(next);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
      {/* Left Side: Video */}
      <div className="relative hidden w-1/2 overflow-hidden bg-zinc-900 lg:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-60 grayscale-[0.6] dark:grayscale-0"
        >
          <source src="/Globe.mp4" type="video/mp4" />
        </video>
        {/* Desaturating Overlay for Light Theme */}
        <div className="absolute inset-0 bg-zinc-200/20 mix-blend-saturation dark:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 via-transparent to-transparent" />
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-16 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-black">
            <ArrowLeft size={16} className="text-black" />
            <span className="text-black">Back to home</span>
          </Link>
          
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight text-black">Sign In</h1>
            <p className="mt-3 text-lg font-bold text-black">
              Access the professional suite of ocean intelligence tools.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Field label="Work Email">
              <input
                className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-4 text-base font-bold text-black placeholder:text-zinc-400 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password">
              <input
                className="w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-4 text-base font-bold text-black placeholder:text-zinc-400 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-base font-black text-white shadow-2xl shadow-blue-500/40 transition-all hover:bg-blue-700 active:scale-[0.98]"
              type="submit"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>

            <p className="text-center text-sm font-black text-black">
              New to Oceanic?{" "}
              <Link className="text-blue-600 underline decoration-2 underline-offset-4 hover:text-blue-700" href="/signup">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.2em] text-black">
        {label}
      </div>
      {children}
    </label>
  );
}

