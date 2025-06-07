"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle } from "lucide-react"

interface DatabaseStatus {
  connected: boolean
  status: string
  message: string
  timestamp?: string
  version?: string
  tableExists?: boolean
  recordCount?: number
}

export function DatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db-health")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      setDbStatus({
        connected: false,
        status: "error",
        message: "Failed to check database status",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (!dbStatus) {
    return (
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Checking database connection...</AlertTitle>
      </Alert>
    )
  }

  const getAlertStyle = () => {
    if (!dbStatus.connected) {
      return "border-red-200 bg-red-50 dark:bg-red-950/30"
    }
    if (dbStatus.connected && !dbStatus.tableExists) {
      return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30"
    }
    return "border-green-200 bg-green-50 dark:bg-green-950/30"
  }

  const getIcon = () => {
    if (!dbStatus.connected) {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
    if (dbStatus.connected && !dbStatus.tableExists) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  const getStatusText = () => {
    if (!dbStatus.connected) return "Disconnected"
    if (dbStatus.connected && !dbStatus.tableExists) return "Connected (Setup Required)"
    return "Connected & Ready"
  }

  return (
    <Alert className={getAlertStyle()}>
      {getIcon()}
      <AlertTitle className="flex items-center justify-between">
        Database Status: {getStatusText()}
        <Button variant="outline" size="sm" onClick={checkDatabaseStatus} disabled={loading}>
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-1">
          <p>{dbStatus.message}</p>
          {dbStatus.connected && dbStatus.timestamp && (
            <p className="text-xs text-muted-foreground">
              Last checked: {new Date(dbStatus.timestamp).toLocaleString()}
            </p>
          )}
          {dbStatus.connected && dbStatus.version && (
            <p className="text-xs text-muted-foreground">Database: {dbStatus.version.split(" ")[0]}</p>
          )}
          {dbStatus.connected && dbStatus.tableExists !== undefined && (
            <p className="text-xs text-muted-foreground">
              Tables: {dbStatus.tableExists ? "✓ Created" : "⚠ Missing (will auto-create)"}
            </p>
          )}
          {dbStatus.connected && dbStatus.tableExists && dbStatus.recordCount !== undefined && (
            <p className="text-xs text-muted-foreground">Records: {dbStatus.recordCount} high scores</p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
