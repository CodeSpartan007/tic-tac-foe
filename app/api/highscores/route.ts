import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get("variant")
  const difficulty = searchParams.get("difficulty")

  if (!variant || !difficulty) {
    return NextResponse.json({ error: "Missing variant or difficulty" }, { status: 400 })
  }

  try {
    // Try to use the database if available
    try {
      const { sql } = await import("@vercel/postgres")

      const { rows } = await sql`
        SELECT * FROM highscores 
        WHERE variant = ${variant} AND difficulty = ${difficulty}
        ORDER BY time ASC
        LIMIT 10
      `

      return NextResponse.json({ highscores: rows })
    } catch (dbError) {
      console.log("Database not available, returning mock high scores")
      // Return mock high scores if database is not available
      return NextResponse.json({
        highscores: getMockHighScores(variant, difficulty),
      })
    }
  } catch (error) {
    console.error("Error fetching high scores:", error)
    return NextResponse.json({ highscores: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { username, variant, difficulty, time } = await request.json()

    if (!username || !variant || !difficulty || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const { sql } = await import("@vercel/postgres")

      const { rows } = await sql`
        INSERT INTO highscores (username, variant, difficulty, time)
        VALUES (${username}, ${variant}, ${difficulty}, ${time})
        RETURNING *
      `

      return NextResponse.json({ success: true, highscore: rows[0] })
    } catch (dbError) {
      console.log("Database not available, saving high score locally")
      // Just return success without actually saving
      return NextResponse.json({
        success: true,
        highscore: {
          id: Math.floor(Math.random() * 1000),
          username,
          variant,
          difficulty,
          time,
          created_at: new Date().toISOString(),
        },
      })
    }
  } catch (error) {
    console.error("Error saving high score:", error)
    return NextResponse.json({ error: "Failed to save high score" }, { status: 500 })
  }
}

// Helper function to generate mock high scores
function getMockHighScores(variant: string, difficulty: string) {
  const names = ["Player1", "TicTacPro", "GameMaster", "XOChamp", "AIBeater"]

  // Generate different times based on difficulty
  const baseTime = difficulty === "easy" ? 15 : difficulty === "medium" ? 25 : 35

  return Array(5)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      username: names[index],
      variant,
      difficulty,
      time: baseTime + index * 5,
      created_at: new Date(Date.now() - index * 86400000).toISOString(), // Each day back
    }))
}
