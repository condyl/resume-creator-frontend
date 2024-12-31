'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronsUpDown, Check, Eye, EyeOff, GripVertical } from "lucide-react"
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
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-4 flex-1">
          <div className="grid gap-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor={`school-${index}`}>School</Label>
              <Input
                id={`school-${index}`}
                placeholder="School Name"
                value={edu.school}
                onChange={(e) => handleChange(e, index, 'education', 'school')}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {edu.degree || "Select degree..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] sm:w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search degrees..." />
                      <CommandEmpty>No degree found.</CommandEmpty>
                      <CommandGroup>
                        {degreeTypes.map((degree) => (
                          <CommandItem
                            key={degree}
                            value={degree}
                            onSelect={(currentValue) => {
                              const value = currentValue === currentValue.toLowerCase() ? degree : currentValue;
                              handleChange(
                                { target: { value: value === 'Other' ? '' : value } } as React.ChangeEvent<HTMLInputElement>,
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
              <Label htmlFor={`coursework-${index}`}>Relevant Coursework</Label>
              <div className="flex gap-2 min-w-0">
                <Input
                  id={`coursework-${index}`}
                  placeholder="e.g., Data Structures, Algorithms, Machine Learning..."
                  value={edu.coursework}
                  onChange={(e) => handleChange(e, index, 'education', 'coursework')}
                  className="min-w-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCoursework(index);
                  }}
                  className="h-10 w-10 shrink-0"
                >
                  {edu.showCoursework ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-2 border-l">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(education, index, index - 1))}
            disabled={index === 0}
            className="h-8 w-8 hover:bg-muted"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReorder?.(arrayMove(education, index, index + 1))}
            disabled={index === education.length - 1}
            className="h-8 w-8 hover:bg-muted"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeField(index, 'education')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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