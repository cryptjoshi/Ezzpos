'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { sessionData, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (sessionData) {
        // If user is logged in, redirect to POS page
        router.push('/pos')
      } else {
        // If user is not logged in, redirect to login page
        router.push('/login')
      }
    }
  }, [sessionData, isLoading, router])

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // This will not be rendered as we're redirecting in the useEffect
  return null
}
