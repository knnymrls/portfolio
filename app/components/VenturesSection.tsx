'use client'

import { motion } from 'framer-motion'
import { getContentByType } from '../../content'

interface VenturesSectionProps {
  highlightedVentureId?: string | null
}

export default function VenturesSection({ highlightedVentureId }: VenturesSectionProps) {
  const ventures = getContentByType('venture')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Ventures
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Independent projects and entrepreneurial ventures I'm building.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ventures.map((venture, index) => (
          <motion.div
            key={venture.id}
            id={venture.highlightId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${
              highlightedVentureId === venture.highlightId 
                ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                : ''
            }`}
            onClick={() => {
              window.open(venture.path, '_blank')
            }}
          >
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                {venture.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                {venture.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {venture.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                Learn more →
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {ventures.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Coming soon...</p>
          <p className="text-sm mt-2">I'm working on some exciting ventures. Check back later!</p>
        </div>
      )}
    </motion.div>
  )
}