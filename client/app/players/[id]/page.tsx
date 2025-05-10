"use client"

import { useState, useEffect,use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Calendar, Clock, User, Flag, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, handleApiError } from "@/lib/api"
import { FullPageLoader } from "@/components/loading-spinner"
import { Player } from "@/lib/types"

export default function PlayerDetailPage({ params }: { params:Promise<{ id: string }> }) {
  const { id } = use(params); 
  const router = useRouter()
  const playerId = Number.parseInt(id)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true)
        const data = await api.getPlayerById(playerId)
        setPlayer(data)
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayer()
  }, [playerId])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (error || !player) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Player not found</h1>
        <p className="text-muted-foreground">{error || "Unable to load player data"}</p>
        <Button onClick={() => router.push("/players")}>Back to Players</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-amber-500 mb-4 -ml-2"
        onClick={() => router.push("/players")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Players
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Profile Card */}
        <Card className="chess-card border-amber-900 lg:col-span-1">
          <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {player.name}
                  {player.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Flag className="h-4 w-4" />
                  {player.country} • {player.title} • Age: {player.age}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xl font-bold bg-amber-950/50 border-amber-800">
                {player.rating}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center p-3 bg-amber-950/30 rounded-md">
                <span className="text-muted-foreground">Wins</span>
                <span className="font-bold text-green-600 text-lg">{player.wins}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-950/30 rounded-md">
                <span className="text-muted-foreground">Draws</span>
                <span className="font-bold text-amber-600 text-lg">{player.draws}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-950/30 rounded-md">
                <span className="text-muted-foreground">Losses</span>
                <span className="font-bold text-red-600 text-lg">{player.losses}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Biography</h3>
              <p className="text-sm text-muted-foreground">{player.bio}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Achievements</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                {player.achievements.map((achievement: string, index: number) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <Trophy className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Recent Tournaments</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                {player.tournaments.map((tournament: string, index: number) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <Award className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                    <span>{tournament}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Player Stats and Games */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-amber-950/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="games">Recent Games</TabsTrigger>
              <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card className="chess-card border-amber-900">
                <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Overview of {player.name}'s chess performance</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Bullet</h3>
                      <div className="bg-amber-950/30 p-3 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Win Rate</span>
                          <span className="font-medium text-green-600">
                            {player.stats.performance.bullet.winRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${player.stats.performance.bullet.winRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Games: {player.stats.performance.bullet.games}</span>
                          <span>Draw: {player.stats.performance.bullet.drawRate}%</span>
                          <span>Loss: {player.stats.performance.bullet.lossRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Rapid</h3>
                      <div className="bg-amber-950/30 p-3 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Win Rate</span>
                          <span className="font-medium text-green-600">{player.stats.performance.rapid.winRate}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${player.stats.performance.rapid.winRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Games: {player.stats.performance.rapid.games}</span>
                          <span>Draw: {player.stats.performance.rapid.drawRate}%</span>
                          <span>Loss: {player.stats.performance.rapid.lossRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Blitz</h3>
                      <div className="bg-amber-950/30 p-3 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Win Rate</span>
                          <span className="font-medium text-green-600">{player.stats.performance.blitz.winRate}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${player.stats.performance.blitz.winRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Games: {player.stats.performance.blitz.games}</span>
                          <span>Draw: {player.stats.performance.blitz.drawRate}%</span>
                          <span>Loss: {player.stats.performance.blitz.lossRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="chess-card border-amber-900">
                <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
                  <CardTitle>Favorite Openings</CardTitle>
                  <CardDescription>Most played chess openings and win rates</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader className="bg-amber-950/30">
                      <TableRow>
                        <TableHead>Opening</TableHead>
                        <TableHead className="text-right">Games</TableHead>
                        <TableHead className="text-right">Win Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {player.stats.openings.map((opening: any, index: number) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-amber-950/10" : ""}>
                          <TableCell className="font-medium">{opening.name}</TableCell>
                          <TableCell className="text-right">{opening.games}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium text-green-600">{opening.winRate}%</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="games" className="mt-6">
              <Card className="chess-card border-amber-900">
                <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Latest matches played by {player.name}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {player.recentGames.map((game: any, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border border-amber-900 hover:bg-amber-950/20 transition-colors cursor-pointer",
                          index % 2 === 0 ? "bg-amber-950/10" : "",
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-950/50 text-amber-400">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {player.name} vs {game.opponent}
                              </div>
                              <div className="text-sm text-muted-foreground">{game.event}</div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-bold",
                              game.result === "1-0"
                                ? "bg-green-950/30 text-green-400 border-green-800"
                                : game.result === "0-1"
                                  ? "bg-red-950/30 text-red-400 border-red-800"
                                  : "bg-amber-950/30 text-amber-400 border-amber-800",
                            )}
                          >
                            {game.result}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{game.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>View Game</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-amber-900 bg-amber-950/10 px-6 py-3">
                  <Button variant="outline" className="w-full border-amber-800 hover:bg-amber-950/50">
                    View All Games
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6 space-y-6">
              <Card className="chess-card border-amber-900">
                <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
                  <CardTitle>Rating History</CardTitle>
                  <CardDescription>Year-by-year rating progression</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader className="bg-amber-950/30">
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {player.stats.yearlyRating.map((year: any, index: number, array: any[]) => {
                        const prevRating = index > 0 ? array[index - 1].rating : year.rating
                        const change = year.rating - prevRating
                        return (
                          <TableRow key={index} className={index % 2 === 0 ? "bg-amber-950/10" : ""}>
                            <TableCell className="font-medium">{year.year}</TableCell>
                            <TableCell className="text-right">{year.rating}</TableCell>
                            <TableCell className="text-right">
                              {index === 0 ? (
                                "-"
                              ) : (
                                <span
                                  className={cn(
                                    "font-medium",
                                    change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-amber-600",
                                  )}
                                >
                                  {change > 0 ? "+" : ""}
                                  {change}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="chess-card border-amber-900">
                <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed statistics across different time controls</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Win/Draw/Loss Distribution</h3>
                      <div className="h-8 w-full rounded-md overflow-hidden flex">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${player.stats.performance.bullet.winRate}%` }}
                          title={`Wins: ${player.stats.performance.bullet.winRate}%`}
                        ></div>
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${player.stats.performance.bullet.drawRate}%` }}
                          title={`Draws: ${player.stats.performance.bullet.drawRate}%`}
                        ></div>
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: `${player.stats.performance.bullet.lossRate}%` }}
                          title={`Losses: ${player.stats.performance.bullet.lossRate}%`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                          <span>Wins ({player.stats.performance.bullet.winRate}%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                          <span>Draws ({player.stats.performance.bullet.drawRate}%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                          <span>Losses ({player.stats.performance.bullet.lossRate}%)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Total Games by Format</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>bullet</span>
                            <span>{player.stats.performance.bullet.games} games</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{
                                width: `${(player.stats.performance.bullet.games / (player.stats.performance.bullet.games + player.stats.performance.rapid.games + player.stats.performance.blitz.games)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Rapid</span>
                            <span>{player.stats.performance.rapid.games} games</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{
                                width: `${(player.stats.performance.rapid.games / (player.stats.performance.bullet.games + player.stats.performance.rapid.games + player.stats.performance.blitz.games)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Blitz</span>
                            <span>{player.stats.performance.blitz.games} games</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{
                                width: `${(player.stats.performance.blitz.games / (player.stats.performance.bullet.games + player.stats.performance.rapid.games + player.stats.performance.blitz.games)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
