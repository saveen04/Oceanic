"use client";

import dynamic from "next/dynamic";
import React from "react";

/**
 * ClientProviders acts as a bridge between Server Components (layout.js)
 * and the actual provider stack. By using next/dynamic with ssr: false
 * inside a Client Component, we satisfy Next.js's architectural rules
 * while still isolating script-injecting providers like next-themes.
 */
const Providers = dynamic(
  () => import("./Providers").then((mod) => mod.Providers),
  { ssr: false }
);

export function ClientProviders({ children }) {
  return <Providers>{children}</Providers>;
}
