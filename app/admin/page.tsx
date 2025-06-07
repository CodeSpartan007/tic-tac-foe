import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DatabaseStatus } from "@/app/components/database-status"
import { ThemeButton } from "@/app/components/theme-button"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function AdminPage() {
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

        <h1 className="text-3xl font-bold mb-6">Database Administration</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <DatabaseStatus />
          </section>

          <section className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Database Setup Instructions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Verify Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure your Vercel project has the DATABASE_URL environment variable set by the Neon integration.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Initialize Database</h3>
                <p className="text-sm text-muted-foreground">
                  Run the initialization script in the scripts folder to create tables and sample data.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">3. Deploy to Vercel</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy your application to Vercel to test the database connection in production.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/api/db-health" target="_blank" className="inline-block text-primary hover:underline">
                → Test Database Connection (API)
              </Link>
              <br />
              <Link href="/leaderboard" className="inline-block text-primary hover:underline">
                → View Leaderboards
              </Link>
              <br />
              <Link href="/game/classic" className="inline-block text-primary hover:underline">
                → Test High Score Submission
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
