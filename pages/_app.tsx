'use client'

import React from 'react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../lib/AuthContext'

// Import global styles if you have any
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </React.StrictMode>
  )
} 