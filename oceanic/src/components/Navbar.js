"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Waves, Map, LayoutDashboard, CloudSun, Shield, History, Info } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useMe } from "@/hooks/useMe";

export function Navbar() {
  const router = useRouter();
  const { user, isLoading, mutate } = useMe();

  async function logout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      await mutate();
      toast.success("Logged out");
      router.push("/");
    } catch (e) {
      toast.error(e.message || "Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Waves size={18} />
            </span>
            <span className="text-black dark:text-zinc-100">Oceanic</span>
          </Link>

          {user && (
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
              <NavLink href="/map" icon={<Map size={15} />} label="Live Map" />
              <NavLink href="/weather" icon={<CloudSun size={15} />} label="Weather" />
              <NavLink href="/history" icon={<History size={15} />} label="History" />
              <NavLink href="/coastal-hotels" icon={<Map size={15} />} label="Hotels" />
              <NavLink href="/emergency" icon={<Shield size={15} />} label="Emergency" />
              <NavLink href="/settings" icon={<LayoutDashboard size={15} />} label="Settings" />
              {user?.role === "admin" && (
                <NavLink href="/admin" icon={<Shield size={15} />} label="Admin" />
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="jira-button-secondary py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="jira-button-secondary py-1.5"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="jira-button-primary py-1.5"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
    >
      <span className="opacity-100">{icon}</span>
      {label}
    </Link>
  );
}

