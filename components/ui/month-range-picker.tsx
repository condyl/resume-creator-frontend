'use client'

import React from 'react'
import { MonthPicker } from "@/components/ui/month-picker"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
    <div className="flex items-center gap-2">
      <MonthPicker
        value={startDate}
        onChange={handleStartDateChange}
        placeholder="Start date"
      />

      <span className="text-muted-foreground">to</span>

      <div className="flex items-center gap-2">
        <MonthPicker
          value={endDate === 'Present' ? '' : endDate}
          onChange={handleEndDateChange}
          placeholder="End date"
          className={isPresent ? "opacity-50" : ""}
        />

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