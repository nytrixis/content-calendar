'use client'
import { Post } from './types'
import { motion } from '@/lib/framer'
import { 
  getCurrentISTTime,
  getStartOfDayIST,
  getEndOfDayIST,
  convertToIST
} from '@/lib/dateUtils'

interface CalendarStatsProps {
  posts: Post[]
  currentDate: Date
}

export default function CalendarStats({ posts, currentDate }: CalendarStatsProps) {
  const now = getCurrentISTTime()
  const istCurrentDate = convertToIST(currentDate)
  
  const startOfMonth = new Date(istCurrentDate.getFullYear(), istCurrentDate.getMonth(), 1)
  const endOfMonth = new Date(istCurrentDate.getFullYear(), istCurrentDate.getMonth() + 1, 0)
  
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  const startOfDay = getStartOfDayIST(now)
  const endOfDay = getEndOfDayIST(now)

  const getPostsInRange = (start: Date, end: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledAt)
      return postDate >= start && postDate <= end
    })
  }

  const monthPosts = getPostsInRange(startOfMonth, endOfMonth)
  const weekPosts = getPostsInRange(startOfWeek, endOfWeek)
  const dayPosts = getPostsInRange(startOfDay, endOfDay)



  const getStatusCount = (posts: Post[], status: string) => {
    return posts.filter(post => post.status === status).length
  }

  const getPlatformCount = (posts: Post[], platform: string) => {
    return posts.filter(post => post.platform.includes(platform as any)).length
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
