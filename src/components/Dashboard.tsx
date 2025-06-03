'use client'
import { useState, useEffect } from 'react'
import { Post } from './types'
import { PostsService } from '@/services/postsService'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimePosts } from '@/hooks/useRealtimePosts'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import PostCard from './PostCard'
import PostForm from './PostForm'
import CalendarView from './CalendarView'
import CalendarStats from './CalendarStats'
import PostQuickView from './PostQuickView'
import { motion, AnimatePresence } from '@/lib/framer'
import KeyboardShortcuts from './KeyboardShortcuts'
import { convertToIST, getCurrentISTTime, isSameDayIST } from '@/lib/dateUtils'
import TimezoneIndicator from './TimezoneIndicator'
import UserProfile from './UserProfile'

export default function Dashboard() {
  const { posts, loading, refetch } = useRealtimePosts()
  const [showForm, setShowForm] = useState(false)
  
  useKeyboardNavigation({
    onCreatePost: () => setShowForm(true),
    onToggleView: () => setViewMode(prev => (prev === 'calendar' ? 'list' : 'calendar')),
    onEscape: () => {
      setShowForm(false)
      setEditingPost(null)
      setSelectedPost(null)
    }
  })

  // Debug posts data      
  useEffect(() => {
    const today = getCurrentISTTime();
    console.log('=== TODAY DEBUG ===');
    console.log('Current IST Time:', today);
    console.log('Today Date String:', today.toDateString());
    console.log('Today ISO:', today.toISOString());
       
    // Check each post against today
    posts.forEach(post => {
        const isSame = isSameDayIST(post.scheduledAt, today);
        console.log(`Post "${post.title}" scheduled for ${convertToIST(post.scheduledAt).toDateString()} - Is today? ${isSame}`);
    });
    console.log('=== END TODAY DEBUG ===');
  }, [posts]);

  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [filter, setFilter] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  const handleCreatePost = async (postData: Omit<Post, 'id'>) => {
    console.log('Dashboard: Creating post with data:', postData) // Debug log
    
    try {
      const newPost = await PostsService.createPost(postData)
      if (newPost) {
        console.log('Dashboard: Post created successfully:', newPost) // Debug log
        setShowForm(false)
        refetch()
      } else {
        console.error('Dashboard: Failed to create post - no data returned')
      }
    } catch (error) {
      console.error('Dashboard: Error creating post:', error)
    }
  }

  const handleUpdatePost = async (postData: Omit<Post, 'id'>) => {
    if (editingPost) {
      const updatedPost = await PostsService.updatePost(editingPost.id, postData)
      if (updatedPost) {
        setEditingPost(null)
        setShowForm(false)
        setSelectedPost(null)
        refetch()
      }
    }
  }

  const handleDeletePost = async (id: string) => {
    const success = await PostsService.deletePost(id)
    if (success) {
      refetch()
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setShowForm(true)
    setSelectedPost(null)
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
  }

  const filteredPosts = filter === 'All'
    ? posts
    : posts.filter((post: Post) => post.status === filter)

  interface StatusCounts {
    All: number;
    Idea: number;
    Drafted: number;
    Scheduled: number;
    Posted: number;
    [key: string]: number;
  }

  const statusCounts: StatusCounts = {
    All: posts.length,
    Idea: posts.filter((p: Post) => p.status === 'Idea').length,
    Drafted: posts.filter((p: Post) => p.status === 'Drafted').length,
    Scheduled: posts.filter((p: Post) => p.status === 'Scheduled').length,
    Posted: posts.filter((p: Post) => p.status === 'Posted').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentPurple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text">Content Calendar</h1>
            <p className="text-gray-400 mt-1">
              Manage your social media content
            </p>
            <TimezoneIndicator />
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <UserProfile />
            
            {/* View Toggle */}
            <div className="flex gap-1 bg-background rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded text-sm ${
                  viewMode === 'calendar'
                    ? 'bg-accentPurple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded text-sm ${
                  viewMode === 'list'
                    ? 'bg-accentPurple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📋 List
              </button>
            </div>
            
            <button
              onClick={() => {
                console.log('Create post button clicked') // Debug log
                setShowForm(true)
              }}
              className="bg-accentPurple text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              + New Post
            </button>
          </div>
        </div>

        {/* Calendar Stats */}
        {viewMode === 'calendar' && (
          <CalendarStats posts={posts} currentDate={new Date()} />
        )}

        {/* Filter Tabs (for list view) */}
        {viewMode === 'list' && (
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-accentPurple text-white'
                    : 'bg-card text-text hover:bg-gray-700'
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CalendarView
                posts={posts}
                onPostClick={handlePostClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-text mb-2">
                    {filter === 'All' ? 'No posts yet' : `No ${filter.toLowerCase()} posts`}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {filter === 'All'
                      ? 'Create your first post to get started with your content calendar.'
                      : `You don't have any ${filter.toLowerCase()} posts at the moment.`
                    }
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-accentPurple text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post: Post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Form Modal */}
        <AnimatePresence>
          {showForm && (
            <PostForm
              post={editingPost ?? undefined}
              onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
              onCancel={() => {
                console.log('Form cancelled') // Debug log
                setShowForm(false)
                setEditingPost(null)
              }}
            />
          )}
        </AnimatePresence>

        {/* Post Quick View Modal */}
        <PostQuickView
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      </div>
      
      <KeyboardShortcuts />
    </div>
  )
}
