import { cn } from "@/lib/utils"

interface SectionProgressProps {
  completed: number
  total: number
  className?: string
}

export function SectionProgress({ completed, total, className }: SectionProgressProps) {
  const percentage = Math.round((completed / total) * 100)
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500",
            percentage === 100 ? "bg-green-500" : "bg-blue-500",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {percentage}%
      </span>
    </div>
  )
} 