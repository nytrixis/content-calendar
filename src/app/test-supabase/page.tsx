'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
        
        if (error) {
          setStatus(`Connection Error: ${error.message}`)
        } else {
          setStatus('✅ Supabase connection working!')
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg">
        <h1 className="text-xl text-text mb-4">Supabase Connection Test</h1>
        <p className="text-text">{status}</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>
    </div>
  )
}
