import "@/styles/globals.css"
import { Metadata } from "next"
import { RootLayoutClient } from "@/components/root-layout-client"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: {
    default: "Resume Creator",
    template: "%s | Resume Creator",
  },
  description: "Create and manage your professional resume with ease.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <div className="min-h-screen bg-background">
          <RootLayoutClient>{children}</RootLayoutClient>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
