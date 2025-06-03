import { NextRequest, NextResponse } from 'next/server'
import { PostsService } from '@/services/postsService'

// Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postData = await request.json();
    const updatedPost = await PostsService.updatePost(id, postData);

    if (!updatedPost) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await PostsService.deletePost(id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}