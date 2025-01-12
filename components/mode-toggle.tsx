"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { ButtonWithTooltip } from "@/components/ui/button-with-tooltip"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ButtonWithTooltip
      variant="ghost"
      className="w-9 px-0"
      onClick={toggleTheme}
      tooltipText={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      ariaLabel="Toggle theme"
      icon={
        <>
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      }
    />
  )
}
