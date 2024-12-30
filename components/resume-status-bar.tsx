import { SavedResumeType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock } from "lucide-react"

interface ResumeStatusBarProps {
  currentResume?: SavedResumeType
  lastSaved?: Date
  isDirty: boolean
}

export function ResumeStatusBar({ currentResume, lastSaved, isDirty }: ResumeStatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {currentResume ? (
            <span>Editing: <span className="font-medium text-foreground">{currentResume.name}</span></span>
          ) : (
            <span>New Resume</span>
          )}
        </div>
        {lastSaved && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1.5 text-sm",
          isDirty ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
        )}>
          <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          <span>{isDirty ? "Unsaved changes" : "All changes saved"}</span>
        </div>
      </div>
    </div>
  )
} 