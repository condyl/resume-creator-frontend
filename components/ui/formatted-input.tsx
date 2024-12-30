'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormattedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FormattedInput({ value, onChange, className, placeholder }: FormattedInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
} 