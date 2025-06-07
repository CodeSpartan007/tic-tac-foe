import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to import and use the Neon client
    const { neon } = await import("@neondatabase/serverless")

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "error",
        message: "DATABASE_URL environment variable not found",
        connected: false,
      })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test the connection with a simple query
    const result = await sql`SELECT NOW() as current_time, version() as db_version`

    // Check if highscores table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'highscores'
      );
    `

    // Count records if table exists
    let recordCount = 0
    if (tableExists[0].exists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM highscores`
      recordCount = Number.parseInt(countResult[0].count)
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      connected: true,
      timestamp: result[0].current_time,
      version: result[0].db_version,
      tableExists: tableExists[0].exists,
      recordCount: recordCount,
    })
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown database error",
        connected: false,
      },
      { status: 500 },
    )
  }
}
