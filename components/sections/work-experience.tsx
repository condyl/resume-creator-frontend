'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip"
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react"
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

  const renderWorkExperienceItem = (work: WorkExperienceProps['workExperience'][0], index: number) => (
    <div key={index} className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="grid gap-4">
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
                    <ButtonWithTooltip
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDetail(index, detailIndex, 'workExperience')}
                      tooltipText="Delete detail"
                      ariaLabel="Delete work experience detail"
                      icon={<Trash2 className="h-4 w-4" />}
                      className="hover:bg-destructive hover:text-destructive-foreground shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 sm:pl-4 sm:border-l border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0">
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(workExperience, index, index - 1))}
            disabled={index === 0}
            className="h-8 w-8"
            tooltipText="Move up"
            ariaLabel="Move work experience up"
            icon={<ArrowUp className="h-4 w-4" />}
          />
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(workExperience, index, index + 1))}
            disabled={index === workExperience.length - 1}
            className="h-8 w-8"
            tooltipText="Move down"
            ariaLabel="Move work experience down"
            icon={<ArrowDown className="h-4 w-4" />}
          />
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeField(index, 'workExperience')}
            tooltipText="Delete work experience"
            ariaLabel="Delete work experience"
            icon={<Trash2 className="h-4 w-4" />}
          />
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