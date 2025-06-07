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

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply the game theme when it changes
  useEffect(() => {
    if (!mounted) return
    applyGameTheme(gameTheme)
  }, [gameTheme, mounted])

  // Function to apply a theme by changing CSS variables
  const applyGameTheme = (theme: string) => {
    const root = document.documentElement

    // Reset to default theme first
    resetToDefaultTheme(root)

    // Apply the selected theme
    switch (theme) {
      case "ocean":
        // Ocean theme (now Default)
        root.style.setProperty("--primary", "190 100% 40%") // cyan-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "210 100% 50%") // blue-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "170 100% 40%") // teal-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "vibrant":
        // Vibrant theme
        root.style.setProperty("--primary", "240 100% 50%") // indigo-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "260 100% 60%") // violet-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "330 100% 60%") // pink-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "sunset":
        root.style.setProperty("--primary", "15 100% 55%") // orange-500
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "35 100% 50%") // amber-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "350 100% 60%") // rose-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "forest":
        root.style.setProperty("--primary", "140 100% 30%") // green-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "150 100% 40%") // emerald-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "90 100% 40%") // lime-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "lavender":
        root.style.setProperty("--primary", "270 100% 50%") // purple-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "260 100% 60%") // violet-500
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "290 100% 60%") // fuchsia-500
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "monochrome":
        root.style.setProperty("--primary", "220 13% 20%") // gray-800
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "220 13% 40%") // gray-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "220 13% 60%") // gray-400
        root.style.setProperty("--accent-foreground", "220 13% 10%")
        break
      case "neon":
        root.style.setProperty("--primary", "330 100% 60%") // pink-500
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "270 100% 60%") // purple-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "50 100% 50%") // yellow-400
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      case "pastel":
        root.style.setProperty("--primary", "330 80% 80%") // pink-300
        root.style.setProperty("--primary-foreground", "210 40% 20%")
        root.style.setProperty("--secondary", "210 80% 80%") // blue-300
        root.style.setProperty("--secondary-foreground", "210 40% 20%")
        root.style.setProperty("--accent", "50 80% 80%") // yellow-300
        root.style.setProperty("--accent-foreground", "210 40% 20%")
        break
      case "retro":
        root.style.setProperty("--primary", "35 100% 50%") // amber-600
        root.style.setProperty("--primary-foreground", "210 40% 98%")
        root.style.setProperty("--secondary", "170 100% 30%") // teal-600
        root.style.setProperty("--secondary-foreground", "210 40% 98%")
        root.style.setProperty("--accent", "0 100% 50%") // red-600
        root.style.setProperty("--accent-foreground", "210 40% 98%")
        break
      // Default theme is already set in globals.css
    }
  }

  // Reset to the default theme (defined in globals.css)
  const resetToDefaultTheme = (root: HTMLElement) => {
    root.style.removeProperty("--primary")
    root.style.removeProperty("--primary-foreground")
    root.style.removeProperty("--secondary")
    root.style.removeProperty("--secondary-foreground")
    root.style.removeProperty("--accent")
    root.style.removeProperty("--accent-foreground")
  }

  return (
    <ThemeContext.Provider value={{ applyGameTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  )
}
