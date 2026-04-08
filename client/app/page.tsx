"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Crown } from "lucide-react"
import { api, apiCache, handleApiError } from "@/lib/api"
import { ChessLoader } from "@/components/loading-chessboard"
import { useIsMobile } from "@/hooks/use-mobile"


export default function LeaderboardPage() {
  const cachedLeaderboard = apiCache.getLeaderboard()
  const hasCachedLeaderboard = cachedLeaderboard !== null
  const cachedNoActiveTournament = typeof cachedLeaderboard?.error === "string" && cachedLeaderboard.error.toLowerCase().includes("no active tournament")

  const [isLoading, setIsLoading] = useState(!hasCachedLeaderboard)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<any>(cachedNoActiveTournament ? {} : (cachedLeaderboard?.players ?? {}))
  const [rounds, setRounds] = useState<any[]>(cachedNoActiveTournament ? [] : (Array.isArray(cachedLeaderboard?.rounds) ? cachedLeaderboard.rounds : []))
  const [Currentleader, setCurrentleader] = useState<any>(cachedNoActiveTournament ? null : (cachedLeaderboard?.currentleader ?? null))
  const [tournamentname, setTournamentname] = useState<any>(cachedNoActiveTournament ? null : (cachedLeaderboard?.currenttournament ?? null))
  const [noActiveTournament, setNoActiveTournament] = useState(cachedNoActiveTournament)
  const isMobile = useIsMobile()


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (!hasCachedLeaderboard) {
          setIsLoading(true)
        }
        const data = await api.getLeaderboard()
        api.getPlayers()

        const apiError = typeof data?.error === "string" ? data.error : ""
        const hasNoActiveTournament = apiError.toLowerCase().includes("no active tournament")

        if (hasNoActiveTournament) {
          setNoActiveTournament(true)
          setLeaderboardData({})
          setRounds([])
          setCurrentleader(null)
          setTournamentname(null)
          setError(null)
          return
        }

        setNoActiveTournament(false)
        setLeaderboardData(data?.players ?? {})
        setRounds(Array.isArray(data?.rounds) ? data.rounds : [])
        setCurrentleader(data?.currentleader ?? null)
        setTournamentname(data?.currenttournament ?? null)
        setError(null)
      } catch (err) {
        const message = handleApiError(err)
        if (message.toLowerCase().includes("no active tournament")) {
          setNoActiveTournament(true)
          setLeaderboardData({})
          setRounds([])
          setCurrentleader(null)
          setTournamentname(null)
          setError(null)
          return
        }
        setNoActiveTournament(false)
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return <ChessLoader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Leaderboard</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (noActiveTournament) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tournament Leaderboard</h1>
        </div>
        <Card className="chess-card border-amber-900">
          <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
            <CardTitle>No Active Tournament</CardTitle>
            <CardDescription>Start a tournament from admin to view leaderboard progress.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const defaultRoundName = rounds.length > 0 ? rounds[rounds.length - 1]?.name : ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{tournamentname?tournamentname:"Tournament"} Leaderboard</h1>
        <div className="flex items-center gap-2 bg-amber-950/50 px-3 py-1 rounded-full">
          <Crown className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium text-amber-300 hidden md:inline">Current Leader: {Currentleader}</span>
          <span className="text-sm font-medium text-amber-300 md:hidden">{Currentleader}</span>
        </div>
      </div>

      <Card className="chess-card border-amber-900">
        <CardHeader className="bg-gradient-to-r from-zinc-900 to-black">
          <CardTitle>Tournament Progress</CardTitle>
          <CardDescription>View the results from each round of the tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultRoundName}>
            <TabsList className="mb-4 bg-amber-950/50">
              {rounds.map((round) => (
                <TabsTrigger key={round.id} value={round.name}>
                  {isMobile ? round.name.slice(0, 1)+round.name.slice(-1) : round.name}
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
                      <TableHead className="text-right hidden md:table-cell">Rating</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(Array.isArray(leaderboardData?.[round.name]) ? leaderboardData[round.name] : []).map((player: any, index: number) => (
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
                        <TableCell className="text-right hidden md:table-cell">{player.rating}</TableCell>
                        <TableCell className="text-right font-medium">{player.score}</TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium hidden md:table-cell",
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
