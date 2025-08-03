import { useRef } from 'react'
import { scrollToSection } from '../utils/navigation'
import { SectionId, SectionRefs } from '../types'

export const useNavigation = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLElement>(null)
  const caseStudiesRef = useRef<HTMLElement>(null)
  const experimentsRef = useRef<HTMLElement>(null)

  // Create refs mapping
  const sectionRefs: SectionRefs = {
    hero: heroRef,
    'case-studies': caseStudiesRef,
    experiments: experimentsRef
  }

  // Navigation function
  const navigateToSection = (sectionId: SectionId) => {
    scrollToSection(sectionId, sectionRefs)
  }

  return {
    refs: {
      heroRef,
      caseStudiesRef,
      experimentsRef
    },
    navigateToSection
  }
}