'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { MonthRangePicker } from "@/components/ui/month-range-picker"
import { FormattedInput } from "@/components/ui/formatted-input"
import AIImprovementButton from "@/components/ui/ai-improvement-button"
import { arrayMove } from '@dnd-kit/sortable'

interface WorkExperienceProps {
  workExperience: {
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    details: string[]
  }[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void
  handleDetailChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, detailIndex: number, section: string) => void
  removeField: (index: number, section: string) => void
  addField: (section: string) => void
  addDetail: (index: number, section: string) => void
  removeDetail: (index: number, detailIndex: number, section: string) => void
  onReorder?: (newOrder: WorkExperienceProps['workExperience']) => void
}

export default function WorkExperience({
  workExperience,
  handleChange,
  handleDetailChange,
  removeField,
  addField,
  addDetail,
  removeDetail,
  onReorder
}: WorkExperienceProps) {
  const handleDateChange = (index: number, dates: { startDate: string; endDate: string }) => {
    const e = {
      target: { value: dates.startDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e, index, 'workExperience', 'startDate')

    const e2 = {
      target: { value: dates.endDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e2, index, 'workExperience', 'endDate')
  }

  const renderWorkExperienceItem = (work: typeof workExperience[0], index: number) => (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-4 flex-1">
          <div className="grid gap-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>Company</Label>
              <Input
                id={`company-${index}`}
                placeholder="Company Name"
                value={work.company}
                onChange={(e) => handleChange(e, index, 'workExperience', 'company')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${index}`}>Position</Label>
              <Input
                id={`position-${index}`}
                placeholder="Job Title"
                value={work.position}
                onChange={(e) => handleChange(e, index, 'workExperience', 'position')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-${index}`}>Location</Label>
              <Input
                id={`location-${index}`}
                placeholder="Location"
                value={work.location}
                onChange={(e) => handleChange(e, index, 'workExperience', 'location')}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <MonthRangePicker
                startDate={work.startDate}
                endDate={work.endDate}
                onChange={(dates) => handleDateChange(index, dates)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Details</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDetail(index, 'workExperience')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Detail
                </Button>
              </div>
              <div className="space-y-2">
                {work.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="grid grid-cols-[1fr_auto_auto] gap-2 items-start">
                    <FormattedInput
                      value={detail}
                      onChange={(value) =>
                        handleDetailChange(
                          { target: { value } } as React.ChangeEvent<HTMLTextAreaElement>,
                          index,
                          detailIndex,
                          'workExperience'
                        )
                      }
                      placeholder="Add work detail..."
                    />
                    <AIImprovementButton
                      text={detail}
                      onTextImproved={(value) =>
                        handleDetailChange(
                          { target: { value } } as React.ChangeEvent<HTMLTextAreaElement>,
                          index,
                          detailIndex,
                          'workExperience'
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDetail(index, detailIndex, 'workExperience')}
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
            onClick={() => onReorder?.(arrayMove(workExperience, index, index - 1))}
            disabled={index === 0}
            className="h-8 w-8 hover:bg-muted"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(workExperience, index, index + 1))}
            disabled={index === workExperience.length - 1}
            className="h-8 w-8 hover:bg-muted"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeField(index, 'workExperience')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {workExperience.map((work, index) => renderWorkExperienceItem(work, index))}
      <Button onClick={() => addField('workExperience')} variant="outline" className="w-full">
        Add Work Experience
      </Button>
    </div>
  )
}