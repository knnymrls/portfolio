'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export interface Suggestion {
  id: string
  text: string
  action: () => void
}

interface SuggestionsProps {
  suggestions: Suggestion[]
  isVisible: boolean
  onClose?: () => void
}

export default function Suggestions({ suggestions, isVisible, onClose }: SuggestionsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Reset hover when suggestions change
  useEffect(() => {
    setHoveredIndex(null)
  }, [suggestions])

  if (!isVisible || suggestions.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex flex-wrap gap-2 mt-3"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            onClick={() => {
              suggestion.action()
              if (onClose) onClose()
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              px-4 py-2 rounded-full text-sm font-['Sora',_sans-serif] 
              transition-all duration-200 backdrop-blur-sm
              ${hoveredIndex === index 
                ? 'bg-gray-900 text-white shadow-lg transform -translate-y-0.5' 
                : 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-white'
              }
            `}
          >
            {suggestion.text}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}