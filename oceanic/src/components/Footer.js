"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, Github, Twitter, Linkedin, Mail, ExternalLink, Lock } from "lucide-react";
import { useMe } from "@/hooks/useMe";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { user } = useMe();
  
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const footerBg = isAuthPage ? "bg-transparent" : "bg-white dark:bg-zinc-950";

  return (
    <footer className={`mt-auto ${!isAuthPage ? "border-t border-zinc-200 dark:border-zinc-800" : ""} ${footerBg} transition-all duration-300`}>
      <div className="mx-auto max-w-7xl px-4">
        {!isAuthPage ? (
          <div className="grid gap-12 py-16 md:grid-cols-12">
            <div className="col-span-1 md:col-span-4 space-y-6">
              <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  <Waves size={18} />
                </span>
                <span className="text-xl text-zinc-950 dark:text-zinc-100">Oceanic</span>
              </Link>
              <p className="max-w-xs text-sm leading-7 text-zinc-800 dark:text-zinc-400">
                The global standard for real-time ocean condition monitoring and predictive disaster analytics. Empowering coastal safety through technology.
              </p>
              <div className="flex gap-5">
                <SocialLink href="#" icon={<Twitter size={18} />} />
                <SocialLink href="#" icon={<Github size={18} />} />
                <SocialLink href="#" icon={<Linkedin size={18} />} />
                <SocialLink href="#" icon={<Mail size={18} />} />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">Platform</h3>
              <ul className="space-y-3">
                <FooterLink href="/dashboard" label="Dashboard" disabled={!user} />
                <FooterLink href="/map" label="Live Map" disabled={!user} />
                <FooterLink href="/weather" label="Weather Center" disabled={!user} />
                <FooterLink href="/history" label="Event Logs" disabled={!user} />
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">Resources</h3>
              <ul className="space-y-3">
                <FooterLink href="#" label="API Documentation" />
                <FooterLink href="#" label="Data Sources" />
                <FooterLink href="#" label="Technical Blog" />
                <FooterLink href="#" label="System Status" />
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">Company</h3>
              <ul className="space-y-3">
                <FooterLink href="/about" label="About Us" />
                <FooterLink href="/emergency" label="Emergency Contact" />
                <FooterLink href="#" label="Privacy" />
                <FooterLink href="#" label="Terms" />
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col items-end">
              {!user && (
                <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2">Restricted Access</p>
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                    <Lock size={12} /> Sign in to explore
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className={`flex flex-col items-center justify-between gap-6 ${!isAuthPage ? "border-t border-zinc-200 py-10" : "py-6"} dark:border-zinc-800 md:flex-row`}>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-400">
              © {currentYear} Oceanic Platform Intelligence. All rights reserved.
            </p>
            {!isAuthPage && (
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500">
                ISO 27001 Certified • Data encrypted via AES-256
              </p>
            )}
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">All Systems Operational</span>
            </div>
            {!isAuthPage && (
              <div className="flex items-center gap-4">
                <SocialLink href="#" icon={<Twitter size={14} />} />
                <SocialLink href="#" icon={<Github size={14} />} />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, disabled }) {
  if (disabled) {
    return (
      <li className="flex items-center gap-2 text-sm text-zinc-600 select-none dark:text-zinc-600">
        {label}
        <Lock size={10} className="opacity-50" />
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className="text-sm text-zinc-800 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100">
        {label}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a href={href} className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">
      {icon}
    </a>
  );
}
