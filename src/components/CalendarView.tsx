'use client'
import { useState, useMemo } from 'react'
import { Post } from './types'
import { motion } from '@/lib/framer'
import CalendarLegend from './CalendarLegend'
import { 
  isSameDayIST, 
  getISTHour, 
  convertToIST,
  getCurrentISTTime,
  getISTDay,
  getISTMonth,
  getISTYear
} from '@/lib/dateUtils'

interface CalendarViewProps {
  posts: Post[]
  onPostClick?: (post: Post) => void
}

type ViewType = 'month' | 'week' | 'day'

export default function CalendarView({ posts, onPostClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    switch (viewType) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
    }
    
    setCurrentDate(newDate)
  }

  const getDateTitle = () => {
    switch (viewType) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      case 'week':
        const weekStart = getWeekStart(currentDate)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  return (
    <div className="bg-card rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-text">{getDateTitle()}</h2>
          <div className="flex gap-1">
            {(['month', 'week', 'day'] as ViewType[]).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-3 py-1 rounded text-sm capitalize ${
                  viewType === type
                    ? 'bg-accentPurple text-white'
                    : 'bg-background text-text hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 bg-background text-text rounded hover:bg-gray-700 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-accentCyan text-white rounded hover:bg-cyan-600 transition-colors text-sm"
          >
            Today
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 bg-background text-text rounded hover:bg-gray-700 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <CalendarLegend />

      {/* Calendar Grid */}
      {viewType === 'month' && (
        <MonthView 
          currentDate={currentDate} 
          posts={posts} 
          onPostClick={onPostClick} 
        />
      )}
      {viewType === 'week' && (
        <WeekView 
          currentDate={currentDate} 
          posts={posts} 
          onPostClick={onPostClick} 
        />
      )}
      {viewType === 'day' && (
        <DayView 
          currentDate={currentDate} 
          posts={posts} 
          onPostClick={onPostClick} 
        />
      )}
    </div>
  )
}


// Update WeekView function
function WeekView({ currentDate, posts, onPostClick }: { 
  currentDate: Date
  posts: Post[]
  onPostClick?: (post: Post) => void 
}) {
  const istCurrentDate = convertToIST(currentDate)
  const weekStart = new Date(istCurrentDate)
  weekStart.setDate(istCurrentDate.getDate() - istCurrentDate.getDay())
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      return isSameDayIST(post.scheduledAt, date)
    })
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayPosts = getPostsForDate(day)
        const isToday = isSameDayIST(day, getCurrentISTTime())
        
        return (
          <motion.div
            key={index}
            className={`min-h-[200px] p-3 bg-background rounded border ${
              isToday ? 'ring-2 ring-accentPurple' : 'border-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center mb-3">
              <div className="text-sm text-gray-400">
                {day.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })}
              </div>
              <div className="text-lg font-bold text-text">
                {day.getDate()}
              </div>
            </div>
            
            <div className="space-y-2">
              {dayPosts.map(post => (
                <motion.div
                  key={post.id}
                  className={`text-xs p-2 rounded cursor-pointer ${
                    post.status === 'Posted' ? 'bg-green-600 text-white' :
                    post.status === 'Scheduled' ? 'bg-blue-600 text-white' :
                    post.status === 'Drafted' ? 'bg-yellow-600 text-black' :
                    'bg-gray-600 text-white'
                  }`}
                  onClick={() => onPostClick?.(post)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-medium truncate">{post.title}</div>
                  <div className="text-xs opacity-75">
                    {convertToIST(post.scheduledAt).toLocaleTimeString('en-IN', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      timeZone: 'Asia/Kolkata'
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}


function MonthView({ currentDate, posts, onPostClick }: { 
  currentDate: Date
  posts: Post[]
  onPostClick?: (post: Post) => void 
}) {
  // Generate calendar days in IST
  const istCurrentDate = convertToIST(currentDate)
  const monthStart = new Date(getISTYear(istCurrentDate), getISTMonth(istCurrentDate), 1)
  const monthEnd = new Date(getISTYear(istCurrentDate), getISTMonth(istCurrentDate) + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())
  
  const days = []
  const currentDay = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDay))
    currentDay.setDate(currentDay.getDate() + 1)
  }

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      return isSameDayIST(post.scheduledAt, date)
    })
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map((day, index) => {
        const dayPosts = getPostsForDate(day)
        const isCurrentMonth = day.getMonth() === getISTMonth(istCurrentDate)
        const isToday = isSameDayIST(day, getCurrentISTTime())
        
        return (
          <motion.div
            key={index}
            className={`min-h-[100px] p-1 border border-gray-700 rounded ${
              isCurrentMonth ? 'bg-background' : 'bg-gray-800'
            } ${isToday ? 'ring-2 ring-accentPurple' : ''}`}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`text-sm font-medium mb-1 ${
              isCurrentMonth ? 'text-text' : 'text-gray-500'
            }`}>
              {day.getDate()}
            </div>
            
            <div className="space-y-1">
              {dayPosts.slice(0, 3).map(post => (
                <motion.div
                  key={post.id}
                  className={`text-xs p-1 rounded cursor-pointer truncate ${
                    post.status === 'Posted' ? 'bg-green-600 text-white' :
                    post.status === 'Scheduled' ? 'bg-blue-600 text-white' :
                    post.status === 'Drafted' ? 'bg-yellow-600 text-black' :
                    'bg-gray-600 text-white'
                  }`}
                  onClick={() => onPostClick?.(post)}
                  whileHover={{ scale: 1.05 }}
                  title={post.title}
                >
                  {post.title}
                </motion.div>
              ))}
              {dayPosts.length > 3 && (
                <div className="text-xs text-gray-400 text-center">
                  +{dayPosts.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Update DayView
function DayView({ currentDate, posts, onPostClick }: { 
  currentDate: Date
  posts: Post[]
  onPostClick?: (post: Post) => void 
}) {
  const dayPosts = posts.filter(post => {
    return isSameDayIST(post.scheduledAt, currentDate)
  }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getPostsForHour = (hour: number) => {
    return dayPosts.filter(post => {
      return getISTHour(post.scheduledAt) === hour
    })
  }

  return (
    <div className="space-y-2">
      {hours.map(hour => {
        const hourPosts = getPostsForHour(hour)
        
        return (
          <div key={hour} className="flex border-b border-gray-700 pb-2">
            <div className="w-20 text-sm text-gray-400 py-2">
              {hour === 0 ? '12 AM' : 
               hour < 12 ? `${hour} AM` : 
               hour === 12 ? '12 PM' : 
               `${hour - 12} PM`}
            </div>
            
            <div className="flex-1 min-h-[50px] p-2">
              <div className="grid gap-2">
                {hourPosts.map(post => (
                  <motion.div
                    key={post.id}
                    className={`p-3 rounded cursor-pointer ${
                      post.status === 'Posted' ? 'bg-green-600 text-white' :
                      post.status === 'Scheduled' ? 'bg-blue-600 text-white' :
                      post.status === 'Drafted' ? 'bg-yellow-600 text-black' :
                      'bg-gray-600 text-white'
                    }`}
                    onClick={() => onPostClick?.(post)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm opacity-75 mt-1">
                      {convertToIST(post.scheduledAt).toLocaleTimeString('en-IN', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        timeZone: 'Asia/Kolkata'
                      })} • {post.platform.join(', ')}
                    </div>
                    <div className="text-xs opacity-75 mt-1 line-clamp-2">
                      {post.caption}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
