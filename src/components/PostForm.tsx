'use client'
import { useState } from 'react'
import { Post, PostStatus, Platform, PostType } from './types'
import { motion } from '@/lib/framer'
import ImageUpload from './ImageUpload'
import {
  formatDateForInput,
  formatTimeForInput,
  createISTDateTime,
  getCurrentISTTime,
  convertToIST
} from '@/lib/dateUtils'

interface PostFormProps {
  post?: Post
  onSubmit: (post: Omit<Post, 'id'>) => void
  onCancel: () => void
}

export default function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  // Helper function to format datetime for datetime-local input
  const formatDateTimeLocal = (dateString: string): string => {
    try {
      const date = convertToIST(dateString);
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting datetime local:', error);
      const now = getCurrentISTTime();
      return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    }
  };

  const [formData, setFormData] = useState({
    title: post?.title || '',
    platform: post?.platform || ['LinkedIn'] as Platform[],
    caption: post?.caption || '',
    hashtags: post?.hashtags || [],
    assetUrl: post?.assetUrl || '',
    scheduledAt: post?.scheduledAt ? formatDateTimeLocal(post.scheduledAt) : formatDateTimeLocal(getCurrentISTTime().toISOString()),
    type: post?.type || 'General Thought' as PostType,
    status: post?.status || 'Idea' as PostStatus
  })

  const [hashtagInput, setHashtagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Form scheduledAt value:', formData.scheduledAt);
    
    try {
      // Parse the datetime-local value (format: YYYY-MM-DDTHH:MM)
      const [datePart, timePart] = formData.scheduledAt.split('T');
      
      console.log('Parsed parts:', { datePart, timePart });
      
      if (!datePart || !timePart) {
        throw new Error('Invalid datetime format');
      }
      
      // Create IST datetime and convert to UTC for storage
      const scheduledDateTime = createISTDateTime(datePart, timePart);
      
      console.log('Created datetime:', scheduledDateTime);
      console.log('ISO string:', scheduledDateTime.toISOString());
      
      const postData = {
        title: formData.title,
        platform: formData.platform,
        caption: formData.caption,
        hashtags: formData.hashtags,
        assetUrl: formData.assetUrl,
        scheduledAt: scheduledDateTime.toISOString(),
        type: formData.type,
        status: formData.status,
      }
      
      console.log('Final post data:', postData);
      onSubmit(postData)
      
    } catch (error: unknown) {
      console.error('Error in form submit:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Error creating post: ' + errorMessage);
    }
  }
  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, assetUrl: url })
  }

  const handleImageRemoved = () => {
    setFormData({ ...formData, assetUrl: '' })
  }

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData({
        ...formData,
        hashtags: [...formData.hashtags, hashtagInput.trim()]
      })
      setHashtagInput('')
    }
  }

  const removeHashtag = (hashtag: string) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter(h => h !== hashtag)
    })
  }

  const togglePlatform = (platform: Platform) => {
    const newPlatforms = formData.platform.includes(platform)
      ? formData.platform.filter(p => p !== platform)
      : [...formData.platform, platform]
    
    setFormData({ ...formData, platform: newPlatforms })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-text mb-6">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-text mb-2">Platform</label>
            <div className="flex gap-2">
              {(['LinkedIn', 'Twitter'] as Platform[]).map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-4 py-2 rounded ${
                    formData.platform.includes(platform)
                      ? 'bg-accentPurple text-white'
                      : 'bg-background text-text border border-gray-600'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-text mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PostType })}
              className="w-full p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
            >
              <option value="General Thought">General Thought</option>
              <option value="App Critique">App Critique</option>
              <option value="Personal Insight">Personal Insight</option>
              <option value="Trend Response">Trend Response</option>
            </select>
          </div>

          <div>
            <label className="block text-text mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              className="w-full p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
            >
              <option value="Idea">Idea</option>
              <option value="Drafted">Drafted</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Posted">Posted</option>
            </select>
          </div>

          <div>
            <label className="block text-text mb-2">Caption</label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              rows={4}
              className="w-full p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-text mb-2">Upload Image</label>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              currentImage={formData.assetUrl}
              onImageRemoved={handleImageRemoved}
            />
          </div>

          <div>
            <label className="block text-text mb-2">
              Scheduled Date & Time (IST)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Time will be saved in Indian Standard Time (IST)
            </p>
          </div>

          <div>
            <label className="block text-text mb-2">Hashtags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                className="flex-1 p-3 bg-background border border-gray-600 rounded text-text focus:border-accentPurple focus:outline-none"
                placeholder="Add hashtag"
              />
              <button
                type="button"
                onClick={addHashtag}
                className="px-4 py-2 bg-accentCyan text-white rounded hover:bg-cyan-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.hashtags.map(hashtag => (
                <span
                  key={hashtag}
                  className="bg-accentPurple text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  #{hashtag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(hashtag)}
                    className="text-white hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accentPurple text-white p-3 rounded hover:bg-purple-600 transition-colors"
            >
              {post ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 text-white p-3 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
