// Application constants

export const PRESENTATION_TIMING = {
  PROJECT_DURATION: 5000, // 5 seconds per project
  CHAT_AUTO_CLEAR: 12000, // 12 seconds for regular chat responses
  SCROLL_DELAY: 500, // Delay before scrolling
  PRESENTATION_START_DELAY: 1000, // Delay before starting presentation
} as const

export const ANIMATION_DURATIONS = {
  GRID_TRANSITION: 700, // Grid hover transitions
  CHAT_RESPONSE: 300, // Chat response animations
  PROJECT_HIGHLIGHT: 300, // Project highlighting
} as const

export const Z_INDEX = {
  NAVIGATION: 50,
  CHAT_INPUT: 40,
  PROJECT_TIMER: 30,
} as const