"use client"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/app/lib/game-store"

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useGameStore()

  const difficulties = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ]

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Select Difficulty</h3>
      <div className="flex flex-wrap gap-3">
        {difficulties.map((level) => (
          <Button
            key={level.id}
            variant={difficulty === level.id ? "default" : "outline"}
            onClick={() => setDifficulty(level.id)}
          >
            {level.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
