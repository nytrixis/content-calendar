'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from '@/lib/framer'

export default function UserProfile() {
  const { user, userProfile, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!user || !userProfile) return null

  // Get display name and avatar initial
  const displayName = userProfile.full_name || user.email || 'User'
  const avatarInitial = userProfile.full_name 
    ? userProfile.full_name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-accentPurple rounded-full flex items-center justify-center text-white font-medium">
          {avatarInitial}
        </div>
        <span className="text-text text-sm hidden md:block">
          {displayName}
        </span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-gray-700 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-700">
              <div className="text-sm text-text font-medium">
                {displayName}
              </div>
              <div className="text-xs text-gray-400 mb-1">
                {user.email}
              </div>
              <div className="text-xs text-gray-400">
                Member since {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  signOut()
                  setShowDropdown(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
