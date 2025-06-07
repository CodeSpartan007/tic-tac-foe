"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { ThemeButton } from "@/app/components/theme-button"
import { ThemeToggle } from "@/app/components/theme-toggle"

export default function HighScorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const variant = searchParams.get("variant") || ""
  const difficulty = searchParams.get("difficulty") || ""
  const time = searchParams.get("time") || "0"

  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [usingMockData, setUsingMockData] = useState(false)
  const [checkingDb, setCheckingDb] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  // Check if database is available
  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch("/api/highscores?variant=classic&difficulty=easy")
        const data = await response.json()
        setUsingMockData(data.usingMockData !== false)

        // Delay showing the alert to prevent flash
        setTimeout(() => {
          setCheckingDb(false)
          if (data.usingMockData !== false) {
            setShowAlert(true)
          }
        }, 1000)
      } catch (error) {
        setUsingMockData(true)
        setTimeout(() => {
          setCheckingDb(false)
          setShowAlert(true)
        }, 1000)
      }
    }

    checkDbStatus()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/highscores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          variant,
          difficulty,
          time: Number.parseInt(time),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit high score")
      }

      // Redirect to leaderboard
      router.push(`/leaderboard?variant=${variant}&difficulty=${difficulty}`)
    } catch (error) {
      console.error("Error submitting high score:", error)
      setError("Failed to submit high score. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">New High Score!</h1>

          {/* Only show alert when using mock data AND after checking is complete AND after delay */}
          {showAlert && usingMockData && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Database not connected</AlertTitle>
              <AlertDescription>
                The database is not connected yet. Your score will be displayed but not permanently saved.
              </AlertDescription>
            </Alert>
          )}

          <p className="mb-6">
            Congratulations! You've achieved a top 10 time for{" "}
            <span className="font-semibold">{variant.charAt(0).toUpperCase() + variant.slice(1)}</span> on{" "}
            <span className="font-semibold">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span> difficulty
            with a time of <span className="font-semibold">{formatTime(Number.parseInt(time))}</span>.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Enter your username:
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                maxLength={20}
                required
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit High Score"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
