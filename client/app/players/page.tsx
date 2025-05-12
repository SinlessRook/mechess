"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Trophy, TrendingUp, TrendingDown, User, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, handleApiError } from "@/lib/api"
import { ChessLoader } from "@/components/loading-chessboard"
import { useDebounce } from "@/hooks/use-debounce"

export default function PlayersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<any[]>([])

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        const data = await api.getPlayers()
        for (let index = 0; index < data.length; index++) {
          api.getPlayerById(data[index].id)
          
        }
        setPlayers(data)
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // Filter players based on search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )

  const handlePlayerClick = (playerId: number) => {
    router.push(`/players/${playerId}`)
  }

  if (isLoading) {
    return <ChessLoader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Players</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>

        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players or countries..."
            className="pl-8 border-amber-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-[200px] ml-auto grid-cols-2 bg-amber-950/50">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="chess-card overflow-hidden border-amber-900 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <CardHeader className="pb-2 bg-gradient-to-r from-zinc-900 to-black">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {player.name}
                          {player.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {player.country} • {player.title}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold bg-amber-950/50 border-amber-800">
                        {player.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 bg-amber-950/30 rounded-md">
                          <span className="text-muted-foreground">Wins</span>
                          <span className="font-bold text-green-600">{player.wins}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-amber-950/30 rounded-md">
                          <span className="text-muted-foreground">Draws</span>
                          <span className="font-bold text-amber-600">{player.draws}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-amber-950/30 rounded-md">
                          <span className="text-muted-foreground">Losses</span>
                          <span className="font-bold text-red-600">{player.losses}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Achievements</h4>
                        <ul className="text-sm text-muted-foreground">
                          {player.achievements.slice(0, 2).map((achievement: string, index: number) => (
                            <li key={index} className="flex items-start gap-1">
                              <Trophy className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-sm text-amber-500 flex items-center justify-end gap-1 mt-2">
                        <span>View profile</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card className="chess-card border-amber-900">
              <CardContent className="p-0">
                <div className="divide-y divide-amber-900">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 hover:bg-amber-950/20 cursor-pointer"
                      onClick={() => handlePlayerClick(player.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-950/50 text-amber-400">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {player.name}
                            {player.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.country} • {player.title} • Age: {player.age}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{player.rating}</div>
                          <div
                            className={cn(
                              "text-sm font-medium",
                              player.performance.startsWith("+") ? "text-green-600" : "text-red-600",
                            )}
                          >
                            {player.performance}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-amber-500">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
