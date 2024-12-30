'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SavedResumeType } from "@/lib/types"
import { loadResumes, deleteResume } from "@/lib/resume"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from 'date-fns'

interface SavedResumesDialogProps {
  onLoad: (resume: SavedResumeType) => void
}

export function SavedResumesDialog({ onLoad }: SavedResumesDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [resumes, setResumes] = React.useState<SavedResumeType[]>([])
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  const loadSavedResumes = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await loadResumes()
      if (error) throw error
      if (data) {
        setResumes(data)
      }
    } catch (error) {
      console.error('Error loading resumes:', error)
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteResume(id)
      if (error) throw error
      
      setResumes(resumes.filter(resume => resume.id !== id))
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting resume:', error)
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLoad = (resume: SavedResumeType) => {
    onLoad(resume)
    setOpen(false)
    toast({
      title: "Success",
      description: "Resume loaded successfully",
    })
  }

  React.useEffect(() => {
    if (open) {
      loadSavedResumes()
    }
  }, [open, loadSavedResumes])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Load Resume</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Saved Resumes</DialogTitle>
          <DialogDescription>
            Select a resume to load or manage your saved resumes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-4">No saved resumes found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>{resume.name}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(resume)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 