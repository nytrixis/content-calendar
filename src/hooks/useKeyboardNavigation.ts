'use client'
import { useEffect } from 'react'

interface UseKeyboardNavigationProps {
  onCreatePost: () => void
  onToggleView: () => void
  onEscape: () => void
}

export function useKeyboardNavigation({
  onCreatePost,
  onToggleView,
  onEscape
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      switch (event.key) {
        case 'n':
        case 'N':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onCreatePost()
          }
          break
        case 'v':
        case 'V':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onToggleView()
          }
          break
        case 'Escape':
          onEscape()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCreatePost, onToggleView, onEscape])
}
