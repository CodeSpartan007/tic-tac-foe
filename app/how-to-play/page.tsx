import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeButton } from "@/app/components/theme-button"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function HowToPlayPage() {
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

        <h1 className="text-3xl font-bold mb-6">How to Play</h1>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="mb-8" defaultValue="ultimate">
            <AccordionItem value="classic">
              <AccordionTrigger>Classic 3x3 Tic Tac Toe</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p>Classic Tic Tac Toe is played on a 3x3 grid. You are X, and the AI is O.</p>
                  <h3 className="text-lg font-medium">Rules:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Players take turns placing their symbol (X or O) on an empty cell.</li>
                    <li>
                      The first player to get three of their symbols in a row (horizontally, vertically, or diagonally)
                      wins.
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

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">High Scores</h2>
            <p className="mb-4">
              The game tracks how long it takes you to win. If you achieve one of the top 10 fastest times for a game
              variation and difficulty level, you'll be prompted to enter your username for the leaderboard.
            </p>
            <p>Challenge yourself to beat your own times or compete with others for the fastest wins!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
