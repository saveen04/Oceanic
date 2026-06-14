"use client";

import React from "react";
import { ManualThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { SWRConfig } from "swr";

export function Providers({ children }) {
  return (
    <SWRConfig 
      value={{
        fetcher: (url) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
      }}
    >
      <AuthProvider>
        <ManualThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ManualThemeProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

