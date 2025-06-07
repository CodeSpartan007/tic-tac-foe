"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface GameState {
  difficulty: string
  setDifficulty: (difficulty: string) => void
  theme: string
  setTheme: (theme: string) => void
}

// Update the default theme to "ocean" (which is now our "Default" theme)
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      difficulty: "medium",
      setDifficulty: (difficulty) => set({ difficulty }),
      theme: "ocean",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "tic-tac-toe-settings",
    },
  ),
)
