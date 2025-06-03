'use client'
import { useAuth } from '@/contexts/AuthContext'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentPurple"></div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <Login />
}
