'use client'

import React from 'react'
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-4">You need to be signed in to view your profile.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="rounded-lg border bg-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 mb-6">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Account Type:</span> {user.app_metadata.provider} login</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <DeleteAccountDialog />
      </div>
    </div>
  )
} 