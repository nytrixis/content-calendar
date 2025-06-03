'use client'
import { Platform, Post } from './types'
import { motion } from '@/lib/framer'
import {
  getCurrentISTTime,
  isSameDayIST,
  isThisWeekIST,
  isThisMonthIST,
  convertToIST
} from '@/lib/dateUtils'

interface CalendarStatsProps {
  posts: Post[]
  currentDate: Date
}

export default function CalendarStats({ posts }: CalendarStatsProps) {
  const now = getCurrentISTTime()
  
  // Use the same logic as your working debug code
  const dayPosts = posts.filter(post => isSameDayIST(post.scheduledAt, now))
  const weekPosts = posts.filter(post => isThisWeekIST(post.scheduledAt))
  const monthPosts = posts.filter(post => isThisMonthIST(post.scheduledAt))

  // Add debug logging to see what's happening
  console.log('=== CALENDAR STATS DEBUG ===')
  console.log('Now (IST):', now.toDateString())
  console.log('Day posts count:', dayPosts.length)
  console.log('Day posts:', dayPosts.map(p => `${p.title} (${convertToIST(p.scheduledAt).toDateString()})`))
  console.log('Week posts count:', weekPosts.length)
  console.log('Month posts count:', monthPosts.length)
  console.log('=== END CALENDAR STATS DEBUG ===')

  const getStatusCount = (posts: Post[], status: string) => {
    return posts.filter(post => post.status === status).length
  }

  const getPlatformCount = (posts: Post[], platform: string) => {
    return posts.filter(post => post.platform.includes(platform as Platform)).length
  }

  const stats = [
    {
      title: 'This Month',
      total: monthPosts.length,
      posted: getStatusCount(monthPosts, 'Posted'),
      scheduled: getStatusCount(monthPosts, 'Scheduled'),
      drafted: getStatusCount(monthPosts, 'Drafted'),
      ideas: getStatusCount(monthPosts, 'Idea'),
      linkedin: getPlatformCount(monthPosts, 'LinkedIn'),
      twitter: getPlatformCount(monthPosts, 'Twitter'),
    },
    {
      title: 'This Week',
      total: weekPosts.length,
      posted: getStatusCount(weekPosts, 'Posted'),
      scheduled: getStatusCount(weekPosts, 'Scheduled'),
      drafted: getStatusCount(weekPosts, 'Drafted'),
      ideas: getStatusCount(weekPosts, 'Idea'),
      linkedin: getPlatformCount(weekPosts, 'LinkedIn'),
      twitter: getPlatformCount(weekPosts, 'Twitter'),
    },
    {
      title: 'Today',
      total: dayPosts.length,
      posted: getStatusCount(dayPosts, 'Posted'),
      scheduled: getStatusCount(dayPosts, 'Scheduled'),
      drafted: getStatusCount(dayPosts, 'Drafted'),
      ideas: getStatusCount(dayPosts, 'Idea'),
      linkedin: getPlatformCount(dayPosts, 'LinkedIn'),
      twitter: getPlatformCount(dayPosts, 'Twitter'),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-lg p-4 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-text mb-3">{stat.title}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-accentPurple">{stat.total}</span>
              <span className="text-sm text-gray-400">Total Posts</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Posted:</span>
                <span className="text-green-400 font-medium">{stat.posted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Scheduled:</span>
                <span className="text-blue-400 font-medium">{stat.scheduled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Drafted:</span>
                <span className="text-yellow-400 font-medium">{stat.drafted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ideas:</span>
                <span className="text-gray-400 font-medium">{stat.ideas}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">LinkedIn:</span>
                  <span className="text-blue-500 font-medium">{stat.linkedin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Twitter:</span>
                  <span className="text-sky-400 font-medium">{stat.twitter}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
