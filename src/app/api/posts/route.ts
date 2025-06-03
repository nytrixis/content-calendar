import { NextRequest, NextResponse } from 'next/server'
import { PostsService } from '@/services/postsService'

export async function GET() {
  try {
    const posts = await PostsService.getAllPosts()
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json()
    const newPost = await PostsService.createPost(postData)
    
    if (!newPost) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
    
    return NextResponse.json(newPost, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
