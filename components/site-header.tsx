"use client"

import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Github, LogIn } from "lucide-react"
import { signInWithProvider } from "@/lib/auth"
import { UserMenu } from "@/components/user-menu"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => signInWithProvider('google')}>
                  <Image
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google logo"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  Sign in with Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signInWithProvider('github')}>
                  <Github className="mr-2 h-4 w-4" />
                  Sign in with GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
