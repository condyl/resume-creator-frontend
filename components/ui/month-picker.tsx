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
import { format, parseISO, isValid } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonthPickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  allowPresent?: boolean
  showIcon?: boolean
}

export function MonthPicker({ 
  value, 
  onChange, 
  placeholder = "Select month...", 
  className, 
  disabled,
  allowPresent = true,
  showIcon = true
}: MonthPickerProps) {
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

  const handlePresentClick = () => {
    onChange('Present')
  }

  const formatDisplayValue = (value: string) => {
    if (!value) return placeholder
    if (value === 'Present') return 'Present'
    try {
      const date = parseISO(value)
      return isValid(date) ? format(date, 'MMM yyyy') : value
    } catch {
      return value
    }
  }

  const isSelectedMonth = (monthIndex: number) => {
    if (!value || value === 'Present') return false
    try {
      const date = parseISO(value)
      return isValid(date) && 
        date.getMonth() === monthIndex && 
        date.getFullYear() === viewDate.getFullYear()
    } catch {
      return false
    }
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
            "justify-start text-left font-normal whitespace-nowrap w-auto min-w-0 bg-white dark:bg-white text-black dark:text-black border-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-100",
            !value && "text-gray-500 dark:text-gray-500",
            className
          )}
          disabled={disabled}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-black dark:text-black" />}
          <span>
            {formatDisplayValue(value)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-white border-gray-200 dark:border-gray-200" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <ButtonWithTooltip
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(-1)}
              icon={<ChevronLeft className="h-4 w-4 text-black dark:text-black" />}
              tooltipText="Previous Year"
              ariaLabel="Go to previous year"
              className="bg-white dark:bg-white text-black dark:text-black border-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-100"
            />
            <div className="font-semibold text-black dark:text-black">
              {viewDate.getFullYear()}
            </div>
            <ButtonWithTooltip
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(1)}
              icon={<ChevronRight className="h-4 w-4 text-black dark:text-black" />}
              tooltipText="Next Year"
              ariaLabel="Go to next year"
              className="bg-white dark:bg-white text-black dark:text-black border-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant="outline"
                className={cn(
                  "h-9 bg-white dark:bg-white text-black dark:text-black border-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-100",
                  isSelectedMonth(index) && "bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-600"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
          {allowPresent && (
            <div className="mt-2 border-t border-gray-200 dark:border-gray-200 pt-2">
              <Button
                variant="outline"
                className={cn(
                  "w-full bg-white dark:bg-white text-black dark:text-black border-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-100",
                  value === 'Present' && "bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-600"
                )}
                onClick={handlePresentClick}
              >
                Present
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 