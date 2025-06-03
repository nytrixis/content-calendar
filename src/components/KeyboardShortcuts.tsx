'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from '@/lib/framer'

export default function KeyboardShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false)

  const shortcuts = [
    { key: 'Ctrl/Cmd + N', description: 'Create new post' },
    { key: 'Ctrl/Cmd + V', description: 'Toggle calendar/list view' },
    { key: 'Escape', description: 'Close modals' },
    { key: '?', description: 'Show/hide shortcuts' },
  ]

  return (
    <>
      <button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 right-4 bg-accentPurple text-white p-3 rounded-full hover:bg-purple-600 transition-colors shadow-lg"
        title="Keyboard shortcuts"
      >
        ⌨️
      </button>

      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map(({ key, description }) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-300">{description}</span>
                    <kbd className="bg-background px-2 py-1 rounded text-sm text-accentPurple font-mono">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
