"use client"

import { useState, useEffect, useRef } from "react"

interface GameTimerProps {
  isRunning: boolean
  onTimeUpdate: (time: number) => void
}

export function GameTimer({ isRunning, onTimeUpdate }: GameTimerProps) {
  const [time, setTime] = useState(0)
  const timeRef = useRef(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isRunning) {
      interval = setInterval(() => {
        const newTime = timeRef.current + 1
        timeRef.current = newTime
        setTime(newTime)
        onTimeUpdate(newTime)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, onTimeUpdate])

  // Reset the timer only when starting a new game, not when stopping
  useEffect(() => {
    if (isRunning) {
      // Reset timer when starting a new game
      timeRef.current = 0
      setTime(0)
    }
  }, [isRunning])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return <div className="text-2xl font-mono">{formatTime(time)}</div>
}
