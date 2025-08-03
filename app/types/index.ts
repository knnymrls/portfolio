// Core types for the portfolio application
import { RefObject } from 'react'

export interface Project {
  id: string
  title: string
  description: string
  summary: string
  category: 'case-study' | 'experiment'
  color: string
  tags: string[]
  readTime?: string
  images?: string[]
  defaultSize: number
  hoveredSize: number
}

export interface ChatResponse {
  reply: string
  navigationAction?: string
  presentProjects?: boolean
  highlightProject?: string
}

export type SectionId = 'hero' | 'case-studies' | 'experiments' | 'top'

export type SectionRefs = {
  [K in SectionId]?: RefObject<HTMLElement | null>
}

export type TabType = 'work' | 'ventures' | 'about'

export interface NavigationFunctionDef {
  name: string
  description: string
  parameters: {
    type: string
    properties: {
      section: {
        type: string
        enum: SectionId[]
        description: string
      }
    }
    required: string[]
  }
}