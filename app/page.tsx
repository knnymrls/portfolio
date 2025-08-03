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
import { SectionId } from './utils/navigation'
import { projects } from './utils/projectData'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'work' | 'ventures' | 'about'>('work')
  const [chatResponse, setChatResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPresentingProjects, setIsPresentingProjects] = useState(false)
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null)
  
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

      const data = await response.json()

      if (response.ok) {
        console.log('API Response:', data) // Debug log
        setChatResponse(data.reply)
        
        // Handle navigation if requested
        if (data.navigationAction) {
          setTimeout(() => {
            navigateToSection(data.navigationAction as SectionId)
          }, 500)
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
            }).then(() => {
              // Presentation completed
              setIsPresentingProjects(false)
              setHighlightedProject(null)
              setChatResponse('That concludes the project showcase! Feel free to ask about any specific project.')
            })
          }, 1000) // Start presentation after scroll completes
        }

        // Handle single project highlight
        if (data.highlightProject && !data.presentProjects) {
          setTimeout(() => {
            setHighlightedProject(data.highlightProject)
          }, 500)
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
    <div className="bg-[#fbfbfb] relative size-full min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative box-border content-stretch flex flex-col gap-[108px] items-start justify-start p-0 top-[165px] w-full max-w-[1000px] mx-auto px-6 pb-32">
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
      />

    </div>
  )
}