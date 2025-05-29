"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/app/lib/game-store"
import { GameTimer } from "@/app/components/game-timer"
import { makeAIMove } from "@/app/lib/ai-logic"
import { PlayIcon, HomeIcon, XCircleIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface GameBoardProps {
  variant: string
  size: number
  isUltimate: boolean
}

// Interface to track sub-board winners in Ultimate Tic Tac Toe
interface SubBoardWinners {
  [key: number]: string | null // null = no winner, "X" or "O" = winner
}

// Interface to track moves per sub-board
interface BoardMoveCount {
  X: number[]
  O: number[]
}

export function GameBoard({ variant, size, isUltimate }: GameBoardProps) {
  const router = useRouter()
  const { difficulty } = useGameStore()
  const [board, setBoard] = useState<string[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X") // Default: Player is X
  const [gameStatus, setGameStatus] = useState<"not_started" | "playing" | "won" | "draw">("not_started")
  const [winner, setWinner] = useState<string | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [activeBoard, setActiveBoard] = useState<number | null>(null) // For Ultimate Tic Tac Toe
  const [quitDialogOpen, setQuitDialogOpen] = useState(false)
  const [subBoardWinners, setSubBoardWinners] = useState<SubBoardWinners>({})
  const [aiGoesFirst, setAiGoesFirst] = useState(false)
  const [moveCount, setMoveCount] = useState<BoardMoveCount>({ X: Array(9).fill(0), O: Array(9).fill(0) })
  const gameStarted = useRef(false)

  // Initialize the board structure (but don't start the game)
  useEffect(() => {
    prepareBoard()
  }, [variant, size, difficulty])

  // Prepare the board without starting the game
  const prepareBoard = () => {
    // Determine if AI should go first (Ultimate + Hard mode)
    const shouldAiGoFirst = isUltimate && difficulty === "hard"
    setAiGoesFirst(shouldAiGoFirst)

    // Set initial player based on game mode
    setCurrentPlayer(shouldAiGoFirst ? "O" : "X")

    if (isUltimate) {
      // For Ultimate Tic Tac Toe, we create a 3x3 grid of 3x3 boards
      const newBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(""))
      setBoard(newBoard)
      setActiveBoard(null) // Any board can be played initially
      setSubBoardWinners({}) // Reset sub-board winners
      setMoveCount({ X: Array(9).fill(0), O: Array(9).fill(0) }) // Reset move counts
    } else {
      // For Classic and 5x5
      const newBoard = Array(size)
        .fill(null)
        .map(() => Array(size).fill(""))
      setBoard(newBoard)
    }

    gameStarted.current = false
    setGameStatus("not_started")
    setWinner(null)
    setIsTimerRunning(false)
    setGameTime(0)
  }

  // Start the game when the start button is clicked
  const startGame = () => {
    setGameStatus("playing")
    setIsTimerRunning(true)
    gameStarted.current = true

    // If AI goes first, make its move immediately
    if (aiGoesFirst && currentPlayer === "O") {
      makeInitialAIMove()
    }
  }

  // Function to make the initial AI move
  const makeInitialAIMove = () => {
    // Create a fresh board for the AI's first move
    const freshBoard = Array(9)
      .fill(null)
      .map(() => Array(9).fill(""))

    setTimeout(() => {
      // For the first move, we'll use a special strategy
      if (!gameStarted.current || board.every((subBoard) => subBoard.every((cell) => cell === ""))) {
        // First move of the game - choose a strategic position
        // In Ultimate Tic Tac Toe, the center of the center board is very powerful
        // But we'll avoid it to implement the requested strategy

        // Choose a side cell in the center board that will force the player to a new board
        const centerBoardIndex = 4
        const sideCellsInCenterBoard = [1, 3, 5, 7] // Top, left, right, bottom cells

        // Pick a random side cell
        const cellIndex = sideCellsInCenterBoard[Math.floor(Math.random() * sideCellsInCenterBoard.length)]

        const aiBoard = [...freshBoard]
        aiBoard[centerBoardIndex][cellIndex] = "O"

        // Update move count
        const newMoveCount = { ...moveCount }
        newMoveCount.O[centerBoardIndex]++
        setMoveCount(newMoveCount)

        // Set the next active board based on the AI's move
        setActiveBoard(cellIndex)
        setBoard(aiBoard)
        setCurrentPlayer("X")
      } else {
        // Not the first move, use regular AI logic
        makeAIMove(freshBoard, difficulty, isUltimate, null, size, {}, moveCount).then((aiMove) => {
          if (aiMove) {
            const aiBoard = [...freshBoard]

            if (isUltimate && aiMove.boardIndex !== undefined && aiMove.cellIndex !== undefined) {
              const { boardIndex, cellIndex } = aiMove

              if (aiBoard[boardIndex]) {
                aiBoard[boardIndex][cellIndex] = "O"

                // Update move count
                const newMoveCount = { ...moveCount }
                newMoveCount.O[boardIndex]++
                setMoveCount(newMoveCount)

                // Set the next active board based on the AI's move
                setActiveBoard(cellIndex)
              }
            }

            setBoard(aiBoard)
            // Switch to player's turn
            setCurrentPlayer("X")
          }
        })
      }
    }, 500)
  }

  // Reset the game to play again
  const resetGame = () => {
    // Create a completely fresh game state
    if (isUltimate) {
      const newBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(""))
      setBoard(newBoard)
      setActiveBoard(null)
      setSubBoardWinners({})
      setMoveCount({ X: Array(9).fill(0), O: Array(9).fill(0) }) // Reset move counts
    } else {
      const newBoard = Array(size)
        .fill(null)
        .map(() => Array(size).fill(""))
      setBoard(newBoard)
    }

    // Set the correct initial player
    const shouldAiGoFirst = isUltimate && difficulty === "hard"
    setAiGoesFirst(shouldAiGoFirst)
    setCurrentPlayer(shouldAiGoFirst ? "O" : "X")

    // Reset game state
    gameStarted.current = true
    setWinner(null)
    setGameTime(0)

    // Start the game
    setGameStatus("playing")
    setIsTimerRunning(true)

    // If AI goes first, make its move after a short delay to ensure state is updated
    if (shouldAiGoFirst) {
      setTimeout(() => {
        makeInitialAIMove()
      }, 100)
    }
  }

  // Quit the current game and return to home
  const quitGame = () => {
    setQuitDialogOpen(true)
  }

  // Update the confirmQuit function to reset the game instead of navigating
  const confirmQuit = () => {
    // Reset the game instead of navigating
    prepareBoard()
    setQuitDialogOpen(false)
  }

  // Add a new function to quit to the main menu
  const quitToMainMenu = () => {
    router.push("/")
    setQuitDialogOpen(false)
  }

  // Check if a sub-board has been won in Ultimate Tic Tac Toe
  const checkSubBoardWin = (boardIndex: number, player: string): boolean => {
    if (!board[boardIndex]) return false

    // Get the cells for this sub-board
    const cells = board[boardIndex]

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (cells[i * 3] === player && cells[i * 3 + 1] === player && cells[i * 3 + 2] === player) {
        return true
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (cells[i] === player && cells[i + 3] === player && cells[i + 6] === player) {
        return true
      }
    }

    // Check diagonals
    if (cells[0] === player && cells[4] === player && cells[8] === player) {
      return true
    }
    if (cells[2] === player && cells[4] === player && cells[6] === player) {
      return true
    }

    return false
  }

  // Check if the entire Ultimate game has been won
  const checkUltimateWin = (player: string, winners: SubBoardWinners = subBoardWinners): boolean => {
    // Create a 3x3 grid representing the sub-board winners
    const metaBoard = Array(9)
      .fill(null)
      .map((_, i) => (winners[i] === player ? player : null))

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (metaBoard[i * 3] === player && metaBoard[i * 3 + 1] === player && metaBoard[i * 3 + 2] === player) {
        return true
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (metaBoard[i] === player && metaBoard[i + 3] === player && metaBoard[i + 6] === player) {
        return true
      }
    }

    // Check diagonals
    if (metaBoard[0] === player && metaBoard[4] === player && metaBoard[8] === player) {
      return true
    }
    if (metaBoard[2] === player && metaBoard[4] === player && metaBoard[6] === player) {
      return true
    }

    return false
  }

  // Check if the Ultimate game is a draw
  const checkUltimateDraw = (): boolean => {
    // If all sub-boards are either won or full, and no player has won the game, it's a draw
    for (let i = 0; i < 9; i++) {
      if (subBoardWinners[i] === undefined && isBoardPlayable(i)) {
        return false // There's still a playable board
      }
    }
    return true
  }

  // Helper function to check if a board is playable (not full and not won)
  const isBoardPlayable = (boardIndex: number): boolean => {
    if (!board[boardIndex]) return false
    if (subBoardWinners[boardIndex] !== undefined) return false

    // Check if the board is full
    return board[boardIndex].some((cell) => cell === "")
  }

  // Helper function to determine if the player can play anywhere
  const canPlayAnywhere = (): boolean => {
    // If there's no active board, player can play anywhere
    if (activeBoard === null) return true

    // If the active board is already won or full, player can play anywhere
    if (subBoardWinners[activeBoard] !== undefined || !isBoardPlayable(activeBoard)) return true

    return false
  }

  // Handle player move
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== "playing" || currentPlayer !== "X") return

    // For Ultimate Tic Tac Toe
    if (isUltimate) {
      const boardIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3)

      // Calculate the position within the local board (0-8)
      const localRow = row % 3
      const localCol = col % 3
      const localPosition = localRow * 3 + localCol

      // Check if this sub-board has already been won
      if (subBoardWinners[boardIndex] !== undefined) return

      // Check if player can play on this board
      const playAnywhere = canPlayAnywhere()
      if (!playAnywhere && activeBoard !== boardIndex) return

      // Check if board or cell is undefined or already filled
      if (!board[boardIndex] || board[boardIndex][localPosition] !== "") return

      const newBoard = [...board]
      newBoard[boardIndex][localPosition] = "X"
      setBoard(newBoard)

      // Update move count for player
      const newMoveCount = { ...moveCount }
      newMoveCount.X[boardIndex]++
      setMoveCount(newMoveCount)

      // Track if player won a sub-board
      let playerWonSubBoard = false
      let updatedSubBoardWinners = { ...subBoardWinners }

      // Check if this move won the sub-board
      if (checkSubBoardWin(boardIndex, "X")) {
        playerWonSubBoard = true
        updatedSubBoardWinners = { ...updatedSubBoardWinners, [boardIndex]: "X" }
        setSubBoardWinners(updatedSubBoardWinners)

        // Check if this sub-board win resulted in winning the entire game
        if (checkUltimateWin("X", updatedSubBoardWinners)) {
          setGameStatus("won")
          setWinner("X")
          setIsTimerRunning(false)
          checkHighScore()
          return
        }

        // Check for a draw
        if (checkUltimateDraw()) {
          setGameStatus("draw")
          setIsTimerRunning(false)
          return
        }
      }

      // Set the next active board based on the local position played
      // This is the key rule: the local position determines the next board
      const nextBoard = localPosition

      // Check if the next board is already won or full
      if (updatedSubBoardWinners[nextBoard] !== undefined || !isBoardPlayable(nextBoard)) {
        // If the next board is already won or full, allow play on any board
        setActiveBoard(null)
      } else {
        setActiveBoard(nextBoard)
      }

      // Switch to AI's turn
      setCurrentPlayer("O")

      // AI makes a move after a short delay
      setTimeout(() => {
        // Use the most up-to-date subBoardWinners that includes the player's recent win
        makeAIMove(newBoard, difficulty, isUltimate, localPosition, size, updatedSubBoardWinners, newMoveCount).then(
          (aiMove) => {
            if (aiMove) {
              const aiBoard = [...newBoard]

              if (isUltimate && aiMove.boardIndex !== undefined && aiMove.cellIndex !== undefined) {
                const { boardIndex, cellIndex } = aiMove

                // Ensure the AI doesn't play in an already won board
                if (updatedSubBoardWinners[boardIndex] !== undefined) {
                  console.error("AI attempted to play in an already won board")
                  setCurrentPlayer("X")
                  return
                }

                if (aiBoard[boardIndex]) {
                  aiBoard[boardIndex][cellIndex] = "O"

                  // Update move count for AI
                  const finalMoveCount = { ...newMoveCount }
                  finalMoveCount.O[boardIndex]++
                  setMoveCount(finalMoveCount)

                  // Check if AI won the sub-board
                  if (checkSubBoardWin(boardIndex, "O")) {
                    // Make sure to preserve all previous winners including the player's recent win
                    const finalSubBoardWinners = { ...updatedSubBoardWinners, [boardIndex]: "O" }
                    setSubBoardWinners(finalSubBoardWinners)

                    // Check if this sub-board win resulted in winning the entire game
                    if (checkUltimateWin("O", finalSubBoardWinners)) {
                      setGameStatus("won")
                      setWinner("O")
                      setIsTimerRunning(false)
                      return
                    }

                    // Check for a draw
                    if (checkUltimateDraw()) {
                      setGameStatus("draw")
                      setIsTimerRunning(false)
                      return
                    }
                  }

                  // Set the next active board based on the AI's move
                  const nextBoard = cellIndex

                  // Check if the next board is already won or full
                  if (updatedSubBoardWinners[nextBoard] !== undefined || !isBoardPlayable(nextBoard)) {
                    // If the next board is already won or full, allow play on any board
                    setActiveBoard(null)
                  } else {
                    setActiveBoard(nextBoard)
                  }
                }
              }

              setBoard(aiBoard)

              // Back to player's turn
              setCurrentPlayer("X")
            }
          },
        )
      }, 500)
    } else {
      // For Classic and 5x5
      if (!board[row] || board[row][col] !== "") return

      const newBoard = [...board]
      newBoard[row][col] = "X"
      setBoard(newBoard)

      // Check for win
      if (checkWin(newBoard, "X")) {
        setGameStatus("won")
        setWinner("X")
        setIsTimerRunning(false)
        checkHighScore()
        return
      }

      // Check for draw
      if (checkDraw(newBoard)) {
        setGameStatus("draw")
        setIsTimerRunning(false)
        return
      }

      // Switch to AI's turn
      setCurrentPlayer("O")

      // AI makes a move after a short delay
      setTimeout(() => {
        makeAIMove(newBoard, difficulty, isUltimate, activeBoard, size).then((aiMove) => {
          if (aiMove && aiMove.row !== undefined && aiMove.col !== undefined) {
            const aiBoard = [...newBoard]
            const { row, col } = aiMove

            if (aiBoard[row]) {
              aiBoard[row][col] = "O"
            }

            setBoard(aiBoard)

            // Check for AI win
            if (checkWin(aiBoard, "O")) {
              setGameStatus("won")
              setWinner("O")
              setIsTimerRunning(false)
              return
            }

            // Check for draw
            if (checkDraw(aiBoard)) {
              setGameStatus("draw")
              setIsTimerRunning(false)
              return
            }

            // Back to player's turn
            setCurrentPlayer("X")
          }
        })
      }, 500)
    }
  }

  // Check if a player has won
  const checkWin = (board: string[][], player: string) => {
    if (isUltimate) {
      // Ultimate win checking is handled separately
      return false
    }

    // For 5x5, check for 5 in a row
    if (size === 5) {
      // Check rows
      for (let row = 0; row < 5; row++) {
        if (
          board[row][0] === player &&
          board[row][1] === player &&
          board[row][2] === player &&
          board[row][3] === player &&
          board[row][4] === player
        ) {
          return true
        }
      }

      // Check columns
      for (let col = 0; col < 5; col++) {
        if (
          board[0][col] === player &&
          board[1][col] === player &&
          board[2][col] === player &&
          board[3][col] === player &&
          board[4][col] === player
        ) {
          return true
        }
      }

      // Check diagonals
      if (
        board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player &&
        board[3][3] === player &&
        board[4][4] === player
      ) {
        return true
      }

      if (
        board[0][4] === player &&
        board[1][3] === player &&
        board[2][2] === player &&
        board[3][1] === player &&
        board[4][0] === player
      ) {
        return true
      }

      return false
    }

    // For 3x3, check for 3 in a row
    // Check rows
    for (let i = 0; i < size; i++) {
      if (!board[i]) continue
      if (board[i].every((cell) => cell === player)) {
        return true
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      let column = true
      for (let j = 0; j < size; j++) {
        if (!board[j] || board[j][i] !== player) {
          column = false
          break
        }
      }
      if (column) return true
    }

    // Check diagonals
    let diagonal1 = true
    let diagonal2 = true

    for (let i = 0; i < size; i++) {
      if (!board[i] || board[i][i] !== player) {
        diagonal1 = false
      }
      if (!board[i] || board[i][size - 1 - i] !== player) {
        diagonal2 = false
      }
    }

    return diagonal1 || diagonal2
  }

  // Check if the game is a draw
  const checkDraw = (board: string[][]) => {
    if (isUltimate) {
      // Ultimate draw checking is handled separately
      return false
    }

    for (let i = 0; i < size; i++) {
      if (!board[i]) return false
      for (let j = 0; j < size; j++) {
        if (board[i][j] === "") {
          return false
        }
      }
    }
    return true
  }

  // Check if the player's time is a high score
  const checkHighScore = async () => {
    try {
      const response = await fetch(`/api/highscores/check?variant=${variant}&difficulty=${difficulty}&time=${gameTime}`)

      if (!response.ok) {
        console.error("Error response from high score check:", await response.text())
        return
      }

      const data = await response.json()

      if (data.isHighScore) {
        // Redirect to the high score form
        router.push(`/highscore?variant=${variant}&difficulty=${difficulty}&time=${gameTime}`)
      }
    } catch (error) {
      console.error("Error checking high score:", error)
      // Continue game flow even if high score check fails
    }
  }

  // Render the game board
  const renderBoard = () => {
    if (isUltimate) {
      // Determine if player can play anywhere
      const playAnywhere = canPlayAnywhere()

      return (
        <div className="p-4 bg-card rounded-lg shadow-md border border-border">
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {Array(9)
              .fill(null)
              .map((_, boardIndex) => {
                // Determine if this board is playable
                const isPlayable =
                  (playAnywhere || activeBoard === boardIndex) &&
                  subBoardWinners[boardIndex] === undefined &&
                  isBoardPlayable(boardIndex) &&
                  currentPlayer === "X" // Only highlight playable boards when it's the player's turn

                const isFull = board[boardIndex] && !board[boardIndex].some((cell) => cell === "")
                const boardWinner = subBoardWinners[boardIndex]

                return (
                  <div
                    key={boardIndex}
                    className={`grid grid-cols-3 gap-1 p-2 rounded-md relative ${
                      isPlayable ? "border-2 border-primary bg-primary/5" : "border border-muted bg-background"
                    } ${isFull || boardWinner ? "opacity-80" : ""}`}
                  >
                    {/* Show big X or O if the board is won */}
                    {boardWinner && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                        <span
                          className={`text-5xl font-bold ${boardWinner === "X" ? "text-blue-600" : "text-red-600"}`}
                        >
                          {boardWinner}
                        </span>
                      </div>
                    )}

                    {Array(9)
                      .fill(null)
                      .map((_, cellIndex) => {
                        // Calculate the global row and col for this cell
                        const boardRow = Math.floor(boardIndex / 3)
                        const boardCol = boardIndex % 3
                        const cellRow = Math.floor(cellIndex / 3)
                        const cellCol = cellIndex % 3
                        const globalRow = boardRow * 3 + cellRow
                        const globalCol = boardCol * 3 + cellCol

                        return (
                          <button
                            key={cellIndex}
                            className={`w-9 h-9 flex items-center justify-center text-lg font-bold rounded-sm
                              ${
                                board[boardIndex] && board[boardIndex][cellIndex] === "X"
                                  ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                                  : board[boardIndex] && board[boardIndex][cellIndex] === "O"
                                    ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                                    : "bg-card hover:bg-muted/50 transition-colors"
                              } border border-border`}
                            onClick={() => handleCellClick(globalRow, globalCol)}
                            disabled={
                              gameStatus !== "playing" ||
                              currentPlayer !== "X" ||
                              !isPlayable ||
                              boardWinner !== undefined
                            }
                          >
                            {board[boardIndex] && board[boardIndex][cellIndex]}
                          </button>
                        )
                      })}
                  </div>
                )
              })}
          </div>
        </div>
      )
    } else {
      return (
        <div className="p-4 bg-card rounded-lg shadow-md border border-border">
          <div className={`grid gap-2 max-w-md mx-auto ${size === 3 ? "grid-cols-3" : "grid-cols-5"}`}>
            {Array(size)
              .fill(null)
              .map((_, row) =>
                Array(size)
                  .fill(null)
                  .map((_, col) => (
                    <button
                      key={`${row}-${col}`}
                      className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-md shadow-sm
                        ${
                          board[row] && board[row][col] === "X"
                            ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : board[row] && board[row][col] === "O"
                              ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                              : "bg-background hover:bg-muted/80 transition-colors"
                        } border border-border`}
                      onClick={() => handleCellClick(row, col)}
                      disabled={gameStatus !== "playing" || currentPlayer !== "X"}
                    >
                      {board[row] && board[row][col]}
                    </button>
                  )),
              )}
          </div>
        </div>
      )
    }
  }

  // Render game status and controls
  const renderGameStatus = () => {
    if (gameStatus === "not_started") {
      return (
        <div className="text-center mb-6">
          <p className="text-lg mb-4">
            Ready to play {variant.charAt(0).toUpperCase() + variant.slice(1)} on {difficulty} difficulty?
            {aiGoesFirst && (
              <span className="block mt-1 text-sm text-muted-foreground">AI will make the first move</span>
            )}
          </p>
          <Button size="lg" onClick={startGame} className="px-8 py-6 text-lg" variant="default">
            <PlayIcon className="mr-2 h-5 w-5" />
            Start Game
          </Button>
        </div>
      )
    } else if (gameStatus === "playing") {
      return (
        <div className="mb-4 text-center">
          <GameTimer isRunning={isTimerRunning} onTimeUpdate={setGameTime} />
          <div className="mt-2">
            <p className="text-lg">
              Current Player: <span className="font-medium">{currentPlayer === "X" ? "You" : "AI"}</span>
            </p>
            {isUltimate && currentPlayer === "X" && (
              <p className="text-sm mt-1 text-muted-foreground">
                {canPlayAnywhere() ? "You can play in any open board" : `Play in board ${activeBoard! + 1}`}
              </p>
            )}
            {isUltimate && currentPlayer === "O" && (
              <p className="text-sm mt-1 text-muted-foreground">AI is thinking...</p>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className="mb-4 text-center">
          <GameTimer isRunning={isTimerRunning} onTimeUpdate={setGameTime} />
          <div className="mt-2">
            {gameStatus === "won" ? (
              <p className="text-xl font-bold text-primary">{winner === "X" ? "You Won!" : "AI Won!"}</p>
            ) : (
              <p className="text-xl font-bold text-primary">Game Draw!</p>
            )}
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button size="lg" onClick={resetGame}>
              Play Again
            </Button>
            <Button size="lg" variant="outline" onClick={quitGame}>
              <HomeIcon className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col items-center">
      {renderGameStatus()}

      {/* Only show the board if the game is in progress or finished */}
      {gameStatus !== "not_started" && (
        <>
          <div className="mb-6">{renderBoard()}</div>

          {/* Quit button - only show during active gameplay */}
          {gameStatus === "playing" && (
            <Button variant="outline" onClick={quitGame} className="mt-2">
              <XCircleIcon className="mr-2 h-4 w-4" />
              Quit Game
            </Button>
          )}
        </>
      )}

      {/* Quit confirmation dialog */}
      <AlertDialog open={quitDialogOpen} onOpenChange={setQuitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quit Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current game progress will be lost. Where would you like to go?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmQuit}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Quit
            </AlertDialogAction>
            <AlertDialogAction
              onClick={quitToMainMenu}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Quit to Main Menu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
