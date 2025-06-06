import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const variant = searchParams.get("variant")
  const difficulty = searchParams.get("difficulty")
  const time = searchParams.get("time")

  if (!variant || !difficulty || !time) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    let isHighScore = false

    try {
      // Try to use Neon database
      const { neon } = await import("@neondatabase/serverless")

      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not available")
      }

      const sql = neon(process.env.DATABASE_URL)

      // Check if table exists first
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'highscores'
        );
      `

      if (!tableExists[0].exists) {
        // If table doesn't exist, consider it a high score (will be created when saving)
        isHighScore = Number.parseInt(time) < 60
      } else {
        // Check if this time is in the top 10
        const rows = await sql`
          SELECT COUNT(*) as count FROM highscores 
          WHERE variant = ${variant} AND difficulty = ${difficulty} AND time < ${Number.parseInt(time)}
        `

        isHighScore = Number.parseInt(rows[0].count) < 10
      }
    } catch (dbError) {
      console.log("Database not available, using fallback high score logic")
      // Fallback logic: Consider any win under 30 seconds a high score
      isHighScore = Number.parseInt(time) < 30
    }

    return NextResponse.json({ isHighScore })
  } catch (error) {
    console.error("Error checking high score:", error)
    return NextResponse.json({ isHighScore: false }, { status: 200 })
  }
}
