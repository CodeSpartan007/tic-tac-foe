"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useGameStore } from "@/app/lib/game-store"

type ThemeContextType = {
  applyGameTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  applyGameTheme: () => {},
})

export function useGameTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme: gameTheme } = useGameStore()
  const [mounted, setMounted] = useState(false)

  // Apply the game theme when it changes
  useEffect(() => {
    if (!mounted) return

    applyGameTheme(gameTheme)
  }, [gameTheme, mounted])

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to apply a theme by changing CSS variables
  const applyGameTheme = (theme: string) => {
    const root = document.documentElement

    // Reset to default theme first
    resetToDefaultTheme(root)

    // Apply the selected theme
    switch (theme) {
      case "sunset":
        root.style.setProperty("--primary", "15 100% 55%") // orange-500
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "35 100% 50%") // amber-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "350 100% 60%") // rose-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        root.style.setProperty("--muted", "35 30% 96%")
        root.style.setProperty("--muted-foreground", "35 10% 40%")
        break
      case "ocean":
        root.style.setProperty("--primary", "190 100% 40%") // cyan-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "210 100% 50%") // blue-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "170 100% 40%") // teal-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        root.style.setProperty("--muted", "190 30% 96%")
        root.style.setProperty("--muted-foreground", "190 10% 40%")
        break
      case "forest":
        root.style.setProperty("--primary", "140 100% 30%") // green-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "150 100% 40%") // emerald-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "90 100% 40%") // lime-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        root.style.setProperty("--muted", "140 30% 96%")
        root.style.setProperty("--muted-foreground", "140 10% 40%")
        break
      case "lavender":
        root.style.setProperty("--primary", "270 100% 50%") // purple-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "260 100% 60%") // violet-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "290 100% 60%") // fuchsia-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        root.style.setProperty("--muted", "270 30% 96%")
        root.style.setProperty("--muted-foreground", "270 10% 40%")
        break
      case "monochrome":
        root.style.setProperty("--primary", "220 13% 20%") // gray-800
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "220 13% 40%") // gray-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "220 13% 60%") // gray-400
        root.style.setProperty("--accent-foreground", "220 13% 10%")
        root.style.setProperty("--muted", "220 13% 96%")
        root.style.setProperty("--muted-foreground", "220 13% 40%")
        break
      // Default theme is already set in globals.css
    }
  }

  // Reset to the default theme (defined in globals.css)
  const resetToDefaultTheme = (root: HTMLElement) => {
    // Light mode defaults
    root.style.removeProperty("--background")
    root.style.removeProperty("--foreground")
    root.style.removeProperty("--card")
    root.style.removeProperty("--card-foreground")
    root.style.removeProperty("--popover")
    root.style.removeProperty("--popover-foreground")
    root.style.removeProperty("--primary")
    root.style.removeProperty("--primary-foreground")
    root.style.removeProperty("--secondary")
    root.style.removeProperty("--secondary-foreground")
    root.style.removeProperty("--muted")
    root.style.removeProperty("--muted-foreground")
    root.style.removeProperty("--accent")
    root.style.removeProperty("--accent-foreground")
    root.style.removeProperty("--destructive")
    root.style.removeProperty("--destructive-foreground")
    root.style.removeProperty("--border")
    root.style.removeProperty("--input")
    root.style.removeProperty("--ring")
  }

  return (
    <ThemeContext.Provider value={{ applyGameTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  )
}
