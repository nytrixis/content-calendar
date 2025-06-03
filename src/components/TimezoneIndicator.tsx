'use client'
import { useState, useEffect } from 'react'
import { getCurrentISTTime } from '@/lib/dateUtils'

export default function TimezoneIndicator() {
  const [currentTime, setCurrentTime] = useState(getCurrentISTTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentISTTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>
        IST: {currentTime.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </span>
    </div>
  )
}
