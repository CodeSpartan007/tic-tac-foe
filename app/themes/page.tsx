"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/app/lib/game-store"
import { useGameTheme } from "@/app/components/theme-provider"
import { ThemeToggle } from "@/app/components/theme-toggle"

interface ThemeOption {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

export default function ThemesPage() {
  const { theme, setTheme } = useTheme()
  const { theme: gameTheme, setTheme: setGameTheme } = useGameStore()
  const { applyGameTheme } = useGameTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const themeOptions: ThemeOption[] = [
    {
      id: "default",
      name: "Default",
      primary: "bg-blue-600",
      secondary: "bg-slate-200 dark:bg-slate-800",
      accent: "bg-emerald-600",
      background: "bg-white dark:bg-slate-950",
    },
    {
      id: "sunset",
      name: "Sunset",
      primary: "bg-orange-500",
      secondary: "bg-amber-600",
      accent: "bg-rose-500",
      background: "bg-amber-50 dark:bg-amber-950",
    },
    {
      id: "ocean",
      name: "Ocean",
      primary: "bg-cyan-600",
      secondary: "bg-blue-500",
      accent: "bg-teal-500",
      background: "bg-cyan-50 dark:bg-cyan-950",
    },
    {
      id: "forest",
      name: "Forest",
      primary: "bg-green-600",
      secondary: "bg-emerald-500",
      accent: "bg-lime-500",
      background: "bg-green-50 dark:bg-green-950",
    },
    {
      id: "lavender",
      name: "Lavender",
      primary: "bg-purple-600",
      secondary: "bg-violet-500",
      accent: "bg-fuchsia-500",
      background: "bg-purple-50 dark:bg-purple-950",
    },
    {
      id: "monochrome",
      name: "Monochrome",
      primary: "bg-gray-800",
      secondary: "bg-gray-600",
      accent: "bg-gray-400",
      background: "bg-gray-100 dark:bg-gray-900",
    },
  ]

  const handleThemeChange = (newTheme: string) => {
    setGameTheme(newTheme)
    // The theme will be applied by the ThemeProvider
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Color Mode</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
                Light
              </Button>
              <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                Dark
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Color Themes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameTheme === option.id ? "border-primary" : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => handleThemeChange(option.id)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">{option.name}</span>
                    {gameTheme === option.id && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${option.primary}`}></div>
                    <div className={`w-6 h-6 rounded-full ${option.secondary}`}></div>
                    <div className={`w-6 h-6 rounded-full ${option.accent}`}></div>
                  </div>
                  <div className={`w-full h-3 rounded ${option.background}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Theme Preview</h2>
            <p className="text-muted-foreground mb-4">This is how your selected theme will look in the game.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
