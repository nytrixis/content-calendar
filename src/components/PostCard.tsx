'use client'
import { Post } from './types'
import { motion } from '@/lib/framer'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Idea': return 'bg-gray-500'
      case 'Drafted': return 'bg-yellow-500'
      case 'Scheduled': return 'bg-blue-500'
      case 'Posted': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-6 shadow-lg border border-gray-700"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-text">{post.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(post)}
            className="text-accentCyan hover:text-cyan-400 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(post.status)}`}>
          {post.status}
        </span>
        <span className="text-sm text-gray-400">{post.type}</span>
      </div>

      <div className="flex gap-2 mb-3">
        {post.platform.map(platform => (
          <span
            key={platform}
            className="px-2 py-1 bg-accentPurple text-white rounded text-xs"
          >
            {platform}
          </span>
        ))}
      </div>

      <p className="text-text mb-4 line-clamp-3">{post.caption}</p>

      {post.assetUrl && (
        <div className="mb-4 relative">
          <Image
            src={post.assetUrl}
            alt="Post asset"
            width={400}
            height={200}
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {post.hashtags.map(hashtag => (
          <span key={hashtag} className="text-accentCyan text-sm">
            #{hashtag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-400">
        Scheduled: {formatDate(post.scheduledAt)}
      </div>
    </motion.div>
  )
}
