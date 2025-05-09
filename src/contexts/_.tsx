'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
 
import session from 'next-app-session'
type User = {
  username: string
  apiToken?: string
  userData?: any
  settings: {
    machineNumber: string
    defaultPrice: string
    defaultCustomerCode: string
    defaultVAT: string
  }
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = session().get('users')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse user from session storage', error)
        sessionStorage.removeItem('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    sessionStorage.setItem('currentUser', JSON.stringify(userData))
    // Also store settings separately for easy access
    sessionStorage.setItem('posSettings', JSON.stringify(userData.settings))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('currentUser')
    // Keep posSettings for convenience
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
