"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GameCard } from "@/app/components/game-card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { ThemeButton } from "@/app/components/theme-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Home() {
  // State for leaderboard
  const [variant, setVariant] = useState("classic")
  const [difficulty, setDifficulty] = useState("medium")
  const [highscores, setHighscores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [usingMockData, setUsingMockData] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertTimer, setAlertTimer] = useState<NodeJS.Timeout | null>(null)

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

  // Fetch leaderboard data
  useEffect(() => {
    fetchHighScores()

    // Clean up timer on unmount
    return () => {
      if (alertTimer) clearTimeout(alertTimer)
    }
  }, [variant, difficulty])

  const fetchHighScores = async () => {
    setLoading(true)
    setError("")

    // Hide alert immediately when loading new data
    setShowAlert(false)
    if (alertTimer) clearTimeout(alertTimer)

    try {
      const response = await fetch(`/api/highscores?variant=${variant}&difficulty=${difficulty}`)

      if (!response.ok) {
        throw new Error("Failed to fetch high scores")
      }

      const data = await response.json()
      setHighscores(data.highscores || [])

      const isMockData = data.usingMockData !== false
      setUsingMockData(isMockData)

      // Only show alert after a delay and if we're still using mock data
      if (isMockData) {
        const timer = setTimeout(() => {
          setShowAlert(true)
        }, 1000)
        setAlertTimer(timer)
      }
    } catch (error) {
      console.error("Error fetching high scores:", error)
      setError("Failed to load high scores. Please try again.")
      setUsingMockData(true)

      // Show alert after delay for errors
      const timer = setTimeout(() => {
        setShowAlert(true)
      }, 1000)
      setAlertTimer(timer)
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
      <header className="container mx-auto py-6 px-4 relative">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold text-primary">Tic Tac Foe</h1>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <ThemeButton />
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Modes</h2>

          {/* Pyramid layout */}
          <div className="max-w-4xl mx-auto">
            {/* Top of pyramid - Classic mode centered */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md">
                <GameCard
                  title="Classic 3x3"
                  description="The traditional Tic Tac Toe game on a 3x3 grid."
                  href="/game/classic"
                  icon="Grid3x3"
                />
              </div>
            </div>

            {/* Bottom of pyramid - 5x5 and Ultimate side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameCard
                title="5x5 Tic Tac Toe"
                description="A larger version with more strategic possibilities."
                href="/game/5x5"
                icon="Grid"
              />
              <GameCard
                title="Ultimate Tic Tac Toe"
                description="Play on 9 boards simultaneously for an extra challenge."
                href="/game/ultimate"
                icon="LayoutGrid"
              />
            </div>
          </div>
        </section>

        {/* Full Leaderboards Section */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Leaderboards</h2>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            {/* Only show alert when using mock data AND after delay */}
            {showAlert && usingMockData && (
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Database Setup in Progress</AlertTitle>
                <AlertDescription>
                  The database is being configured. Showing sample data for now. Your high scores will be saved once the
                  database is ready!
                  <Link href="/admin" className="block mt-2 text-primary hover:underline">
                    → Check database status
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Game Variant</h3>
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
                  <h3 className="text-sm font-medium mb-2">Difficulty</h3>
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
              <div className="overflow-hidden rounded-md">
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
        </section>

        {/* Full How to Play Section */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">How to Play</h2>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <Accordion type="single" collapsible defaultValue="classic">
              <AccordionItem value="classic">
                <AccordionTrigger>Classic 3x3 Tic Tac Toe</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Classic Tic Tac Toe is played on a 3x3 grid. You are X, and the AI is O.</p>
                    <h3 className="text-lg font-medium">Rules:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Players take turns placing their symbol (X or O) on an empty cell.</li>
                      <li>
                        The first player to get three of their symbols in a row (horizontally, vertically, or
                        diagonally) wins.
                      </li>
                      <li>If all cells are filled and no player has three in a row, the game is a draw.</li>
                    </ul>
                    <h3 className="text-lg font-medium">Difficulty Levels:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Easy:</strong> The AI makes random moves.
                      </li>
                      <li>
                        <strong>Medium:</strong> The AI will try to block your winning moves and make its own when
                        possible.
                      </li>
                      <li>
                        <strong>Hard:</strong> The AI uses strategy to try to win or force a draw.
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="5x5">
                <AccordionTrigger>5x5 Tic Tac Toe</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>5x5 Tic Tac Toe is played on a larger 5x5 grid, offering more strategic possibilities.</p>
                    <h3 className="text-lg font-medium">Rules:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Players take turns placing their symbol (X or O) on an empty cell.</li>
                      <li>
                        The first player to get four of their symbols in a row (horizontally, vertically, or diagonally)
                        wins.
                      </li>
                      <li>If all cells are filled and no player has four in a row, the game is a draw.</li>
                    </ul>
                    <h3 className="text-lg font-medium">Strategy Tips:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>The center and the areas around it are strategically valuable.</li>
                      <li>Watch for multiple threats that can be created simultaneously.</li>
                      <li>Blocking your opponent's potential winning moves is crucial.</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ultimate">
                <AccordionTrigger>Ultimate Tic Tac Toe</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Ultimate Tic Tac Toe is a complex variation played on nine 3x3 boards arranged in a 3x3 grid.</p>
                    <h3 className="text-lg font-medium">Rules:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Each small 3x3 board is a local game of Tic Tac Toe.</li>
                      <li>Winning a local board gives you that spot on the global board.</li>
                      <li>The first move can be made anywhere.</li>
                      <li>
                        <strong>Your move determines which local board your opponent must play in next.</strong> For
                        example, if you play in the top-right cell of any local board, your opponent must play in the
                        top-right local board.
                      </li>
                      <li>
                        <strong>
                          If a player is sent to a local board that is already won or full, they can play in any open
                          local board.
                        </strong>
                      </li>
                      <li>
                        To win the game, you need to win three local boards in a row (horizontally, vertically, or
                        diagonally) on the global board.
                      </li>
                    </ul>
                    <h3 className="text-lg font-medium">Strategy Tips:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Think ahead about which board you'll send your opponent to.</li>
                      <li>Try to win local boards that form a line on the global board.</li>
                      <li>
                        Sometimes it's better to play defensively in a local board to prevent your opponent from winning
                        it.
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 p-6 bg-muted/30 rounded-md">
              <h3 className="text-lg font-semibold mb-4">High Scores</h3>
              <p className="mb-4">
                The game tracks how long it takes you to win. If you achieve one of the top 10 fastest times for a game
                variation and difficulty level, you'll be prompted to enter your username for the leaderboard.
              </p>
              <p>Challenge yourself to beat your own times or compete with others for the fastest wins!</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto py-6 px-4 border-t">
        <p className="text-center text-muted-foreground">© {new Date().getFullYear()} Tic Tac Foe</p>
      </footer>
    </div>
  )
}
