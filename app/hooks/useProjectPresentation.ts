import { useState, useCallback } from 'react'
import { projects } from '../utils/projectData'

export const useProjectPresentation = () => {
  const [isPresenting, setIsPresenting] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number | null>(null)

  const startPresentation = useCallback(async (onProjectChange?: (projectId: string, description: string) => void) => {
    setIsPresenting(true)
    setCurrentProjectIndex(0)

    // Run through each project
    for (let i = 0; i < projects.length; i++) {
      setCurrentProjectIndex(i)
      
      // Notify about current project
      if (onProjectChange) {
        onProjectChange(projects[i].id, projects[i].summary)
      }
      
      // Wait 10 seconds before next project
      await new Promise(resolve => setTimeout(resolve, 10000))
    }

    // End presentation
    setIsPresenting(false)
    setCurrentProjectIndex(null)
  }, [])

  const stopPresentation = useCallback(() => {
    setIsPresenting(false)
    setCurrentProjectIndex(null)
  }, [])

  const getCurrentProject = useCallback(() => {
    if (currentProjectIndex === null || !projects[currentProjectIndex]) {
      return null
    }
    return {
      projectId: projects[currentProjectIndex].id,
      index: currentProjectIndex,
      total: projects.length
    }
  }, [currentProjectIndex])

  return {
    isPresenting,
    currentProjectIndex,
    startPresentation,
    stopPresentation,
    getCurrentProject
  }
}