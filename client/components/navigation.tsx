"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CastleIcon as ChessKnight, Crown, Users, PlaySquare } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Leaderboard", path: "/", icon: <Crown className="h-4 w-4" /> },
    { name: "Players", path: "/players", icon: <Users className="h-4 w-4" /> },
    { name: "Featured Games", path: "/featured", icon: <PlaySquare className="h-4 w-4" /> },
  ]

  return (
    <header className="border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-black">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <ChessKnight className="h-7 w-7 text-amber-500" />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
            Chess Tournament
          </span>
        </div>
        <nav className="ml-auto flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-amber-500",
                pathname === item.path ? "text-amber-500 border-b-2 border-amber-500" : "text-muted-foreground",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
