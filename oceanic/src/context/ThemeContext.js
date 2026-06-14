"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Manual ThemeProvider for React 19 / Next.js 16
 * Avoids script-tag injection by using a standard useEffect approach
 * to manage theme classes on the document element.
 */
export const ManualThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Persist theme
    localStorage.setItem("oceanic_theme", theme);
  }, [theme]);

  // Initial load from storage
  useEffect(() => {
    const saved = localStorage.getItem("oceanic_theme");
    if (saved) {
      setTheme(saved);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
