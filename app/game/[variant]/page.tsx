import { notFound } from "next/navigation"
import { GameBoard } from "@/app/components/game-board"
import { DifficultySelector } from "@/app/components/difficulty-selector"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeButton } from "@/app/components/theme-button"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function GamePage({ params }: { params: { variant: string } }) {
  const variant = params.variant

  // Validate the game variant
  if (!["classic", "5x5", "ultimate"].includes(variant)) {
    notFound()
  }

  // Map variant to display name and board size
  const variantInfo = {
    classic: { name: "Classic 3x3", size: 3 },
    "5x5": { name: "5x5 Tic Tac Toe", size: 5 },
    ultimate: { name: "Ultimate Tic Tac Toe", size: 3, isUltimate: true },
  }

  const { name, size, isUltimate } = variantInfo[variant as keyof typeof variantInfo]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <ThemeButton />
            <ThemeToggle />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">{name}</h1>

        <div className="max-w-md mx-auto mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
          <DifficultySelector />
        </div>

        <div className="mt-8">
          <GameBoard variant={variant} size={size} isUltimate={isUltimate || false} />
        </div>
      </div>
    </div>
  )
}
