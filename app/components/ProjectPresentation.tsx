'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Sparkles } from 'lucide-react'
import { useProjectPresentation } from '../hooks/useProjectPresentation'
import { useEffect } from 'react'

interface ProjectPresentationProps {
  isActive: boolean
  onComplete?: () => void
}

export default function ProjectPresentation({ isActive, onComplete }: ProjectPresentationProps) {
  const { 
    isPresenting, 
    startPresentation, 
    stopPresentation, 
    getCurrentProject 
  } = useProjectPresentation()

  const currentProject = getCurrentProject()

  useEffect(() => {
    if (isActive && !isPresenting) {
      startPresentation()
    } else if (!isActive && isPresenting) {
      stopPresentation()
    }
  }, [isActive, isPresenting, startPresentation, stopPresentation])

  useEffect(() => {
    if (isPresenting && !currentProject) {
      // Presentation finished
      if (onComplete) {
        onComplete()
      }
    }
  }, [isPresenting, currentProject, onComplete])

  if (!isPresenting || !currentProject) return null

  const progress = ((currentProject.index + 1) / currentProject.total) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-lg px-6"
      >
        <div className="backdrop-blur-md bg-white/90 border border-white/40 rounded-2xl p-4 shadow-lg">
          {/* Header with progress */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-blue-500" />
              <span className="font-medium text-gray-900">
                Project {currentProject.index + 1} of {currentProject.total}
              </span>
            </div>
            <button
              onClick={stopPresentation}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="size-4 text-gray-600" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current project info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-900">
              {currentProject.projectTitle}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {currentProject.description}
            </p>
            
            {/* Time indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="size-4" />
              <span>Presenting for 10 seconds...</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}