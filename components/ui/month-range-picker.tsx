'use client'

import React from 'react'
import { MonthPicker } from "@/components/ui/month-picker"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MonthRangePickerProps {
  startDate: string
  endDate: string
  onChange: (dates: { startDate: string; endDate: string }) => void
}

export function MonthRangePicker({ startDate, endDate, onChange }: MonthRangePickerProps) {
  const [isPresent, setIsPresent] = React.useState(endDate === 'Present')

  const handleStartDateChange = (date: string) => {
    onChange({
      startDate: date,
      endDate: isPresent ? 'Present' : endDate
    })
  }

  const handleEndDateChange = (date: string) => {
    onChange({
      startDate,
      endDate: date
    })
  }

  const handlePresentToggle = (checked: boolean) => {
    setIsPresent(checked)
    onChange({
      startDate,
      endDate: checked ? 'Present' : (endDate === 'Present' ? new Date().toISOString() : endDate)
    })
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div className="w-full">
          <MonthPicker
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Start date"
          />
        </div>

        <span className="hidden lg:inline text-muted-foreground">to</span>

        <div className="w-full">
          <MonthPicker
            value={endDate === 'Present' ? '' : endDate}
            onChange={handleEndDateChange}
            placeholder="End date"
            className={cn(isPresent && "opacity-50")}
            disabled={isPresent}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="present"
          checked={isPresent}
          onCheckedChange={handlePresentToggle}
        />
        <Label htmlFor="present" className="whitespace-nowrap">Present</Label>
      </div>
    </div>
  )
} 