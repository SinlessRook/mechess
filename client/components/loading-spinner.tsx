import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-amber-500 border-t-transparent",
          sizeClasses[size],
        )}
      />
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/40 p-8 rounded-lg flex flex-col items-center gap-4 border border-amber-800/30">
        <LoadingSpinner size="lg" />
        <p className="text-amber-400 animate-pulse">Loading chess data...</p>
      </div>
    </div>
  )
}
