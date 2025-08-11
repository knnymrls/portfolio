'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChatResponse } from '../types'
import { PRESENTATION_TIMING } from '../constants'
import { highlightManager, HighlightSequence } from '@/lib/highlight-manager'

interface ChatContextType {
  chatResponse: string
  isLoading: boolean
  conversationHistory: Array<{ role: string; content: string }>
  handleChatMessage: (message: string) => Promise<void>
  clearResponse: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatResponse, setChatResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([])
  const [lastHighlighted, setLastHighlighted] = useState<string | null>(null)
  
  const router = useRouter()
  const pathname = usePathname()

  // Function to handle project presentation with sequential highlighting
  const startProjectPresentation = async () => {
    // Define the sequence of projects to highlight
    const projectSequence: HighlightSequence[] = [
      {
        elementId: 'project-findu-highschool',
        options: {
          style: 'simple',
          duration: 4000,
          dimOthers: true
        },
        description: 'FindU - Helping GenZ figure out their next steps after graduating high school'
      },
      {
        elementId: 'project-nural',
        options: {
          style: 'simple',
          duration: 4000,
          dimOthers: true
        },
        description: 'Nural - An innovative chat-based way of learning and analyzing stocks'
      },
      {
        elementId: 'project-flock',
        options: {
          style: 'simple',
          duration: 4000,
          dimOthers: true
        },
        description: 'Flock - Helping teams find time to meet using AI'
      },
      {
        elementId: 'project-findu-college',
        options: {
          style: 'simple',
          duration: 4000,
          dimOthers: true
        },
        description: 'FindU - Helping students find the perfect college through personalization and gamification'
      }
    ]

    // First scroll to case studies section
    const caseStudiesSection = document.getElementById('case-studies')
    if (caseStudiesSection) {
      caseStudiesSection.scrollIntoView({ behavior: 'smooth' })
      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Start the highlight sequence with descriptions
    for (const item of projectSequence) {
      // Update chat with description
      setChatResponse(item.description || '')
      
      // Highlight the element
      await highlightManager.highlight(item.elementId, item.options)
      
      // Wait for the duration
      await new Promise(resolve => setTimeout(resolve, item.options?.duration || 4000))
    }
    
    // Clear highlights after presentation
    highlightManager.clearAllHighlights()
    
    // After showing all projects, add follow-up suggestions
    const followUpSuggestions = [
      '[suggest:Which project are you most proud of and why?]Which are you most proud of?[/suggest]',
      '[suggest:What was the most technically challenging aspect?]Most technical challenge?[/suggest]',
      '[suggest:Tell me more about your design process]Your design process?[/suggest]'
    ].join(' ')
    
    setChatResponse('I\'ve highlighted all my key projects for you. ' + followUpSuggestions)
  }

  // Function to highlight related content in parallel
  const highlightRelatedContent = async (elementIds: string[]) => {
    await highlightManager.highlightParallel(elementIds, {
      style: 'glow',
      duration: 3000,
      dimOthers: true,
      intensity: 'medium'
    })
  }

  const handleChatMessage = async (message: string) => {
    setIsLoading(true)
    setChatResponse('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          conversationHistory,
          currentPath: pathname 
        }),
      })

      const data: ChatResponse = await response.json()

      if (response.ok) {
        setChatResponse(data.reply)
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.reply }
        ])

        // Handle page navigation (new MDX pages)
        if (data.navigatePage) {
          setTimeout(() => {
            router.push(data.navigatePage!)
          }, PRESENTATION_TIMING.SCROLL_DELAY)
        }

        // Handle section navigation (on main page)
        if (data.navigationAction) {
          // If we're not on the main page, go there first
          if (pathname !== '/') {
            router.push('/')
            // Wait for navigation then scroll
            setTimeout(() => {
              const element = document.getElementById(data.navigationAction!)
              element?.scrollIntoView({ behavior: 'smooth' })
            }, PRESENTATION_TIMING.SCROLL_DELAY + 500)
          } else {
            // Direct scroll if already on main page
            setTimeout(() => {
              const element = document.getElementById(data.navigationAction!)
              element?.scrollIntoView({ behavior: 'smooth' })
            }, PRESENTATION_TIMING.SCROLL_DELAY)
          }
        }

        // Handle project presentation with advanced highlighting
        if (data.presentProjects) {
          // If not on main page, navigate there first
          if (pathname !== '/') {
            router.push('/')
            // Wait for navigation before starting presentation
            setTimeout(() => {
              startProjectPresentation()
            }, 1000)
          } else {
            // Start presentation immediately if on main page
            setTimeout(() => {
              startProjectPresentation()
            }, 500)
          }
        }

        // Handle single element highlighting with simple opacity
        if (data.highlightProject) {
          highlightManager.highlight(data.highlightProject, {
            style: 'simple',
            duration: 5000,
            dimOthers: true
          })
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

  const clearResponse = () => {
    setChatResponse('')
  }

  return (
    <ChatContext.Provider value={{
      chatResponse,
      isLoading,
      conversationHistory,
      handleChatMessage,
      clearResponse
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}