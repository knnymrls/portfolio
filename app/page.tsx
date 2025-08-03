'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import ExperimentsSection from './components/ExperimentsSection'
import ChatInput from './components/ChatInput'
import { useNavigation } from './hooks/useNavigation'
import { useProjectPresentation } from './hooks/useProjectPresentation'
import { SectionId, TabType, ChatResponse } from './types'
import { projects } from './utils/projectData'
import { PRESENTATION_TIMING, Z_INDEX } from './constants'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('work')
  const [chatResponse, setChatResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPresentingProjects, setIsPresentingProjects] = useState(false)
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null)
  const [currentProjectName, setCurrentProjectName] = useState<string>('')

  const { refs, navigateToSection } = useNavigation()
  const { getCurrentProject, startPresentation, stopPresentation } = useProjectPresentation()

  const handleChatMessage = async (message: string) => {
    setIsLoading(true)
    setChatResponse('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      const data: ChatResponse = await response.json()

      if (response.ok) {
        setChatResponse(data.reply)

        // Handle navigation if requested
        if (data.navigationAction) {
          setTimeout(() => {
            navigateToSection(data.navigationAction as SectionId)
          }, PRESENTATION_TIMING.SCROLL_DELAY)
        }

        // Handle project presentation if requested
        if (data.presentProjects) {
          setTimeout(() => {
            setIsPresentingProjects(true)
            startPresentation((projectId: string, description: string) => {
              // Update chat response with current project info
              const project = projects.find(p => p.id === projectId)
              setChatResponse(`Currently highlighting: ${project?.title} - ${description}`)
              setHighlightedProject(projectId)
              setCurrentProjectName(project?.title || 'Project')
            }).then(() => {
              // Presentation completed
              setIsPresentingProjects(false)
              setHighlightedProject(null)
              setCurrentProjectName('')
              setChatResponse('That concludes the project showcase! Feel free to ask about any specific project.')
            })
          }, PRESENTATION_TIMING.PRESENTATION_START_DELAY)
        }

        // Handle single project highlight
        if (data.highlightProject && !data.presentProjects) {
          setTimeout(() => {
            setHighlightedProject(data.highlightProject || null)
          }, PRESENTATION_TIMING.SCROLL_DELAY)
        }
      } else {
        setChatResponse('Sorry, I encountered an error. Please try again.')
      }
    } catch (error) {
      setChatResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearResponse = () => {
    setChatResponse('')
  }

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

        <ChatInput
          response={chatResponse}
          isLoading={isLoading}
          onSendMessage={handleChatMessage}
          onClearResponse={handleClearResponse}
          showTimer={isPresentingProjects && !!highlightedProject}
          timerDuration={PRESENTATION_TIMING.PROJECT_DURATION}
        />
      </div>
    </div>
  )
}