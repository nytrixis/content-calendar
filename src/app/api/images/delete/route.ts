import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
