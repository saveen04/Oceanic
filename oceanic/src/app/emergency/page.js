"use client";

import { Navbar } from "@/components/Navbar";
import { Phone, ShieldAlert, Heart, Siren, LifeBuoy } from "lucide-react";

const EMERGENCY_CONTACTS = [
  { region: "National", agency: "National Disaster Response Force (NDRF)", phone: "011-24363260", secondary: "1090", description: "Primary response for large-scale natural disasters." },
  { region: "Coastal", agency: "Indian Coast Guard", phone: "1554", secondary: "+91 11 23074131", description: "Search and rescue operations in maritime zones." },
  { region: "National", agency: "Disaster Management Authority", phone: "1070", secondary: "1077", description: "Unified emergency helpline for immediate coordination." },
  { region: "Andhra Pradesh", agency: "SDMA Andhra Pradesh", phone: "1070", secondary: "0863-2377107", description: "State-level coastline monitoring and relief." },
  { region: "Odisha", agency: "OSDMA", phone: "0674-2395398", secondary: "1070", description: "Cyclone specific relief and evacuation management." },
  { region: "Tamil Nadu", agency: "TNSDMA", phone: "1070", secondary: "044-28593990", description: "South coast disaster coordination and alerts." },
  { region: "West Bengal", agency: "West Bengal Disaster Management", phone: "033-22143526", secondary: "1070", description: "Bay of Bengal storm surge and flood response." },
  { region: "Kerala", agency: "KSDMA", phone: "1070", secondary: "0471-2331639", description: "Monsoon and sea-surge coordination authority." },
];

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-500">
            <Siren size={32} />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white">
            Emergency <span className="text-red-600">Response</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Immediate contact details for disaster relief and coastal assistance.
          </p>
        </div>

        <div className="space-y-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-red-500/30 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      {contact.region}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{contact.agency}</h3>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {contact.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={`tel:${contact.phone}`} className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700">
                    <Phone size={18} />
                    {contact.phone}
                  </a>
                  {contact.secondary && (
                    <div className="text-center text-xs font-bold text-zinc-400">
                      Alt: {contact.secondary}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-blue-50 p-6 dark:border-white/10 dark:bg-blue-900/10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldAlert size={20} />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Safety First</h4>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Always follow local authorities' evacuation orders. In case of cyclone or tsunami alerts, move to designated safe zones immediately.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-emerald-50 p-6 dark:border-white/10 dark:bg-emerald-900/10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <LifeBuoy size={20} />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Community Support</h4>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Report stranded individuals or maritime distress to the Coast Guard helpline (1554) available 24/7 across the coast.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
