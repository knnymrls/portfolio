'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ExperimentsSection from './components/ExperimentsSection'
import { useNavigation } from './hooks/useNavigation'
import { useProjectPresentation } from './hooks/useProjectPresentation'
import { SectionId, TabType } from './types'
import { projects } from './utils/projectData'
import { PRESENTATION_TIMING, Z_INDEX } from './constants'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('work')
  const [isPresentingProjects, setIsPresentingProjects] = useState(false)
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null)

  const { refs, navigateToSection } = useNavigation()
  const { getCurrentProject, startPresentation, stopPresentation } = useProjectPresentation()

  // Listen for project presentation events from ChatProvider
  useEffect(() => {
    const handlePresentProjects = (event: CustomEvent) => {
      setIsPresentingProjects(true)
      startPresentation((projectId: string, description: string) => {
        const project = projects.find(p => p.id === projectId)
        setHighlightedProject(projectId)
      }).then(() => {
        setIsPresentingProjects(false)
        setHighlightedProject(null)
      })
    }

    const handleHighlightElement = (event: CustomEvent) => {
      const { elementId } = event.detail
      setHighlightedProject(elementId)
      // Clear highlight after some time
      setTimeout(() => {
        setHighlightedProject(null)
      }, PRESENTATION_TIMING.PROJECT_DURATION)
    }

    window.addEventListener('presentProjects', handlePresentProjects as EventListener)
    window.addEventListener('highlightElement', handleHighlightElement as EventListener)

    return () => {
      window.removeEventListener('presentProjects', handlePresentProjects as EventListener)
      window.removeEventListener('highlightElement', handleHighlightElement as EventListener)
    }
  }, [startPresentation])

  // Get current presenting project ID for highlighting
  const currentProject = getCurrentProject()
  const currentlyHighlightedProject = isPresentingProjects
    ? currentProject?.projectId || null
    : highlightedProject

  return (
    <div className="relative size-full min-h-screen">
      {/* Background layer with pattern */}
      <div className="fixed inset-0 z-0 bg-pattern transition-colors duration-300" />

      {/* Content layer */}
      <div className="relative z-10">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div
          className="relative box-border content-stretch flex flex-col gap-[108px] items-start justify-start p-0 top-[165px] w-full max-w-[1000px] mx-auto px-6 pb-32"
          style={{ zIndex: Z_INDEX.CONTENT }}
        >
          <section ref={refs.heroRef} id="hero">
            <HeroSection />
          </section>

          <section ref={refs.caseStudiesRef} id="case-studies">
            <CaseStudiesSection highlightedProjectId={currentlyHighlightedProject} />
          </section>

          <section ref={refs.experimentsRef} id="experiments">
            <ExperimentsSection />
          </section>
        </div>
      </div>
    </div>
  )
}