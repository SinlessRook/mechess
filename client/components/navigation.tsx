"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CastleIcon as ChessKnight, Crown, Users, PlaySquare, Github } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { RefreshButton } from "@/components/refresh-button"
import { useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Leaderboard", path: "/", icon: <Crown className="h-4 w-4" /> },
    { name: "Players", path: "/players", icon: <Users className="h-4 w-4" /> },
    { name: "Featured Games", path: "/featured", icon: <PlaySquare className="h-4 w-4" /> },
  ]

  return (
    <header className="border-b border-zinc-800 bg-black sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center px-3 sm:px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <ChessKnight className="h-7 w-7 text-amber-500" />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
            Chess Tournament
          </span>
        </div>

        {/* Mobile menu button - hide it now that we use bottom nav */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          <Link
            href={process.env.NEXT_PUBLIC_GITHUB_URL || "#"} 
            rel="noopener noreferrer"
            target="_blank"
            className="text-muted-foreground hover:text-amber-500 transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <RefreshButton />
          <ThemeToggle />
        </div>

        {/* Desktop navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-6">
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

          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL || "#"} 
              target="_blank"
              className="text-muted-foreground hover:text-amber-500 transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <RefreshButton />
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-50">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:text-amber-500",
                pathname === item.path ? "text-amber-500" : "text-muted-foreground",
              )}
            >
              <div className="h-5 w-5 flex items-center justify-center">
                {/* @ts-ignore */}
                {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}  
              </div>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
