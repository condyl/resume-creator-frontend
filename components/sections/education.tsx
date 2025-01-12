'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip"
import { Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ChevronsUpDown, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { MonthRangePicker } from "@/components/ui/month-range-picker"
import { FormattedInput } from "@/components/ui/formatted-input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import SortableList from "@/components/ui/sortable-list"
import { arrayMove } from '@dnd-kit/sortable'

const degreeTypes = [
  "Associate Degree",
  "Bachelor of Arts",
  "Bachelor of Science",
  "Bachelor of Engineering",
  "Bachelor of Business Administration",
  "Master of Arts",
  "Master of Science",
  "Master of Business Administration",
  "Master of Engineering",
  "Doctor of Philosophy",
  "Doctor of Medicine",
  "Juris Doctor",
  "High School Diploma",
  "Certificate",
  "Diploma",
  "Other"
]

interface EducationProps {
  education: {
    school: string
    degree: string
    program: string
    location: string
    coursework: string
    startDate: string
    endDate: string
    showCoursework: boolean
  }[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void
  removeField: (index: number, section: string) => void
  addField: (section: string) => void
  onReorder?: (newOrder: EducationProps['education']) => void
}

export default function Education({
  education,
  handleChange,
  removeField,
  addField,
  onReorder
}: EducationProps) {
  const [open, setOpen] = useState<{ [key: number]: boolean }>({})

  const handleDateChange = (index: number, dates: { startDate: string; endDate: string }) => {
    const e = {
      target: { value: dates.startDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e, index, 'education', 'startDate')

    const e2 = {
      target: { value: dates.endDate }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e2, index, 'education', 'endDate')
  }

  const toggleCoursework = (index: number) => {
    const e = {
      target: { value: (!education[index].showCoursework).toString() }
    } as React.ChangeEvent<HTMLInputElement>
    handleChange(e, index, 'education', 'showCoursework')
  }

  const renderEducationItem = (edu: typeof education[0], index: number) => (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-4 min-w-0 overflow-hidden">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor={`school-${index}`}>School</Label>
              <Input
                id={`school-${index}`}
                placeholder="School Name"
                value={edu.school}
                onChange={(e) => handleChange(e, index, 'education', 'school')}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Popover open={open[index]} onOpenChange={(isOpen) => setOpen({ ...open, [index]: isOpen })}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open[index]}
                      className="w-full justify-between"
                    >
                      <span className="truncate">{edu.degree ? edu.degree : "Select degree..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search degree..." />
                      <CommandEmpty>No degree found.</CommandEmpty>
                      <CommandGroup>
                        {degreeTypes.map((degree) => (
                          <CommandItem
                            key={degree}
                            onSelect={() => {
                              handleChange(
                                { target: { value: degree } } as React.ChangeEvent<HTMLInputElement>,
                                index,
                                'education',
                                'degree'
                              )
                              setOpen({ ...open, [index]: false })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                edu.degree === degree ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {degree}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {edu.degree === '' && (
                  <Input
                    placeholder="Enter custom degree"
                    value={edu.degree}
                    onChange={(e) => handleChange(e, index, 'education', 'degree')}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`program-${index}`}>Program</Label>
                <Input
                  id={`program-${index}`}
                  placeholder="e.g., Computer Science"
                  value={edu.program}
                  onChange={(e) => handleChange(e, index, 'education', 'program')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-${index}`}>Location</Label>
              <Input
                id={`location-${index}`}
                placeholder="Location"
                value={edu.location}
                onChange={(e) => handleChange(e, index, 'education', 'location')}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <MonthRangePicker
                startDate={edu.startDate}
                endDate={edu.endDate}
                onChange={(dates) => handleDateChange(index, dates)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={`coursework-${index}`}>Relevant Coursework</Label>
                <ButtonWithTooltip
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCoursework(index);
                  }}
                  className="shrink-0"
                  tooltipText={edu.showCoursework ? "Hide coursework" : "Show coursework"}
                  ariaLabel={edu.showCoursework ? "Hide coursework" : "Show coursework"}
                  icon={edu.showCoursework ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                />
              </div>
              <Input
                id={`coursework-${index}`}
                placeholder="e.g., Data Structures, Algorithms, Machine Learning..."
                value={edu.coursework}
                onChange={(e) => handleChange(e, index, 'education', 'coursework')}
              />
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 sm:pl-4 sm:border-l border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0">
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(education, index, index - 1))}
            disabled={index === 0}
            className="h-8 w-8"
            tooltipText="Move up"
            ariaLabel="Move education up"
            icon={<ArrowUp className="h-4 w-4" />}
          />
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(education, index, index + 1))}
            disabled={index === education.length - 1}
            className="h-8 w-8"
            tooltipText="Move down"
            ariaLabel="Move education down"
            icon={<ArrowDown className="h-4 w-4" />}
          />
          <ButtonWithTooltip
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeField(index, 'education')}
            tooltipText="Delete education"
            ariaLabel="Delete education"
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {education.map((edu, index) => renderEducationItem(edu, index))}
      <Button onClick={() => addField('education')} variant="outline" className="w-full">
        Add Education
      </Button>
    </div>
  )
}