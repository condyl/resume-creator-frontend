'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('Starting auth callback handler')
      console.log('Current URL:', window.location.href)
      
      try {
        // Handle hash fragment response
        if (window.location.hash) {
          console.log('Found hash fragment, setting session')
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const access_token = hashParams.get('access_token')
          const refresh_token = hashParams.get('refresh_token')

          if (access_token) {
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || ''
            })

            if (error) {
              console.error('Error setting session:', error)
              throw error
            }

            if (session) {
              console.log('Session set successfully:', session)
              // Use replace instead of push to avoid back button issues
              window.location.replace('/')
              return
            }
          }
        }

        // Check if we already have a session
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)

        if (session) {
          console.log('Existing session found, redirecting to home')
          window.location.replace('/')
        } else {
          console.log('No session found, redirecting to login')
          window.location.replace('/login?error=no-session')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        window.location.replace('/login?error=auth-failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Signing you in...</h1>
        <p className="mt-2">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
} 