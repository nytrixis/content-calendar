import { supabase } from '@/lib/supabase'
import { Post, Platform, PostStatus, PostType } from '@/components/types'

// Database row interface matching your Supabase table structure
interface DatabasePost {
  id: string
  title: string
  platform: Platform[]
  caption: string
  hashtags: string[]
  asset_url: string | null
  scheduled_at: string
  type: PostType
  status: PostStatus
  created_at: string
  updated_at: string
}

export class PostsService {
  static async getAllPosts(): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        return []
      }

      return data.map(this.transformPost)
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  static async createPost(postData: Omit<Post, 'id'>): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: postData.title,
          platform: postData.platform,
          caption: postData.caption,
          hashtags: postData.hashtags,
          asset_url: postData.assetUrl,
          scheduled_at: postData.scheduledAt,
          type: postData.type,
          status: postData.status
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        return null
      }

      return this.transformPost(data)
    } catch (error) {
      console.error('Error creating post:', error)
      return null
    }
  }

  static async updatePost(id: string, postData: Omit<Post, 'id'>): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          platform: postData.platform,
          caption: postData.caption,
          hashtags: postData.hashtags,
          asset_url: postData.assetUrl,
          scheduled_at: postData.scheduledAt,
          type: postData.type,
          status: postData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating post:', error)
        return null
      }

      return this.transformPost(data)
    } catch (error) {
      console.error('Error updating post:', error)
      return null
    }
  }

  static async deletePost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting post:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }

  static async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        return null
      }

      return this.transformPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  }

  static async getPostsByStatus(status: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts by status:', error)
        return []
      }

      return data.map(this.transformPost)
    } catch (error) {
      console.error('Error fetching posts by status:', error)
      return []
    }
  }

  // Transform database row to Post interface
  private static transformPost(data: DatabasePost): Post {
    return {
      id: data.id,
      title: data.title,
      platform: data.platform,
      caption: data.caption,
      hashtags: data.hashtags || [],
      assetUrl: data.asset_url || undefined,
      scheduledAt: data.scheduled_at,
      type: data.type,
      status: data.status
    }
  }
}
