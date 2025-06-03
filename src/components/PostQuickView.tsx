'use client'
import { Post } from './types'
import { motion, AnimatePresence } from '@/lib/framer'
import Image from 'next/image'
import { formatDisplayDate } from '@/lib/dateUtils'
import CopyButton from './CopyButton'
import DownloadButton from './DownloadButton'

interface PostQuickViewProps {
  post: Post | null
  onClose: () => void
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
}

export default function PostQuickView({ post, onClose, onEdit, onDelete }: PostQuickViewProps) {
  if (!post) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Idea': return 'bg-gray-500'
      case 'Drafted': return 'bg-yellow-500'
      case 'Scheduled': return 'bg-blue-500'
      case 'Posted': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }
  const hashtagsText = post.hashtags.map(tag => `#${tag}`).join(' ')

  const formatDate = (dateString: string) => {
  return formatDisplayDate(dateString)
}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-text">{post.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(post.status)}`}>
              {post.status}
            </span>
            <span className="px-3 py-1 bg-accentPurple text-white rounded-full text-sm">
              {post.type}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            {post.platform.map(platform => (
              <span
                key={platform}
                className="px-2 py-1 bg-accentCyan text-white rounded text-sm"
              >
                {platform}
              </span>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-text">Caption</h3>
                <CopyButton text={post.caption} size="sm" />
            </div>
            <div className="bg-background p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{post.caption}</p>
            </div>
            </div>


          {post.assetUrl && (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-text">Image</h3>
                <DownloadButton 
                    url={post.assetUrl} 
                    filename={`${post.title.replace(/[^a-zA-Z0-9]/g, '_')}_asset`}
                    size="sm" 
                />
                </div>
                <div className="relative">
                <Image
                    src={post.assetUrl}
                    alt="Post asset"
                    width={600}
                    height={300}
                    className="w-full max-h-64 object-cover rounded"
                />
                </div>
            </div>
            )}


          {post.hashtags.length > 0 && (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-text">Hashtags</h3>
                <CopyButton text={hashtagsText} size="sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                {post.hashtags.map(hashtag => (
                    <span 
                    key={hashtag} 
                    className="bg-accentPurple text-white px-3 py-1 rounded-full text-sm"
                    >
                    #{hashtag}
                    </span>
                ))}
                </div>
            </div>
            )}


          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text mb-2">Scheduled For</h3>
            <p className="text-gray-300">{formatDate(post.scheduledAt)}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(post)}
              className="flex-1 bg-accentPurple text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
            >
              Edit Post
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this post?')) {
                  onDelete(post.id)
                  onClose()
                }
              }}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Delete Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
