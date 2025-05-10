"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Crown } from "lucide-react"
import { api, handleApiError } from "@/lib/api"
import { FullPageLoader } from "@/components/loading-spinner"

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<any>(null)
  const [rounds, setRounds] = useState<any[]>([])
  const [Currentleader, setCurrentleader] = useState<any>(null)
  const [tournamentname, setTournamentname] = useState<any>(null)


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const data = await api.getLeaderboard()
        api.getPlayers()
        setLeaderboardData(data.players)
        setRounds(data.rounds)
        setCurrentleader(data.currentleader)
        setTournamentname(data.currenttournament)
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return <FullPageLoader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Leaderboard</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{tournamentname?tournamentname:"Tournament"} Leaderboard</h1>
        <div className="flex items-center gap-2 bg-amber-950/50 px-3 py-1 rounded-full">
          <Crown className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium text-amber-300">Current Leader: {Currentleader}</span>
        </div>
      </div>

      <Card className="chess-card border-amber-900">
        <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
          <CardTitle>Tournament Progress</CardTitle>
          <CardDescription>View the results from each round of the tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={rounds[rounds.length - 1].name}>
            <TabsList className="mb-4 bg-amber-950/50">
              {rounds.map((round) => (
                <TabsTrigger key={round.id} value={round.name}>
                  {round.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {rounds.map((round) => (
              <TabsContent key={round.id} value={round.name}>
                <Table>
                  <TableHeader className="bg-amber-950/30">
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData[round.name].map((player: any, index: number) => (
                      <TableRow key={player.name} className={index % 2 === 0 ? "bg-amber-950/10" : ""}>
                        <TableCell className="font-medium">
                          {player.rank === 1 ? (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-amber-500" />
                              <span>{player.rank}</span>
                            </div>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell className="text-right">{player.rating}</TableCell>
                        <TableCell className="text-right font-medium">{player.score}</TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            player.performance.startsWith("+") ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {player.performance}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
