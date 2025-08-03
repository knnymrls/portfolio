import { SectionId, NavigationFunctionDef, SectionRefs } from '../types'

// Navigation function definition for OpenAI
export const navigationFunction: NavigationFunctionDef = {
  name: 'scrollToSection',
  description: 'Scroll to a specific section of the portfolio based on user request',
  parameters: {
    type: 'object',
    properties: {
      section: {
        type: 'string',
        enum: ['hero', 'case-studies', 'experiments', 'top'],
        description: 'The section to scroll to'
      }
    },
    required: ['section']
  }
}

// Smooth scroll utility
export const scrollToSection = (
  sectionId: SectionId, 
  refs: SectionRefs,
  options: ScrollIntoViewOptions = {}
) => {
  const defaultOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  }

  const scrollOptions = { ...defaultOptions, ...options }

  // Handle special case for 'top'
  if (sectionId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Try using ref first
  const ref = refs[sectionId]
  if (ref?.current) {
    ref.current.scrollIntoView(scrollOptions)
    return
  }

  // Fallback to getElementById
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView(scrollOptions)
    return
  }

  console.warn(`Section '${sectionId}' not found for scrolling`)
}

// Parse function calls from OpenAI response
export const parseFunctionCalls = (response: any): SectionId | null => {
  try {
    if (response.choices?.[0]?.message?.function_call) {
      const functionCall = response.choices[0].message.function_call
      if (functionCall.name === 'scrollToSection') {
        const args = JSON.parse(functionCall.arguments)
        return args.section as SectionId
      }
    }
    return null
  } catch (error) {
    console.error('Error parsing function calls:', error)
    return null
  }
}