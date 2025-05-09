import type { Metadata } from 'next'
// These UI components will be uncommented once we've migrated them
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";

// These styles apply to every route in the application
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Kanit } from 'next/font/google'
import { getSession } from '@/app/actions';
import { SessionData } from '@/lib/session';
// Initialize the Kanit font with Thai and Latin subsets
const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
})

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Modern POS System built with Next.js App Router',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const serverSession:SessionData = await getSession()
    //console.log(serverSession)
    const serverUser = serverSession.username
    //console.log(serverUser)
    const serverToken = serverSession.apiToken
    //console.log(serverToken)
    const serverSettings = serverSession.settings
    //console.log(serverSettings)
    const serverUserData = serverSession.userData
    //console.log(serverUserData)
    const serverIsLoggedIn = serverSession.isLoggedIn
    //console.log(serverIsLoggedIn)
    const serverSessionData = {
      username: serverUser,
      apiToken: serverToken,
      settings: serverSettings,
      userData: serverUserData,
      isLoggedIn: serverIsLoggedIn
    }
  return (
    <html lang="th" suppressHydrationWarning className={kanit.variable}>
      <body className="min-h-screen bg-background font-kanit">
        {/* These UI components will be uncommented once we've migrated them */}
        {/* <TooltipProvider>
          <Toaster />
          <Sonner /> */}
          <Toaster />
          <AuthProvider serverSession={serverSessionData}>
            {children}
          </AuthProvider>
        {/* </TooltipProvider> */}
      </body>
    </html>
  )
}