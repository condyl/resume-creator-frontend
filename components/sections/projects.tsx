'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { FormattedInput } from "@/components/ui/formatted-input"
import { MonthRangePicker } from "@/components/ui/month-range-picker"
import AIImprovementButton from "@/components/ui/ai-improvement-button"
import { arrayMove } from '@dnd-kit/sortable'

interface ProjectsProps {
  projects: {
    name: string
    technologies: string
    liveUrl: string
    githubUrl: string
    details: string[]
    startDate: string
    endDate: string
    showDate: boolean
  }[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void
  handleDetailChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => void
  removeField: (index: number, section: string) => void
  addField: (section: string) => void
  addDetail: (index: number, section: string) => void
  removeDetail: (index: number, detailIndex: number, section: string) => void
  onReorder?: (newOrder: ProjectsProps['projects']) => void
}

export default function Projects({
  projects,
  handleChange,
  handleDetailChange,
  removeField,
  addField,
  addDetail,
  removeDetail,
  onReorder
}: ProjectsProps) {
  const handleDateChange = (index: number, dates: { startDate: string; endDate: string }) => {
    const e = {
      target: { value: dates.startDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e, index, 'projects', 'startDate')

    const e2 = {
      target: { value: dates.endDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e2, index, 'projects', 'endDate')
  }

  const toggleDate = (index: number) => {
    const e = {
      target: { value: String(!projects[index].showDate) }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e, index, 'projects', 'showDate')
  }

  const renderProjectItem = (project: typeof projects[0], index: number) => (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-4 flex-1">
          <div className="grid gap-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Project Name</Label>
              <Input
                id={`name-${index}`}
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleChange(e, index, 'projects', 'name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
              <FormattedInput
                value={project.technologies}
                onChange={(value) =>
                  handleChange(
                    { target: { value } } as React.ChangeEvent<HTMLInputElement>,
                    index,
                    'projects',
                    'technologies'
                  )
                }
                placeholder="e.g., React, Node.js, MongoDB..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`liveUrl-${index}`}>Live Demo URL</Label>
                <Input
                  id={`liveUrl-${index}`}
                  placeholder="https://..."
                  value={project.liveUrl}
                  onChange={(e) => handleChange(e, index, 'projects', 'liveUrl')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`githubUrl-${index}`}>GitHub URL</Label>
                <Input
                  id={`githubUrl-${index}`}
                  placeholder="https://github.com/..."
                  value={project.githubUrl}
                  onChange={(e) => handleChange(e, index, 'projects', 'githubUrl')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex items-center gap-2 justify-between">
                <MonthRangePicker
                  startDate={project.startDate}
                  endDate={project.endDate}
                  onChange={(dates) => handleDateChange(index, dates)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDate(index);
                  }}
                  className="h-10 w-10 shrink-0"
                >
                  {project.showDate ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Details</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDetail(index, 'projects')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Detail
                </Button>
              </div>
              <div className="space-y-2">
                {project.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 items-start">
                    <FormattedInput
                      value={detail}
                      onChange={(value) =>
                        handleDetailChange(
                          { target: { value } } as React.ChangeEvent<HTMLTextAreaElement>,
                          index,
                          detailIndex,
                          'projects'
                        )
                      }
                      placeholder="Add project detail..."
                    />
                    <AIImprovementButton
                      text={detail}
                      onTextImproved={(value) =>
                        handleDetailChange(
                          { target: { value } } as React.ChangeEvent<HTMLTextAreaElement>,
                          index,
                          detailIndex,
                          'projects'
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDetail(index, detailIndex, 'projects')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-2 border-l">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(projects, index, index - 1))}
            disabled={index === 0}
            className="h-8 w-8 hover:bg-muted"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(projects, index, index + 1))}
            disabled={index === projects.length - 1}
            className="h-8 w-8 hover:bg-muted"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeField(index, 'projects')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {projects.map((project, index) => renderProjectItem(project, index))}
      <Button onClick={() => addField('projects')} variant="outline" className="w-full">
        Add Project
      </Button>
    </div>
  )
}