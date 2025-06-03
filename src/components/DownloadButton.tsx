'use client'
import { useState } from 'react'
import { motion } from '@/lib/framer'

interface DownloadButtonProps {
  url: string
  filename?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function DownloadButton({ url, filename, className = '', size = 'md' }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!url) return

    setDownloading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Set filename
      const fileExtension = url.split('.').pop() || 'jpg'
      link.download = filename || `asset-${Date.now()}.${fileExtension}`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Failed to download file:', error)
      // Fallback: open in new tab
      window.open(url, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  }

  return (
    <motion.button
      onClick={handleDownload}
      disabled={downloading || !url}
      className={`
        ${sizeClasses[size]}
        ${downloading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'}
        ${!url ? 'opacity-50 cursor-not-allowed' : ''}
        text-white rounded transition-colors flex items-center gap-1
        ${className}
      `}
      whileHover={!downloading && url ? { scale: 1.05 } : {}}
      whileTap={!downloading && url ? { scale: 0.95 } : {}}
      title={downloading ? 'Downloading...' : 'Download asset'}
    >
      {downloading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Downloading...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </>
      )}
    </motion.button>
  )
}
