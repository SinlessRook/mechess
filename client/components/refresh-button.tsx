"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { refreshApiComponent } from "@/lib/api"
import { usePathname } from "next/navigation"

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pathname = usePathname()

  const getRefreshTarget = () => {
    if (pathname === "/") return "leaderboard"
    if (pathname === "/featured") return "featuredGames"
    if (pathname.startsWith("/players/")) return "playerDetails"
    return "players"
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refreshApiComponent(getRefreshTarget())
      // Force remount so pages that fetch in useEffect pick up refreshed data.
      window.location.reload()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      aria-label="Refresh data"
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-5 w-5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
    </Button>
  )
}
