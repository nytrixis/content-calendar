'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/components/types'
import { PostsService } from '@/services/postsService'

export function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    loadPosts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Real-time update:', payload)
          // Reload posts when changes occur
          loadPosts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const fetchedPosts = await PostsService.getAllPosts()
    setPosts(fetchedPosts)
    setLoading(false)
  }

  return { posts, loading, refetch: loadPosts }
}
