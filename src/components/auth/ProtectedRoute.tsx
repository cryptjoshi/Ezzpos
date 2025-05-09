'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { sessionData, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !sessionData) {
      router.push('/login')
    }
  }, [sessionData, isLoading, router])

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // If not authenticated, don't render children
  if (!sessionData) {
    return null
  }

  // If authenticated, render children
  return <>{children}</>
}
