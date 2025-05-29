"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { ThemeButton } from "@/app/components/theme-button"
import { ThemeToggle } from "@/app/components/theme-toggle"

interface HighScore {
  id: number
  username: string
  variant: string
  difficulty: string
  time: number
  created_at: string
}

export default function LeaderboardPage() {
  const searchParams = useSearchParams()
  const initialVariant = searchParams.get("variant") || "classic"
  const initialDifficulty = searchParams.get("difficulty") || "medium"

  const [variant, setVariant] = useState(initialVariant)
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [highscores, setHighscores] = useState<HighScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dbAvailable, setDbAvailable] = useState(true)

  const variants = [
    { id: "classic", name: "Classic 3x3" },
    { id: "5x5", name: "5x5 Tic Tac Toe" },
    { id: "ultimate", name: "Ultimate Tic Tac Toe" },
  ]

  const difficulties = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
  ]

  useEffect(() => {
    fetchHighScores()
  }, [variant, difficulty])

  const fetchHighScores = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/highscores?variant=${variant}&difficulty=${difficulty}`)

      if (!response.ok) {
        throw new Error("Failed to fetch high scores")
      }

      const data = await response.json()
      setHighscores(data.highscores || [])

      // Check if these are mock scores (they'll have sequential IDs 1-5)
      const isMockData =
        data.highscores &&
        data.highscores.length > 0 &&
        data.highscores.every((score: HighScore, index: number) => score.id === index + 1)

      setDbAvailable(!isMockData)
    } catch (error) {
      console.error("Error fetching high scores:", error)
      setError("Failed to load high scores. Please try again.")
      setDbAvailable(false)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

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

        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

        {!dbAvailable && (
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Database not connected</AlertTitle>
            <AlertDescription>
              The database is not connected yet. Showing sample high scores for demonstration.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div>
              <h2 className="text-sm font-medium mb-2">Game Variant</h2>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    variant={variant === v.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVariant(v.id)}
                  >
                    {v.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium mb-2">Difficulty</h2>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((d) => (
                  <Button
                    key={d.id}
                    variant={difficulty === d.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty(d.id)}
                  >
                    {d.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : highscores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No high scores yet for this game mode.</p>
            <p className="mt-2">Be the first to set a record!</p>
            <Link href={`/game/${variant}`}>
              <Button className="mt-4">Play Now</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highscores.map((score, index) => (
                  <TableRow key={score.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{score.username}</TableCell>
                    <TableCell>{formatTime(score.time)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(score.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
