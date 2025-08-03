'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, ExternalLink, Sparkles } from 'lucide-react'
import { projects, Project } from '../utils/projectData'
import { useState, useEffect } from 'react'

interface ProjectShowcaseProps {
  isOpen: boolean
  onClose: () => void
  highlightedProject?: string | null
}

export default function ProjectShowcase({ isOpen, onClose, highlightedProject }: ProjectShowcaseProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  useEffect(() => {
    if (highlightedProject) {
      const project = projects.find(p => p.id === highlightedProject)
      if (project) {
        setActiveProject(project)
        // Auto-scroll to highlighted project after a brief delay
        setTimeout(() => {
          const element = document.getElementById(`project-${highlightedProject}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 300)
      }
    }
  }, [highlightedProject])

  const caseStudies = projects.filter(p => p.category === 'case-study')
  const experiments = projects.filter(p => p.category === 'experiment')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Sparkles className="size-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Project Showcase</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-8">
                {/* Case Studies Section */}
                <section>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Case Studies
                  </motion.h3>
                  <div className="grid gap-4">
                    {caseStudies.map((project, index) => (
                      <ProjectCard 
                        key={project.id}
                        project={project}
                        index={index}
                        isHighlighted={highlightedProject === project.id}
                        onClick={() => setActiveProject(activeProject?.id === project.id ? null : project)}
                        isExpanded={activeProject?.id === project.id}
                      />
                    ))}
                  </div>
                </section>

                {/* Experiments Section */}
                <section>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Experiments
                  </motion.h3>
                  <div className="grid gap-4">
                    {experiments.map((project, index) => (
                      <ProjectCard 
                        key={project.id}
                        project={project}
                        index={index + caseStudies.length}
                        isHighlighted={highlightedProject === project.id}
                        onClick={() => setActiveProject(activeProject?.id === project.id ? null : project)}
                        isExpanded={activeProject?.id === project.id}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
  isHighlighted: boolean
  onClick: () => void
  isExpanded: boolean
}

function ProjectCard({ project, index, isHighlighted, onClick, isExpanded }: ProjectCardProps) {
  return (
    <motion.div
      id={`project-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isHighlighted 
          ? 'border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      {/* Project Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h4 className="font-semibold text-gray-900">{project.title}</h4>
          </div>
          {project.readTime && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="size-3" />
              {project.readTime}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <h5 className="font-medium text-gray-900 mb-2">Project Summary</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                {project.summary}
              </p>
              
              {project.images && project.images.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-medium text-gray-900 mb-2">Preview</h6>
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: project.color + '20' }}>
                    <span className="text-gray-600">Project Preview</span>
                  </div>
                </div>
              )}
              
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <ExternalLink className="size-4" />
                View Project Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}