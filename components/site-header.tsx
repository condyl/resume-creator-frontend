"use client"

import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signInWithProvider } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Resume Creator</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          {user ? (
            <UserMenu email={user.email || ''} />
          ) : (
            <Button onClick={() => signInWithProvider('github')} variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
