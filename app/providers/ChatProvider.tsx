'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChatResponse } from '../types'
import { PRESENTATION_TIMING } from '../constants'
import { highlightManager, HighlightSequence } from '@/lib/highlight-manager'
import { elementObserver } from '@/lib/element-observer'

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
  
  // Clean up on route change to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up when component unmounts or route changes
      console.log('🧹 [CLEANUP] Cleaning up ChatProvider on route change')
      highlightManager.clearAllHighlights()
      elementObserver.cleanup()
      // Clear any pending timeouts/intervals
      const highestTimeoutId = setTimeout(() => {}, 0)
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i)
      }
    }
  }, [pathname])

  // Function to handle project presentation with sequential highlighting
  const startProjectPresentation = async () => {
    console.log('🎭 [PRESENTATION] Starting project presentation sequence')
    
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
      console.log('📍 [NAVIGATION] Scrolling to case-studies section')
      caseStudiesSection.scrollIntoView({ behavior: 'smooth' })
      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Start the highlight sequence with descriptions
    console.log(`🔦 [HIGHLIGHT] Starting sequence with ${projectSequence.length} projects`)
    
    for (let i = 0; i < projectSequence.length; i++) {
      const item = projectSequence[i]
      console.log(`✨ [PRESENTATION] Presenting project ${i + 1}/${projectSequence.length}: ${item.elementId}`)
      
      // Update chat with description
      setChatResponse(item.description || '')
      
      // Highlight the element
      await highlightManager.highlight(item.elementId, item.options)
      
      // Wait for the duration
      await new Promise(resolve => setTimeout(resolve, item.options?.duration || 4000))
    }
    
    // Clear highlights after presentation
    console.log('🧹 [HIGHLIGHT] Clearing all highlights after presentation')
    highlightManager.clearAllHighlights()
    
    // Generate dynamic suggestions based on what was shown
    console.log('💡 [PRESENTATION] Generating dynamic follow-up suggestions')
    const suggestionPool = [
      '[suggest:Tell me more about FindU]Tell me about FindU[/suggest]',
      '[suggest:Show me Nural in detail]Show Nural details[/suggest]',
      '[suggest:Explain Flock in detail]Explain Flock[/suggest]',
      '[suggest:What ventures are you working on?]Show your ventures[/suggest]',
      '[suggest:Show me your experiments]Show experiments[/suggest]',
      '[suggest:Read the FindU case study]Read FindU case study[/suggest]',
      '[suggest:What technologies do you use?]Your tech stack[/suggest]',
      '[suggest:Show me the blog]Show blog posts[/suggest]'
    ]
    
    // Randomize and pick 3 different suggestions each time
    const shuffled = suggestionPool.sort(() => 0.5 - Math.random())
    const selectedSuggestions = shuffled.slice(0, 3).join(' ')
    
    setChatResponse('I\'ve highlighted all my key projects for you. ' + selectedSuggestions)
  }

  // Function to highlight related content in parallel
  const highlightRelatedContent = async (elementIds: string[]) => {
    console.log(`🎨 [HIGHLIGHT] Highlighting ${elementIds.length} related elements in parallel:`, elementIds)
    await highlightManager.highlightParallel(elementIds, {
      style: 'glow',
      duration: 3000,
      dimOthers: true,
      intensity: 'medium'
    })
  }

  const handleChatMessage = async (message: string) => {
    console.log('💬 [CHAT] New message received:', message)
    setIsLoading(true)
    setChatResponse('')

    try {
      console.log('🌐 [API] Sending request to /api/chat', {
        messageLength: message.length,
        historyLength: conversationHistory.length,
        currentPath: pathname
      })
      
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
        console.log('✅ [API] Response received successfully', {
          hasNavigation: !!data.navigationAction || !!data.navigatePage,
          hasPresentation: !!data.presentProjects,
          hasHighlight: !!data.highlightProject
        })
        
        setChatResponse(data.reply)
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.reply }
        ])

        // Handle page navigation (new MDX pages)
        if (data.navigatePage) {
          console.log(`🧭 [NAVIGATION] Navigating to page: ${data.navigatePage}`)
          setTimeout(() => {
            router.push(data.navigatePage!)
          }, PRESENTATION_TIMING.SCROLL_DELAY)
        }

        // Handle section navigation (on main page)
        if (data.navigationAction) {
          console.log(`📍 [NAVIGATION] Navigating to section: ${data.navigationAction}`)
          
          // If we're not on the main page, go there first
          if (pathname !== '/') {
            console.log('↩️ [NAVIGATION] Returning to main page first')
            router.push('/')
            // Wait for navigation then scroll
            setTimeout(() => {
              const element = document.getElementById(data.navigationAction!)
              if (element) {
                console.log(`📜 [NAVIGATION] Scrolling to section: ${data.navigationAction}`)
                element.scrollIntoView({ behavior: 'smooth' })
              } else {
                console.warn(`⚠️ [NAVIGATION] Section not found: ${data.navigationAction}`)
              }
            }, PRESENTATION_TIMING.SCROLL_DELAY + 500)
          } else {
            // Direct scroll if already on main page
            setTimeout(() => {
              const element = document.getElementById(data.navigationAction!)
              if (element) {
                console.log(`📜 [NAVIGATION] Scrolling to section: ${data.navigationAction}`)
                element.scrollIntoView({ behavior: 'smooth' })
              } else {
                console.warn(`⚠️ [NAVIGATION] Section not found: ${data.navigationAction}`)
              }
            }, PRESENTATION_TIMING.SCROLL_DELAY)
          }
        }

        // Handle project presentation with advanced highlighting
        if (data.presentProjects) {
          console.log('🎬 [PRESENTATION] Project presentation requested')
          
          // If not on main page, navigate there first
          if (pathname !== '/') {
            console.log('↩️ [NAVIGATION] Returning to main page for presentation')
            router.push('/')
            // Wait for navigation before starting presentation
            setTimeout(() => {
              startProjectPresentation()
            }, 1000)
          } else {
            // Start presentation immediately if on main page
            console.log('▶️ [PRESENTATION] Starting presentation (already on main page)')
            setTimeout(() => {
              startProjectPresentation()
            }, 500)
          }
        }

        // Handle single or multiple element highlighting
        if (data.highlightProject) {
          // Check if it's an array (for multiple highlights) or single string
          const projectsToHighlight = Array.isArray(data.highlightProject) 
            ? data.highlightProject 
            : [data.highlightProject]
          
          // Map project IDs to actual element IDs
          const elementIdMap: Record<string, string> = {
            // Project cards on main page
            'findu-highschool': 'project-findu-highschool',
            'findu-college': 'project-findu-college',
            'nural': 'project-nural',
            'flock': 'project-flock',
            // Also support if they already have the prefix
            'project-findu-highschool': 'project-findu-highschool',
            'project-findu-college': 'project-findu-college',
            'project-nural': 'project-nural',
            'project-flock': 'project-flock'
          }
          
          // Check if we're trying to highlight a project card while not on main page
          const isProjectCard = projectsToHighlight.some(id => 
            elementIdMap[id] || id.startsWith('project-') || 
            ['findu-highschool', 'findu-college', 'nural', 'flock'].includes(id)
          )
          
          if (isProjectCard && pathname !== '/') {
            console.log('🔄 [NAVIGATION] Need to return to main page to highlight project card')
            router.push('/')
            
            // Use observer to wait for elements instead of fixed timeout
            const firstElementId = elementsToHighlight[0]
            elementObserver.waitForElement(
              firstElementId,
              () => {
                console.log('✅ [OBSERVER] Navigation complete, elements ready')
                performHighlighting()
              },
              { timeout: 3000, debug: true }
            ).catch((error) => {
              console.error('❌ [OBSERVER] Failed to find element after navigation:', error)
              // Try highlighting anyway in case the element exists
              performHighlighting()
            })
          } else {
            // Perform highlighting immediately
            performHighlighting()
          }
          
          function performHighlighting() {
            const elementsToHighlight = projectsToHighlight.map(id => {
              console.log(`🔍 [HIGHLIGHT] Processing highlight ID: "${id}"`)
              
              // Check if it's a section ID (starts with 'section-' or 'subsection-')
              if (id.startsWith('section-') || id.startsWith('subsection-') || id.startsWith('title-')) {
                console.log(`📌 [HIGHLIGHT] Section ID detected, using as-is: ${id}`)
                return id // Return as-is for section IDs
              }
              
              // Check if it's a known shorthand (results, features, etc.)
              const sectionShorthands: Record<string, string> = {
                'results': 'section-results-impact',
                'features': 'section-key-features',
                'technical': 'section-technical-implementation',
                'challenge': 'section-the-challenge',
                'solution': 'section-our-solution',
                'the-challenge': 'section-the-challenge',
                'our-solution': 'section-our-solution',
                'results-impact': 'section-results-impact',
                'key-features': 'section-key-features',
                'technical-implementation': 'section-technical-implementation',
                'whats-next': 'section-whats-next',
                'project-overview': 'section-project-overview',
                'outcome': 'section-outcome'
              }
              
              if (sectionShorthands[id]) {
                console.log(`🔄 [HIGHLIGHT] Shorthand matched: ${id} → ${sectionShorthands[id]}`)
                return sectionShorthands[id]
              }
              
              // Check if it's in the element ID map (project cards)
              if (elementIdMap[id]) {
                console.log(`🎯 [HIGHLIGHT] Project card matched: ${id} → ${elementIdMap[id]}`)
                return elementIdMap[id]
              }
              
              // Fallback: add project- prefix if it looks like a project name
              const fallbackId = `project-${id}`
              console.log(`⚠️ [HIGHLIGHT] No match found, using fallback: ${id} → ${fallbackId}`)
              return fallbackId
            })
            
            // First scroll to case-studies section if highlighting a project
            if (elementsToHighlight.some(id => id.startsWith('project-'))) {
              const caseStudiesSection = document.getElementById('case-studies')
              if (caseStudiesSection) {
                console.log('📍 [NAVIGATION] Scrolling to case-studies section for project highlight')
                caseStudiesSection.scrollIntoView({ behavior: 'smooth' })
                
                // Use observer to wait for elements to be visible after scroll
                const firstProjectId = elementsToHighlight.find(id => id.startsWith('project-'))
                if (firstProjectId) {
                  elementObserver.waitForElement(
                    firstProjectId,
                    () => {
                      console.log('✅ [OBSERVER] Elements visible after scroll')
                      performHighlightActions()
                    },
                    { timeout: 2000 }
                  ).catch(() => {
                    // Fallback: try anyway
                    performHighlightActions()
                  })
                } else {
                  performHighlightActions()
                }
              } else {
                performHighlightActions()
              }
            } else {
              performHighlightActions()
            }
            
            function performHighlightActions() {
              if (elementsToHighlight.length === 1) {
                console.log(`🔆 [HIGHLIGHT] Highlighting single element: ${projectsToHighlight[0]} → element: ${elementsToHighlight[0]}`)
                highlightManager.highlight(elementsToHighlight[0], {
                  style: 'simple',
                  duration: 5000,
                  dimOthers: true
                })
              } else {
                console.log(`🔆 [HIGHLIGHT] Highlighting multiple elements: ${projectsToHighlight.join(', ')}`)
                console.log(`🔆 [HIGHLIGHT] Element IDs: ${elementsToHighlight.join(', ')}`)
                // Highlight them in sequence with shorter duration
                elementsToHighlight.forEach((elementId, index) => {
                  setTimeout(() => {
                    console.log(`🔆 [HIGHLIGHT] Highlighting element ${index + 1}/${elementsToHighlight.length}: ${elementId}`)
                    highlightManager.highlight(elementId, {
                      style: 'simple',
                      duration: 3000,
                      dimOthers: true
                    })
                  }, index * 3500) // Stagger the highlights
                })
              }
            }
          }
        }
      } else {
        console.error('❌ [API] Response not OK:', response.status, response.statusText)
        setChatResponse('Sorry, I encountered an error. Please try again.')
      }
    } catch (error) {
      console.error('❌ [CHAT] Error in handleChatMessage:', error)
      setChatResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      console.log('✨ [CHAT] Message handling complete')
      setIsLoading(false)
    }
  }

  const clearResponse = () => {
    setChatResponse('')
    // Also clear highlights when clearing response
    highlightManager.clearAllHighlights()
  }
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 [CLEANUP] ChatProvider unmounting, cleaning up resources')
      highlightManager.cleanup()
      elementObserver.cleanup()
    }
  }, [])

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