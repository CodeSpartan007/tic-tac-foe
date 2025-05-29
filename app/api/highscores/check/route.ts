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
    // Check if we have a database connection
    let isHighScore = false

    try {
      // Try to import the sql client - this will fail if no connection string is available
      const { sql } = await import("@vercel/postgres")

      // Check if this time is in the top 10
      const { rows } = await sql`
        SELECT COUNT(*) as count FROM highscores 
        WHERE variant = ${variant} AND difficulty = ${difficulty} AND time < ${Number.parseInt(time)}
      `

      isHighScore = Number.parseInt(rows[0].count) < 10
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
