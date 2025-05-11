"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { refreshApiComponent } from "@/lib/api"

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshApiComponent("players")

    setIsRefreshing(false)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      aria-label="Refresh data"
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
    </Button>
  )
}
