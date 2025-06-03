'use client'
import { motion } from '@/lib/framer'

export default function CalendarLegend() {
  const statusColors = [
    { status: 'Posted', color: 'bg-green-600', description: 'Published content' },
    { status: 'Scheduled', color: 'bg-blue-600', description: 'Ready to publish' },
    { status: 'Drafted', color: 'bg-yellow-600', description: 'Work in progress' },
    { status: 'Idea', color: 'bg-gray-600', description: 'Content ideas' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold text-text mb-3">Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statusColors.map(({ status, color, description }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`}></div>
            <div>
              <div className="text-sm font-medium text-text">{status}</div>
              <div className="text-xs text-gray-400">{description}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
