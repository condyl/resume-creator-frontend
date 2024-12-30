'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SavedResumeType } from "@/lib/types"
import { saveResume, updateResume } from "@/lib/resume"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface SaveResumeDialogProps {
  onSave: (savedResume: SavedResumeType) => void
  resumeData: Omit<SavedResumeType, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  currentResume?: SavedResumeType
}

export function SaveResumeDialog({ onSave, resumeData, currentResume }: SaveResumeDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const { toast } = useToast()

  const handleSave = async (isNew: boolean = false) => {
    if (!isNew && currentResume) {
      // Update existing resume
      setSaving(true)
      try {
        const { data, error } = await updateResume(currentResume.id, {
          ...resumeData,
          name: currentResume.name
        })

        if (error) throw error

        if (data) {
          onSave(data as SavedResumeType)
          toast({
            title: "Success",
            description: "Resume updated successfully",
          })
          setOpen(false)
        }
      } catch (error) {
        console.error('Error updating resume:', error)
        toast({
          title: "Error",
          description: "Failed to update resume. Please try again.",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
      return
    }

    // Save new resume
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your resume",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { data, error } = await saveResume({
        ...resumeData,
        name
      })

      if (error) throw error

      if (data) {
        onSave(data as SavedResumeType)
        toast({
          title: "Success",
          description: "Resume saved successfully",
        })
        setOpen(false)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center">
      {currentResume ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Save
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSave(false)}>
              Update &quot;{currentResume.name}&quot;
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Save as new resume...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>Save Resume</Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
            <DialogDescription>
              Enter a name for your resume to save it to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="My Resume"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleSave(true)} disabled={saving}>
              {saving ? "Saving..." : "Save Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 