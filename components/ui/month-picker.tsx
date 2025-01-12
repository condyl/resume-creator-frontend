'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonthPickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MonthPicker({ value, onChange, placeholder = "Select month...", className, disabled }: MonthPickerProps) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const handleYearChange = (increment: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev)
      newDate.setFullYear(prev.getFullYear() + increment)
      return newDate
    })
  }

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), monthIndex, 1)
    const formattedDate = format(selectedDate, 'yyyy-MM')
    onChange(formattedDate)
  }

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal min-w-0",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {value ? format(parseISO(value), 'MMMM yyyy') : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <ButtonWithTooltip
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(-1)}
              icon={<ChevronLeft className="h-4 w-4" />}
              tooltipText="Previous Year"
              ariaLabel="Go to previous year"
            />
            <div className="font-semibold">
              {viewDate.getFullYear()}
            </div>
            <ButtonWithTooltip
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(1)}
              icon={<ChevronRight className="h-4 w-4" />}
              tooltipText="Next Year"
              ariaLabel="Go to next year"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant="outline"
                className={cn(
                  "h-9",
                  value && parseISO(value).getMonth() === index && 
                  parseISO(value).getFullYear() === viewDate.getFullYear() && 
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 