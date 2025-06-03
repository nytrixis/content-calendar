export class ImageService {
  static async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
      formData.append('folder', 'content-calendar') // Optional: organize in folders

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/images/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })

      return response.ok
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  static getPublicIdFromUrl(url: string): string {
    // Extract public_id from Cloudinary URL
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    return filename.split('.')[0]
  }
}
