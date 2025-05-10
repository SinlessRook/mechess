"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, Eye, Clock, Calendar, CastleIcon as ChessKnight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { api, handleApiError } from "@/lib/api"
import { FullPageLoader } from "@/components/loading-spinner"

export default function FeaturedGamesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [games, setGames] = useState<any[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true)
        const data = await api.getFeaturedGames()
        setGames(data)
        setError(null)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [])

  const filteredGames =
    filter === "all"
      ? games
      : filter === "classical"
        ? games.filter((game) => game.moves > 40)
        : games.filter((game) => game.moves <= 40)

  const handleLike = (id: number) => {
    setGames(
      games.map((game) => {
        if (game.id === id) {
          // If already liked, unlike it
          if (game.userLiked) {
            return { ...game, likes: game.likes - 1, userLiked: false }
          }
          // If disliked, remove dislike and add like
          if (game.userDisliked) {
            return {
              ...game,
              likes: game.likes + 1,
              dislikes: game.dislikes - 1,
              userLiked: true,
              userDisliked: false,
            }
          }
          // Otherwise just like it
          return { ...game, likes: game.likes + 1, userLiked: true }
        }
        return game
      }),
    )
  }

  const handleDislike = (id: number) => {
    setGames(
      games.map((game) => {
        if (game.id === id) {
          // If already disliked, remove dislike
          if (game.userDisliked) {
            return { ...game, dislikes: game.dislikes - 1, userDisliked: false }
          }
          // If liked, remove like and add dislike
          if (game.userLiked) {
            return {
              ...game,
              likes: game.likes - 1,
              dislikes: game.dislikes + 1,
              userLiked: false,
              userDisliked: true,
            }
          }
          // Otherwise just dislike it
          return { ...game, dislikes: game.dislikes + 1, userDisliked: true }
        }
        return game
      }),
    )
  }

  if (isLoading) {
    return <FullPageLoader />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Featured Games</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Featured Games</h1>

        <Tabs value={filter} onValueChange={setFilter} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3 bg-amber-950/50">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="classical">Classical</TabsTrigger>
            <TabsTrigger value="rapid">Rapid</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map((game) => (
          <Card key={game.id} className="chess-card overflow-hidden border-amber-900">
            <div className="relative">
              <Image
                src={game.image || "/placeholder.svg"}
                alt={`${game.white} vs ${game.black}`}
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">
                    {game.white} vs {game.black}
                  </h3>
                  <p className="text-sm opacity-90">{game.event}</p>
                </div>
              </div>
              <Badge className="absolute top-3 right-3 bg-black/70 hover:bg-black/70">{game.result}</Badge>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{game.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{game.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChessKnight className="h-4 w-4" />
                  <span>{game.moves} moves</span>
                </div>
              </div>

              <div className="mb-2">
                <Badge variant="outline" className="border-amber-800 bg-amber-950/30">
                  {game.opening}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{game.description}</p>
            </CardContent>

            <CardFooter className="flex justify-between p-4 pt-0">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex items-center gap-1", game.userLiked && "text-green-600")}
                  onClick={() => handleLike(game.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{game.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex items-center gap-1", game.userDisliked && "text-red-600")}
                  onClick={() => handleDislike(game.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{game.dislikes}</span>
                </Button>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{game.views.toLocaleString()}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
