import { NextRequest, NextResponse } from 'next/server'
import { PostsService } from '@/services/postsService'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postData = await request.json()
    const updatedPost = await PostsService.updatePost(params.id, postData)
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
    
    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await PostsService.deletePost(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
