'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (dates: { startDate: string; endDate: string }) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isPresent, setIsPresent] = useState(endDate === 'Present')
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return
    onChange({
      startDate: date.toISOString(),
      endDate: isPresent ? 'Present' : endDate
    })
    setIsStartOpen(false)
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return
    onChange({
      startDate,
      endDate: date.toISOString()
    })
    setIsEndOpen(false)
  }

  const handlePresentToggle = (checked: boolean) => {
    setIsPresent(checked)
    onChange({
      startDate,
      endDate: checked ? 'Present' : (endDate === 'Present' ? new Date().toISOString() : endDate)
    })
  }

  const formatDate = (date: string) => {
    if (date === 'Present') return 'Present'
    return format(new Date(date), 'MMM yyyy')
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? formatDate(startDate) : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate === 'Present' ? undefined : new Date(startDate)}
            onSelect={handleStartDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">to</span>

      <div className="flex items-center gap-2">
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
              disabled={isPresent}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDate(endDate) : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate === 'Present' ? undefined : new Date(endDate)}
              onSelect={handleEndDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Switch
            id="present"
            checked={isPresent}
            onCheckedChange={handlePresentToggle}
          />
          <Label htmlFor="present">Present</Label>
        </div>
      </div>
    </div>
  )
} 