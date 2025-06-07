// AI logic for Tic Tac Toe

interface Move {
  row?: number
  col?: number
  boardIndex?: number
  cellIndex?: number
}

interface SubBoardWinners {
  [key: number]: string | null // null = no winner, "X" or "O" = winner
}

// Interface to track moves per sub-board
interface BoardMoveCount {
  X: number[]
  O: number[]
}

export async function makeAIMove(
  board: string[][],
  difficulty: string,
  isUltimate: boolean,
  activeBoard: number | null,
  size: number,
  subBoardWinners?: SubBoardWinners,
  moveCount?: BoardMoveCount,
): Promise<Move | null> {
  // Simulate AI thinking time
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (isUltimate) {
    return makeUltimateMove(board, difficulty, activeBoard, subBoardWinners || {}, moveCount)
  } else {
    return makeRegularMove(board, difficulty, size)
  }
}

function makeRegularMove(board: string[][], difficulty: string, size: number): Move | null {
  // Easy difficulty: Random move
  if (difficulty === "easy") {
    return makeRandomMove(board, size)
  }

  // Medium difficulty: Block player win or make random move
  if (difficulty === "medium") {
    // Try to find a winning move
    const winningMove = findWinningMove(board, "O", size)
    if (winningMove) return winningMove

    // Try to block player's winning move
    const blockingMove = findWinningMove(board, "X", size)
    if (blockingMove) return blockingMove

    // Make a random move
    return makeRandomMove(board, size)
  }

  // Hard difficulty: Use advanced strategy
  if (difficulty === "hard") {
    // For 5x5 board, use enhanced strategy
    if (size === 5) {
      return makeAdvanced5x5Move(board)
    }

    // Try to find a winning move
    const winningMove = findWinningMove(board, "O", size)
    if (winningMove) return winningMove

    // Try to block player's winning move
    const blockingMove = findWinningMove(board, "X", size)
    if (blockingMove) return blockingMove

    // Take center if available
    const center = Math.floor(size / 2)
    if (board[center][center] === "") {
      return { row: center, col: center }
    }

    // Take corners if available
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: size - 1 },
      { row: size - 1, col: 0 },
      { row: size - 1, col: size - 1 },
    ]

    for (const corner of corners) {
      if (board[corner.row][corner.col] === "") {
        return corner
      }
    }

    // Make a random move
    return makeRandomMove(board, size)
  }

  return null
}

// Advanced strategy for 5x5 Tic Tac Toe
function makeAdvanced5x5Move(board: string[][]): Move | null {
  // In 5x5, the winning condition is 5 in a row

  // 1. Try to find a winning move (5 in a row)
  const winningMove = find5x5WinningMove(board, "O")
  if (winningMove) return winningMove

  // 2. Try to block player's winning move
  const blockingMove = find5x5WinningMove(board, "X")
  if (blockingMove) return blockingMove

  // 3. Try to find a move that creates a strong position (4 in a row)
  const fourInRowMove = findFourInRowMove(board, "O")
  if (fourInRowMove) return fourInRowMove

  // 4. Try to block player's 4 in a row
  const blockFourInRowMove = findFourInRowMove(board, "X")
  if (blockFourInRowMove) return blockFourInRowMove

  // 5. Try to create a 3-in-a-row with open ends
  const threeInRowMove = findThreeInRowMove(board, "O")
  if (threeInRowMove) return threeInRowMove

  // 6. Block player's potential 3-in-a-row with open ends
  const blockThreeInRowMove = findThreeInRowMove(board, "X")
  if (blockThreeInRowMove) return blockThreeInRowMove

  // 7. Take center if available
  if (board[2][2] === "") {
    return { row: 2, col: 2 }
  }

  // 8. Take strategic positions
  const strategicPositions = [
    { row: 1, col: 1 },
    { row: 1, col: 3 },
    { row: 3, col: 1 },
    { row: 3, col: 3 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 4 },
    { row: 4, col: 2 },
  ]

  for (const position of strategicPositions) {
    if (board[position.row][position.col] === "") {
      return position
    }
  }

  // 9. Take any available position based on evaluation
  return findBestEvaluatedMove(board, "O")
}

// Find a move that creates a 4-in-a-row (strong position in 5x5)
function findFourInRowMove(board: string[][], player: string): Move | null {
  const emptyCells: Move[] = []

  // Find all empty cells
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }
  }

  // Check each empty cell
  for (const cell of emptyCells) {
    const testBoard = JSON.parse(JSON.stringify(board))
    testBoard[cell.row][cell.col] = player

    // Check rows
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= 1; col++) {
        const line = [
          testBoard[row][col],
          testBoard[row][col + 1],
          testBoard[row][col + 2],
          testBoard[row][col + 3],
          testBoard[row][col + 4],
        ]
        if (countInLine(line, player) === 4 && countInLine(line, "") === 1) {
          return cell
        }
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row <= 0; row++) {
        const line = [
          testBoard[row][col],
          testBoard[row + 1][col],
          testBoard[row + 2][col],
          testBoard[row + 3][col],
          testBoard[row + 4][col],
        ]
        if (countInLine(line, player) === 4 && countInLine(line, "") === 1) {
          return cell
        }
      }
    }

    // Check diagonals
    if (
      testBoard[0][0] === player &&
      testBoard[1][1] === player &&
      testBoard[2][2] === player &&
      testBoard[3][3] === player &&
      testBoard[4][4] === ""
    ) {
      return { row: 4, col: 4 }
    }
    if (
      testBoard[0][0] === "" &&
      testBoard[1][1] === player &&
      testBoard[2][2] === player &&
      testBoard[3][3] === player &&
      testBoard[4][4] === player
    ) {
      return { row: 0, col: 0 }
    }

    // Other diagonal
    if (
      testBoard[0][4] === player &&
      testBoard[1][3] === player &&
      testBoard[2][2] === player &&
      testBoard[3][1] === player &&
      testBoard[4][0] === ""
    ) {
      return { row: 4, col: 0 }
    }
    if (
      testBoard[0][4] === "" &&
      testBoard[1][3] === player &&
      testBoard[2][2] === player &&
      testBoard[3][1] === player &&
      testBoard[4][0] === player
    ) {
      return { row: 0, col: 4 }
    }
  }

  return null
}

// Find a move that creates a 3-in-a-row with open ends
function findThreeInRowMove(board: string[][], player: string): Move | null {
  const emptyCells: Move[] = []

  // Find all empty cells
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }
  }

  // Check each empty cell
  for (const cell of emptyCells) {
    const testBoard = JSON.parse(JSON.stringify(board))
    testBoard[cell.row][cell.col] = player

    // Check rows
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= 2; col++) {
        const line = [testBoard[row][col], testBoard[row][col + 1], testBoard[row][col + 2]]

        // Check if this creates a 3-in-a-row with open ends
        if (countInLine(line, player) === 3) {
          // Check if both ends are open
          const leftOpen = col > 0 && testBoard[row][col - 1] === ""
          const rightOpen = col + 3 < 5 && testBoard[row][col + 3] === ""

          if (leftOpen || rightOpen) {
            return cell
          }
        }
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row <= 2; row++) {
        const line = [testBoard[row][col], testBoard[row + 1][col], testBoard[row + 2][col]]

        // Check if this creates a 3-in-a-row with open ends
        if (countInLine(line, player) === 3) {
          // Check if both ends are open
          const topOpen = row > 0 && testBoard[row - 1][col] === ""
          const bottomOpen = row + 3 < 5 && testBoard[row + 3][col] === ""

          if (topOpen || bottomOpen) {
            return cell
          }
        }
      }
    }

    // Check diagonals
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++) {
        const diag = [testBoard[row][col], testBoard[row + 1][col + 1], testBoard[row + 2][col + 2]]

        // Check if this creates a 3-in-a-row with open ends
        if (countInLine(diag, player) === 3) {
          // Check if both ends are open
          const topLeftOpen = row > 0 && col > 0 && testBoard[row - 1][col - 1] === ""
          const bottomRightOpen = row + 3 < 5 && col + 3 < 5 && testBoard[row + 3][col + 3] === ""

          if (topLeftOpen || bottomRightOpen) {
            return cell
          }
        }
      }
    }

    for (let row = 0; row <= 2; row++) {
      for (let col = 2; col < 5; col++) {
        const diag = [testBoard[row][col], testBoard[row + 1][col - 1], testBoard[row + 2][col - 2]]

        // Check if this creates a 3-in-a-row with open ends
        if (countInLine(diag, player) === 3) {
          // Check if both ends are open
          const topRightOpen = row > 0 && col < 4 && testBoard[row - 1][col + 1] === ""
          const bottomLeftOpen = row + 3 < 5 && col - 3 >= 0 && testBoard[row + 3][col - 3] === ""

          if (topRightOpen || bottomLeftOpen) {
            return cell
          }
        }
      }
    }
  }

  return null
}

// Find the best move based on board evaluation
function findBestEvaluatedMove(board: string[][], player: string): Move | null {
  const emptyCells: Move[] = []

  // Find all empty cells
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }
  }

  if (emptyCells.length === 0) return null

  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove = emptyCells[0]

  // Evaluate each empty cell
  for (const cell of emptyCells) {
    const testBoard = JSON.parse(JSON.stringify(board))
    testBoard[cell.row][cell.col] = player

    const score = evaluate5x5Board(testBoard, player)

    if (score > bestScore) {
      bestScore = score
      bestMove = cell
    }
  }

  return bestMove
}

// Evaluate the 5x5 board for a player
function evaluate5x5Board(board: string[][], player: string): number {
  const opponent = player === "X" ? "O" : "X"
  let score = 0

  // Evaluate rows
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= 0; col++) {
      const line = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3], board[row][col + 4]]
      score += evaluateLine(line, player, opponent)
    }
  }

  // Evaluate columns
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row <= 0; row++) {
      const line = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col], board[row + 4][col]]
      score += evaluateLine(line, player, opponent)
    }
  }

  // Evaluate diagonals
  const diag1 = [board[0][0], board[1][1], board[2][2], board[3][3], board[4][4]]
  score += evaluateLine(diag1, player, opponent)

  const diag2 = [board[0][4], board[1][3], board[2][2], board[3][1], board[4][0]]
  score += evaluateLine(diag2, player, opponent)

  // Add positional bias
  const centerValue = 3
  const innerSquareValue = 2
  const outerValue = 1

  // Center
  if (board[2][2] === player) score += centerValue

  // Inner square
  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
      if (row === 2 && col === 2) continue // Skip center
      if (board[row][col] === player) score += innerSquareValue
    }
  }

  // Outer positions
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (row === 0 || row === 4 || col === 0 || col === 4) {
        if (board[row][col] === player) score += outerValue
      }
    }
  }

  return score
}

// Evaluate a line of 5 cells
function evaluateLine(line: string[], player: string, opponent: string): number {
  const playerCount = countInLine(line, player)
  const opponentCount = countInLine(line, opponent)
  const emptyCount = countInLine(line, "")

  // If line has both player and opponent marks, it's not winnable
  if (playerCount > 0 && opponentCount > 0) {
    return 0
  }

  // Score based on how close to winning
  if (playerCount === 4 && emptyCount === 1) return 100 // Almost a win
  if (playerCount === 3 && emptyCount === 2) return 10 // Potential future win
  if (playerCount === 2 && emptyCount === 3) return 5 // Early development
  if (playerCount === 1 && emptyCount === 4) return 1 // Very early development

  // Defensive scoring
  if (opponentCount === 4 && emptyCount === 1) return 90 // Block opponent's win
  if (opponentCount === 3 && emptyCount === 2) return 40 // Block potential threat

  return 0
}

// Count occurrences of a value in a line
function countInLine(line: string[], value: string): number {
  return line.filter((cell) => cell === value).length
}

// Find winning move for 5x5 (5 in a row)
function find5x5WinningMove(board: string[][], player: string): Move | null {
  const emptyCells: Move[] = []

  // Find all empty cells
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }
  }

  // Check each empty cell
  for (const cell of emptyCells) {
    const testBoard = JSON.parse(JSON.stringify(board))
    testBoard[cell.row][cell.col] = player

    // Check rows
    for (let row = 0; row < 5; row++) {
      if (
        testBoard[row][0] === player &&
        testBoard[row][1] === player &&
        testBoard[row][2] === player &&
        testBoard[row][3] === player &&
        testBoard[row][4] === player
      ) {
        return cell
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (
        testBoard[0][col] === player &&
        testBoard[1][col] === player &&
        testBoard[2][col] === player &&
        testBoard[3][col] === player &&
        testBoard[4][col] === player
      ) {
        return cell
      }
    }

    // Check diagonals
    if (
      testBoard[0][0] === player &&
      testBoard[1][1] === player &&
      testBoard[2][2] === player &&
      testBoard[3][3] === player &&
      testBoard[4][4] === player
    ) {
      return cell
    }

    if (
      testBoard[0][4] === player &&
      testBoard[1][3] === player &&
      testBoard[2][2] === player &&
      testBoard[3][1] === player &&
      testBoard[4][0] === player
    ) {
      return cell
    }
  }

  return null
}

// Update the makeUltimateMove function to prioritize defensive strategy above all else
function makeUltimateMove(
  board: string[][],
  difficulty: string,
  activeBoard: number | null,
  subBoardWinners: SubBoardWinners,
  moveCount?: BoardMoveCount,
): Move | null {
  // Only apply the enhanced defensive strategy in hard mode
  const isHardMode = difficulty === "hard"

  // Check if the active board is already won or full
  const canPlayAnywhere =
    activeBoard === null ||
    subBoardWinners[activeBoard] !== undefined ||
    !board[activeBoard] ||
    !board[activeBoard].some((cell) => cell === "")

  // If AI can play anywhere, choose a strategic board
  if (canPlayAnywhere) {
    // For easy difficulty, just make a random move on a valid board
    if (difficulty === "easy") {
      return makeRandomUltimateMove(board, subBoardWinners)
    }

    // For medium and hard difficulties, use more strategic board selection
    return makeStrategicBoardSelection(board, difficulty, subBoardWinners, moveCount)
  } else {
    // AI must play on the active board
    // For easy difficulty, just make a random move on the active board
    if (difficulty === "easy") {
      return makeRandomMoveOnBoard(board, activeBoard)
    }

    // For medium and hard difficulties, use more strategic cell selection
    return makeStrategicCellSelection(board, activeBoard, difficulty, subBoardWinners, moveCount)
  }
}

// Check if a player has a potential winning move in a sub-board
function playerHasPotentialWin(board: string[][], boardIndex: number, player: string): boolean {
  return findSubBoardWinningMove(board[boardIndex], player) !== null
}

// Update makeRandomUltimateMove to ensure it only selects non-won boards
function makeRandomUltimateMove(board: string[][], subBoardWinners: SubBoardWinners): Move | null {
  // Find all non-won and non-full boards
  const playableBoards = []
  for (let i = 0; i < 9; i++) {
    if (board[i] && board[i].some((cell) => cell === "") && subBoardWinners[i] === undefined) {
      playableBoards.push(i)
    }
  }

  if (playableBoards.length === 0) return null

  // Choose a random playable board
  const randomBoardIndex = playableBoards[Math.floor(Math.random() * playableBoards.length)]

  // Find empty cells in this board
  const emptyCells = board[randomBoardIndex].map((cell, index) => ({ cell, index })).filter(({ cell }) => cell === "")

  if (emptyCells.length === 0) return null

  // Choose a random empty cell
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]

  return { boardIndex: randomBoardIndex, cellIndex: randomCell.index }
}

// Check if a sub-board is empty (all cells are empty)
function isSubBoardEmpty(board: string[][], boardIndex: number): boolean {
  if (!board[boardIndex]) return false
  return board[boardIndex].every((cell) => cell === "")
}

// Update makeStrategicBoardSelection to prioritize defensive strategy
function makeStrategicBoardSelection(
  board: string[][],
  difficulty: string,
  subBoardWinners: SubBoardWinners,
  moveCount?: BoardMoveCount,
): Move | null {
  const isHardMode = difficulty === "hard"

  // Find all non-won and non-full boards
  const playableBoards = []
  for (let i = 0; i < 9; i++) {
    if (board[i] && board[i].some((cell) => cell === "") && subBoardWinners[i] === undefined) {
      playableBoards.push(i)
    }
  }

  if (playableBoards.length === 0) return null

  // DEFENSIVE STRATEGY (HIGHEST PRIORITY FOR HARD MODE)
  // First, try to find a board where we can make a move that doesn't send the player to a winning position
  if (isHardMode) {
    // Check each playable board for safe moves
    for (const boardIndex of playableBoards) {
      // Get all empty cells in this board
      const emptyCells = []
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (board[boardIndex][cellIndex] === "") {
          emptyCells.push(cellIndex)
        }
      }

      // Filter for cells that don't send player to a winning position
      const safeCells = emptyCells.filter(
        (cellIndex) => !playerHasPotentialWin(board, cellIndex, "X") || subBoardWinners[cellIndex] !== undefined,
      )

      if (safeCells.length > 0) {
        // Now check if we can win or block within these safe cells

        // Check if we can win with a safe move
        for (const cellIndex of safeCells) {
          const testBoard = JSON.parse(JSON.stringify(board))
          testBoard[boardIndex][cellIndex] = "O"
          if (checkSubBoardWin(testBoard[boardIndex], "O")) {
            return { boardIndex, cellIndex }
          }
        }

        // Check if we can block with a safe move
        const blockingMove = findSubBoardWinningMove(board[boardIndex], "X")
        if (blockingMove !== null && safeCells.includes(blockingMove)) {
          return { boardIndex, cellIndex: blockingMove }
        }

        // If no winning or blocking moves among safe cells, just pick a safe cell
        return { boardIndex, cellIndex: safeCells[Math.floor(Math.random() * safeCells.length)] }
      }
    }
  }

  // If no safe moves found or not in hard mode, continue with regular strategy

  // Try to find a board where we can win a sub-board
  for (const boardIndex of playableBoards) {
    const winningMove = findSubBoardWinningMove(board[boardIndex], "O")
    if (winningMove !== null) {
      // In hard mode, check if this move would send the player to a winning position
      if (isHardMode && playerHasPotentialWin(board, winningMove, "X") && subBoardWinners[winningMove] === undefined) {
        // Look for alternative winning moves that don't send player to a winning position
        const allWinningMoves = findAllWinningMoves(board[boardIndex], "O")
        const safeWinningMoves = allWinningMoves.filter(
          (move) => !playerHasPotentialWin(board, move, "X") || subBoardWinners[move] !== undefined,
        )

        if (safeWinningMoves.length > 0) {
          return { boardIndex, cellIndex: safeWinningMoves[0] }
        }
        // If no safe winning moves, we'll still make the winning move as a last resort
      }
      return { boardIndex, cellIndex: winningMove }
    }
  }

  // Try to block player's winning move
  for (const boardIndex of playableBoards) {
    const blockingMove = findSubBoardWinningMove(board[boardIndex], "X")
    if (blockingMove !== null) {
      // In hard mode, check if this move would send the player to a winning position
      if (
        isHardMode &&
        playerHasPotentialWin(board, blockingMove, "X") &&
        subBoardWinners[blockingMove] === undefined
      ) {
        // Look for alternative blocking moves
        const alternativeMoves = findAlternativeBlockingMoves(board, boardIndex, "X", subBoardWinners)
        if (alternativeMoves.length > 0) {
          return { boardIndex, cellIndex: alternativeMoves[0] }
        }
        // If no alternative blocking moves, we must block anyway
      }
      return { boardIndex, cellIndex: blockingMove }
    }
  }

  // For hard mode, implement the special strategy to prevent player from playing in the same sub-board
  if (isHardMode && moveCount) {
    // Find boards where the player has never played or where AI has played more than the player
    const strategicBoards = playableBoards.filter((boardIndex) => {
      return moveCount.X[boardIndex] === 0 || moveCount.O[boardIndex] > moveCount.X[boardIndex]
    })

    if (strategicBoards.length > 0) {
      // Choose a board where player hasn't played or AI has played more
      const boardIndex = strategicBoards[Math.floor(Math.random() * strategicBoards.length)]

      // Find cells that would send the player to boards they haven't played in
      // AND wouldn't allow them to win a sub-board
      const safeCells = []
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (
          board[boardIndex][cellIndex] === "" &&
          (moveCount.X[cellIndex] === 0 || moveCount.O[cellIndex] > moveCount.X[cellIndex]) &&
          (!playerHasPotentialWin(board, cellIndex, "X") || subBoardWinners[cellIndex] !== undefined)
        ) {
          safeCells.push(cellIndex)
        }
      }

      // If we found safe cells, choose one randomly
      if (safeCells.length > 0) {
        const cellIndex = safeCells[Math.floor(Math.random() * safeCells.length)]
        return { boardIndex, cellIndex }
      }

      // If no safe strategic cells, just make a strategic move on this board
      return makeStrategicCellSelection(board, boardIndex, difficulty, subBoardWinners, moveCount)
    }
  }

  // Try to send the player to a board that's already won or full
  for (const boardIndex of playableBoards) {
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (board[boardIndex][cellIndex] === "") {
        // This cell would send the player to board 'cellIndex'
        if (
          subBoardWinners[cellIndex] !== undefined || // Board is already won
          !board[cellIndex] || // Board doesn't exist (shouldn't happen)
          !board[cellIndex].some((cell) => cell === "") // Board is full
        ) {
          return { boardIndex, cellIndex }
        }
      }
    }
  }

  // If no strategic move is found, prioritize the center board if available
  const centerBoard = 4
  if (
    playableBoards.includes(centerBoard) &&
    board[centerBoard] &&
    board[centerBoard].some((cell) => cell === "") &&
    subBoardWinners[centerBoard] === undefined
  ) {
    return makeStrategicCellSelection(board, centerBoard, difficulty, subBoardWinners, moveCount)
  }

  // If no strategic board is found, choose a random board and make a strategic move there
  const randomBoardIndex = playableBoards[Math.floor(Math.random() * playableBoards.length)]
  return makeStrategicCellSelection(board, randomBoardIndex, difficulty, subBoardWinners, moveCount)
}

// Find alternative blocking moves that don't send the player to a winning position
function findAlternativeBlockingMoves(
  board: string[][],
  boardIndex: number,
  player: string,
  subBoardWinners: SubBoardWinners,
): number[] {
  const alternativeMoves = []

  // Check rows for potential blocks
  for (let i = 0; i < 3; i++) {
    const row = [board[boardIndex][i * 3], board[boardIndex][i * 3 + 1], board[boardIndex][i * 3 + 2]]
    if (countInLine(row, player) === 1 && countInLine(row, "") === 2) {
      // This row has one player mark and two empty cells - could be a future win
      for (let j = 0; j < 3; j++) {
        const cellIndex = i * 3 + j
        if (
          board[boardIndex][cellIndex] === "" &&
          (!playerHasPotentialWin(board, cellIndex, player) || subBoardWinners[cellIndex] !== undefined)
        ) {
          alternativeMoves.push(cellIndex)
        }
      }
    }
  }

  // Check columns for potential blocks
  for (let i = 0; i < 3; i++) {
    const col = [board[boardIndex][i], board[boardIndex][i + 3], board[boardIndex][i + 6]]
    if (countInLine(col, player) === 1 && countInLine(col, "") === 2) {
      // This column has one player mark and two empty cells - could be a future win
      for (let j = 0; j < 3; j++) {
        const cellIndex = i + j * 3
        if (
          board[boardIndex][cellIndex] === "" &&
          (!playerHasPotentialWin(board, cellIndex, player) || subBoardWinners[cellIndex] !== undefined)
        ) {
          alternativeMoves.push(cellIndex)
        }
      }
    }
  }

  // Check diagonals for potential blocks
  const diag1 = [board[boardIndex][0], board[boardIndex][4], board[boardIndex][8]]
  if (countInLine(diag1, player) === 1 && countInLine(diag1, "") === 2) {
    for (let i = 0; i < 3; i++) {
      const cellIndex = i * 4 // 0, 4, or 8
      if (
        board[boardIndex][cellIndex] === "" &&
        (!playerHasPotentialWin(board, cellIndex, player) || subBoardWinners[cellIndex] !== undefined)
      ) {
        alternativeMoves.push(cellIndex)
      }
    }
  }

  const diag2 = [board[boardIndex][2], board[boardIndex][4], board[boardIndex][6]]
  if (countInLine(diag2, player) === 1 && countInLine(diag2, "") === 2) {
    for (let i = 0; i < 3; i++) {
      const cellIndex = 2 + i * 2 // 2, 4, or 6
      if (
        board[boardIndex][cellIndex] === "" &&
        (!playerHasPotentialWin(board, cellIndex, player) || subBoardWinners[cellIndex] !== undefined)
      ) {
        alternativeMoves.push(cellIndex)
      }
    }
  }

  return alternativeMoves
}

// Update makeStrategicCellSelection to prioritize defensive strategy
function makeStrategicCellSelection(
  board: string[][],
  boardIndex: number,
  difficulty: string,
  subBoardWinners: SubBoardWinners,
  moveCount?: BoardMoveCount,
): Move | null {
  const isHardMode = difficulty === "hard"

  // DEFENSIVE STRATEGY (HIGHEST PRIORITY FOR HARD MODE)
  // First, identify all cells that don't send the player to a winning position
  if (isHardMode) {
    const emptyCells = []
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (board[boardIndex][cellIndex] === "") {
        emptyCells.push(cellIndex)
      }
    }

    // Filter for cells that don't send player to a winning position
    const safeCells = emptyCells.filter(
      (cellIndex) => !playerHasPotentialWin(board, cellIndex, "X") || subBoardWinners[cellIndex] !== undefined,
    )

    if (safeCells.length > 0) {
      // Now check if we can win or block within these safe cells

      // Check if we can win with a safe move
      for (const cellIndex of safeCells) {
        const testBoard = JSON.parse(JSON.stringify(board))
        testBoard[boardIndex][cellIndex] = "O"
        if (checkSubBoardWin(testBoard[boardIndex], "O")) {
          return { boardIndex, cellIndex }
        }
      }

      // Check if we can block with a safe move
      const blockingMove = findSubBoardWinningMove(board[boardIndex], "X")
      if (blockingMove !== null && safeCells.includes(blockingMove)) {
        return { boardIndex, cellIndex: blockingMove }
      }

      // If no winning or blocking moves among safe cells, use strategic selection

      // Try to take the center if it's safe
      if (safeCells.includes(4)) {
        return { boardIndex, cellIndex: 4 }
      }

      // Try to take corners if they're safe
      const safeCorners = [0, 2, 6, 8].filter((corner) => safeCells.includes(corner))
      if (safeCorners.length > 0) {
        return { boardIndex, cellIndex: safeCorners[Math.floor(Math.random() * safeCorners.length)] }
      }

      // Otherwise, just pick a random safe cell
      return { boardIndex, cellIndex: safeCells[Math.floor(Math.random() * safeCells.length)] }
    }
  }

  // If no safe cells found or not in hard mode, continue with regular strategy

  // Try to find a winning move in this sub-board
  const winningMove = findSubBoardWinningMove(board[boardIndex], "O")
  if (winningMove !== null) {
    return { boardIndex, cellIndex: winningMove }
  }

  // Try to block the player's winning move in this sub-board
  const blockingMove = findSubBoardWinningMove(board[boardIndex], "X")
  if (blockingMove !== null) {
    return { boardIndex, cellIndex: blockingMove }
  }

  // For hard difficulty, consider the strategic implications of the next move
  if (isHardMode) {
    // If we have move count data, try to send player to a board they haven't played in
    if (moveCount) {
      // Find cells that would send the player to boards they haven't played in
      // AND wouldn't allow them to win a sub-board
      const strategicCells = []
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (
          board[boardIndex][cellIndex] === "" &&
          (moveCount.X[cellIndex] === 0 || moveCount.O[cellIndex] > moveCount.X[cellIndex]) &&
          (!playerHasPotentialWin(board, cellIndex, "X") || subBoardWinners[cellIndex] !== undefined)
        ) {
          strategicCells.push(cellIndex)
        }
      }

      // If we found strategic cells, choose one randomly
      if (strategicCells.length > 0) {
        const cellIndex = strategicCells[Math.floor(Math.random() * strategicCells.length)]
        return { boardIndex, cellIndex }
      }
    }

    // Try to find a move that would send the player to a board that's already won or full
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (board[boardIndex][cellIndex] === "") {
        // This cell would send the player to board 'cellIndex'
        if (
          subBoardWinners[cellIndex] !== undefined || // Board is already won
          !board[cellIndex] || // Board doesn't exist (shouldn't happen)
          !board[cellIndex].some((cell) => cell === "") // Board is full
        ) {
          return { boardIndex, cellIndex }
        }
      }
    }
  }

  // Try to take the center of the sub-board if available
  if (board[boardIndex][4] === "") {
    return { boardIndex, cellIndex: 4 }
  }

  // Try to take corners of the sub-board if available
  const corners = [0, 2, 6, 8]
  for (const corner of corners) {
    if (board[boardIndex][corner] === "") {
      return { boardIndex, cellIndex: corner }
    }
  }

  // If no strategic move is found, make a random move on this board
  return makeRandomMoveOnBoard(board, boardIndex)
}

// Add a helper function to check if a sub-board has been won
function checkSubBoardWin(cells: string[], player: string): boolean {
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

// Find all possible winning moves in a sub-board for a specific player
function findAllWinningMoves(subBoard: string[], player: string): number[] {
  if (!subBoard) return []

  const winningMoves = []

  // Check rows
  for (let i = 0; i < 3; i++) {
    const row = [subBoard[i * 3], subBoard[i * 3 + 1], subBoard[i * 3 + 2]]
    const emptyIndex = findWinningPosition(row, player)
    if (emptyIndex !== null) {
      winningMoves.push(i * 3 + emptyIndex)
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    const col = [subBoard[i], subBoard[i + 3], subBoard[i + 6]]
    const emptyIndex = findWinningPosition(col, player)
    if (emptyIndex !== null) {
      winningMoves.push(i + emptyIndex * 3)
    }
  }

  // Check diagonals
  const diag1 = [subBoard[0], subBoard[4], subBoard[8]]
  const emptyIndex1 = findWinningPosition(diag1, player)
  if (emptyIndex1 !== null) {
    winningMoves.push(emptyIndex1 * 4) // 0, 4, or 8
  }

  const diag2 = [subBoard[2], subBoard[4], subBoard[6]]
  const emptyIndex2 = findWinningPosition(diag2, player)
  if (emptyIndex2 !== null) {
    winningMoves.push(2 + emptyIndex2 * 2) // 2, 4, or 6
  }

  return winningMoves
}

// Find a winning move in a sub-board for a specific player
function findSubBoardWinningMove(subBoard: string[], player: string): number | null {
  if (!subBoard) return null

  // Check rows
  for (let i = 0; i < 3; i++) {
    const row = [subBoard[i * 3], subBoard[i * 3 + 1], subBoard[i * 3 + 2]]
    const emptyIndex = findWinningPosition(row, player)
    if (emptyIndex !== null) {
      return i * 3 + emptyIndex
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    const col = [subBoard[i], subBoard[i + 3], subBoard[i + 6]]
    const emptyIndex = findWinningPosition(col, player)
    if (emptyIndex !== null) {
      return i + emptyIndex * 3
    }
  }

  // Check diagonals
  const diag1 = [subBoard[0], subBoard[4], subBoard[8]]
  const emptyIndex1 = findWinningPosition(diag1, player)
  if (emptyIndex1 !== null) {
    return emptyIndex1 * 4 // 0, 4, or 8
  }

  const diag2 = [subBoard[2], subBoard[4], subBoard[6]]
  const emptyIndex2 = findWinningPosition(diag2, player)
  if (emptyIndex2 !== null) {
    return 2 + emptyIndex2 * 2 // 2, 4, or 6
  }

  return null
}

// Find the empty position in a line (row, column, or diagonal) that would complete a win
function findWinningPosition(line: string[], player: string): number | null {
  if (line.filter((cell) => cell === player).length === 2 && line.filter((cell) => cell === "").length === 1) {
    return line.findIndex((cell) => cell === "")
  }
  return null
}

function makeRandomMove(board: string[][], size: number): Move | null {
  const emptyCells: Move[] = []

  for (let row = 0; row < size; row++) {
    if (!board[row]) continue
    for (let col = 0; col < size; col++) {
      if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }
  }

  if (emptyCells.length === 0) return null

  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

function findWinningMove(board: string[][], player: string, size: number): Move | null {
  // For 5x5 board, use specialized function
  if (size === 5) {
    return find5x5WinningMove(board, player)
  }

  // For 3x3 board
  // Check rows
  for (let row = 0; row < size; row++) {
    if (!board[row]) continue
    const emptyCells = []
    let playerCount = 0

    for (let col = 0; col < size; col++) {
      if (board[row][col] === player) {
        playerCount++
      } else if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }

    if (playerCount === size - 1 && emptyCells.length === 1) {
      return emptyCells[0]
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const emptyCells = []
    let playerCount = 0

    for (let row = 0; row < size; row++) {
      if (!board[row]) continue
      if (board[row][col] === player) {
        playerCount++
      } else if (board[row][col] === "") {
        emptyCells.push({ row, col })
      }
    }

    if (playerCount === size - 1 && emptyCells.length === 1) {
      return emptyCells[0]
    }
  }

  // Check diagonal 1
  {
    const emptyCells = []
    let playerCount = 0

    for (let i = 0; i < size; i++) {
      if (!board[i]) continue
      if (board[i][i] === player) {
        playerCount++
      } else if (board[i][i] === "") {
        emptyCells.push({ row: i, col: i })
      }
    }

    if (playerCount === size - 1 && emptyCells.length === 1) {
      return emptyCells[0]
    }
  }

  // Check diagonal 2
  {
    const emptyCells = []
    let playerCount = 0

    for (let i = 0; i < size; i++) {
      if (!board[i]) continue
      if (board[i][size - 1 - i] === player) {
        playerCount++
      } else if (board[i][size - 1 - i] === "") {
        emptyCells.push({ row: i, col: size - 1 - i })
      }
    }

    if (playerCount === size - 1 && emptyCells.length === 1) {
      return emptyCells[0]
    }
  }

  return null
}

// Function to make a random move on a specific board
function makeRandomMoveOnBoard(board: string[][], boardIndex: number): Move | null {
  const subBoard = board[boardIndex]
  if (!subBoard) return null

  const emptyCells: number[] = []

  for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
    if (subBoard[cellIndex] === "") {
      emptyCells.push(cellIndex)
    }
  }

  if (emptyCells.length === 0) return null

  const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  return { boardIndex, cellIndex: randomCellIndex }
}
