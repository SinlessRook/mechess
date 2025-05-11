import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chess Tournament Platform",
  description: "A platform for hosting and managing chess tournaments",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
            <footer className="border-t border-zinc-800 py-4 bg-black">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Chess Tournament Platform
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
