import { NextResponse } from "next/server"

// Function to ensure the database schema exists
async function ensureSchema(sql: any) {
  try {
    // Check if the highscores table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'highscores'
      );
    `

    if (!tableExists[0].exists) {
      console.log("Creating highscores table...")

      // Create the highscores table
      await sql`
        CREATE TABLE highscores (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          variant VARCHAR(20) NOT NULL CHECK (variant IN ('classic', '5x5', 'ultimate')),
          difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
          time INTEGER NOT NULL CHECK (time > 0),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `

      // Create indexes for faster queries
      await sql`CREATE INDEX idx_highscores_variant ON highscores(variant);`
      await sql`CREATE INDEX idx_highscores_difficulty ON highscores(difficulty);`
      await sql`CREATE INDEX idx_highscores_time ON highscores(time);`
      await sql`CREATE INDEX idx_highscores_variant_difficulty ON highscores(variant, difficulty);`

      // Insert sample data
      await sql`
        INSERT INTO highscores (username, variant, difficulty, time) VALUES
        ('GameMaster', 'classic', 'easy', 12),
        ('SpeedRunner', 'classic', 'easy', 15),
        ('TicTacPro', 'classic', 'easy', 18),
        ('QuickWin', 'classic', 'easy', 22),
        ('FastPlayer', 'classic', 'easy', 25),
        ('StrategyKing', 'classic', 'medium', 28),
        ('ThinkFast', 'classic', 'medium', 32),
        ('CleverMove', 'classic', 'medium', 35),
        ('SmartPlay', 'classic', 'medium', 38),
        ('TacticMaster', 'classic', 'medium', 42),
        ('AIBeater', 'classic', 'hard', 45),
        ('ChessGrand', 'classic', 'hard', 48),
        ('LogicLord', 'classic', 'hard', 52),
        ('BrainPower', 'classic', 'hard', 55),
        ('MindGames', 'classic', 'hard', 58),
        ('GridMaster', '5x5', 'medium', 65),
        ('BigBoard', '5x5', 'medium', 72),
        ('FiveInRow', '5x5', 'medium', 78),
        ('LargeGrid', '5x5', 'medium', 85),
        ('ExtendedPlay', '5x5', 'medium', 92),
        ('UltimateWin', 'ultimate', 'hard', 120),
        ('MetaGame', 'ultimate', 'hard', 135),
        ('NineBoards', 'ultimate', 'hard', 148),
        ('ComplexPlay', 'ultimate', 'hard', 162),
        ('UltimateChamp', 'ultimate', 'hard', 175);
      `

      console.log("Database schema created successfully!")
    }
  } catch (error) {
    console.error("Error ensuring schema:", error)
    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get("variant")
  const difficulty = searchParams.get("difficulty")

  if (!variant || !difficulty) {
    return NextResponse.json({ error: "Missing variant or difficulty" }, { status: 400 })
  }

  try {
    // Try to use Neon database
    const { neon } = await import("@neondatabase/serverless")

    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not found, returning mock high scores")
      return NextResponse.json({
        highscores: getMockHighScores(variant, difficulty),
        usingMockData: true,
      })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Ensure the database schema exists
    await ensureSchema(sql)

    const rows = await sql`
      SELECT * FROM highscores 
      WHERE variant = ${variant} AND difficulty = ${difficulty}
      ORDER BY time ASC
      LIMIT 10
    `

    return NextResponse.json({
      highscores: rows,
      usingMockData: false,
    })
  } catch (error) {
    console.error("Database error:", error)
    console.log("Falling back to mock high scores")
    // Return mock high scores if database is not available
    return NextResponse.json({
      highscores: getMockHighScores(variant, difficulty),
      usingMockData: true,
    })
  }
}

export async function POST(request: Request) {
  try {
    const { username, variant, difficulty, time } = await request.json()

    if (!username || !variant || !difficulty || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Try to use Neon database
    const { neon } = await import("@neondatabase/serverless")

    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not found, simulating save")
      return NextResponse.json({
        success: true,
        usingMockData: true,
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

    const sql = neon(process.env.DATABASE_URL)

    // Ensure the database schema exists
    await ensureSchema(sql)

    const rows = await sql`
      INSERT INTO highscores (username, variant, difficulty, time)
      VALUES (${username}, ${variant}, ${difficulty}, ${time})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      usingMockData: false,
      highscore: rows[0],
    })
  } catch (error) {
    console.error("Error saving high score:", error)
    // Return success with mock data if there's an error
    const { username, variant, difficulty, time } = await request.json()
    return NextResponse.json({
      success: true,
      usingMockData: true,
      highscore: {
        id: Math.floor(Math.random() * 1000),
        username: username || "Player",
        variant: variant || "classic",
        difficulty: difficulty || "medium",
        time: time || 30,
        created_at: new Date().toISOString(),
      },
    })
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
