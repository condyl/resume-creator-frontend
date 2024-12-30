'use client'

import { ThemeProvider } from "next-themes"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { AuthProvider } from "@/lib/AuthContext"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"

export function RootLayoutClientContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <TailwindIndicator />
    </div>
  )
}

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <RootLayoutClientContent>{children}</RootLayoutClientContent>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 