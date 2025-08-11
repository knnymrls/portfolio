export interface ActionStep {
  type: 'retrieve' | 'navigate' | 'highlight' | 'wait' | 'generate' | 'analyze' | 'present'
  target?: string | string[]
  duration?: number
  options?: Record<string, any>
  description?: string // User-facing description
}

export interface ActionDefinition {
  id: string
  name: string
  description: string
  steps: ActionStep[]
  contextNeeded: string[]
  estimatedDuration: number
  followUps: string[]
}

export const ACTION_REGISTRY: Record<string, ActionDefinition> = {
  // Showcase actions
  'showcase_all_projects': {
    id: 'showcase_all_projects',
    name: 'Showcase All Projects',
    description: 'Present all projects with highlights and descriptions',
    steps: [
      { type: 'retrieve', target: ['all_projects', 'project_stats'], description: 'Gathering project information...' },
      { type: 'navigate', target: 'case-studies', description: 'Navigating to projects section...' },
      { type: 'wait', duration: 800 },
      { type: 'present', target: 'project_sequence', duration: 16000, description: 'Presenting projects...' },
      { type: 'generate', target: 'project_summary', description: 'Generating summary...' }
    ],
    contextNeeded: ['project_descriptions', 'project_stats', 'tech_stacks'],
    estimatedDuration: 20,
    followUps: ['which_project_proud_of', 'technical_challenges', 'see_project_details']
  },

  'showcase_single_project': {
    id: 'showcase_single_project',
    name: 'Showcase Single Project',
    description: 'Highlight and explain a specific project',
    steps: [
      { type: 'retrieve', target: 'project_details', description: 'Loading project details...' },
      { type: 'navigate', target: 'case-studies' },
      { type: 'highlight', target: 'specific_project', duration: 5000 },
      { type: 'generate', target: 'project_explanation' }
    ],
    contextNeeded: ['project_content', 'project_impact', 'technical_details'],
    estimatedDuration: 7,
    followUps: ['how_it_works', 'technical_stack', 'see_another_project']
  },

  // Navigation actions
  'navigate_to_section': {
    id: 'navigate_to_section',
    name: 'Navigate to Section',
    description: 'Scroll to a specific section',
    steps: [
      { type: 'navigate', target: 'section' },
      { type: 'wait', duration: 500 }
    ],
    contextNeeded: [],
    estimatedDuration: 1,
    followUps: ['tell_me_more', 'show_examples']
  },

  'navigate_to_page': {
    id: 'navigate_to_page',
    name: 'Navigate to Page',
    description: 'Navigate to a different page',
    steps: [
      { type: 'navigate', target: 'page' },
      { type: 'wait', duration: 1000 }
    ],
    contextNeeded: [],
    estimatedDuration: 2,
    followUps: ['explore_more', 'go_back']
  },

  // Comparison actions
  'compare_projects': {
    id: 'compare_projects',
    name: 'Compare Projects',
    description: 'Compare multiple projects',
    steps: [
      { type: 'retrieve', target: 'multiple_projects', description: 'Gathering project data...' },
      { type: 'analyze', target: 'similarities_differences', description: 'Analyzing projects...' },
      { type: 'highlight', target: 'alternating', duration: 6000 },
      { type: 'generate', target: 'comparison_table' }
    ],
    contextNeeded: ['all_project_details', 'technical_specs', 'impact_metrics'],
    estimatedDuration: 8,
    followUps: ['which_was_harder', 'why_different_approaches', 'most_successful']
  },

  'technical_deep_dive': {
    id: 'technical_deep_dive',
    name: 'Technical Deep Dive',
    description: 'Detailed technical analysis',
    steps: [
      { type: 'retrieve', target: ['technical_details', 'code_samples'], description: 'Loading technical information...' },
      { type: 'analyze', target: 'architecture', description: 'Analyzing architecture...' },
      { type: 'generate', target: 'technical_explanation' }
    ],
    contextNeeded: ['tech_stack', 'architecture', 'challenges', 'solutions'],
    estimatedDuration: 5,
    followUps: ['see_code', 'explain_architecture', 'biggest_challenge']
  },

  // Explanation actions
  'explain_simple': {
    id: 'explain_simple',
    name: 'Simple Explanation',
    description: 'Quick explanation of a topic',
    steps: [
      { type: 'retrieve', target: 'basic_info' },
      { type: 'generate', target: 'simple_response' }
    ],
    contextNeeded: ['basic_content'],
    estimatedDuration: 2,
    followUps: ['tell_me_more', 'show_example', 'how_it_works']
  },

  'explain_detailed': {
    id: 'explain_detailed',
    name: 'Detailed Explanation',
    description: 'In-depth explanation with examples',
    steps: [
      { type: 'retrieve', target: ['full_content', 'examples', 'context'] },
      { type: 'analyze', target: 'key_points' },
      { type: 'generate', target: 'detailed_response' }
    ],
    contextNeeded: ['full_content', 'examples', 'related_content'],
    estimatedDuration: 4,
    followUps: ['specific_aspect', 'see_implementation', 'related_topics']
  },

  // Research actions
  'explore_topic': {
    id: 'explore_topic',
    name: 'Explore Topic',
    description: 'Explore a topic across multiple projects',
    steps: [
      { type: 'retrieve', target: 'topic_mentions', description: 'Searching across projects...' },
      { type: 'analyze', target: 'topic_usage' },
      { type: 'generate', target: 'topic_overview' }
    ],
    contextNeeded: ['all_content', 'topic_references'],
    estimatedDuration: 6,
    followUps: ['specific_example', 'how_implemented', 'evolution']
  },

  // Action-oriented
  'provide_contact': {
    id: 'provide_contact',
    name: 'Provide Contact Information',
    description: 'Show contact details and options',
    steps: [
      { type: 'retrieve', target: 'contact_info' },
      { type: 'generate', target: 'contact_response' }
    ],
    contextNeeded: ['contact_details', 'availability'],
    estimatedDuration: 1,
    followUps: ['schedule_meeting', 'see_resume', 'view_github']
  },

  // Greeting
  'respond_greeting': {
    id: 'respond_greeting',
    name: 'Respond to Greeting',
    description: 'Friendly greeting response',
    steps: [
      { type: 'generate', target: 'greeting' }
    ],
    contextNeeded: [],
    estimatedDuration: 1,
    followUps: ['show_projects', 'about_me', 'what_do_you_do']
  }
}

// Helper functions to work with actions
export function getActionById(id: string): ActionDefinition | undefined {
  return ACTION_REGISTRY[id]
}

export function getActionsByIntent(intent: string): ActionDefinition[] {
  return Object.values(ACTION_REGISTRY).filter(action => 
    action.id.toLowerCase().includes(intent.toLowerCase())
  )
}

export function estimateTotalDuration(steps: ActionStep[]): number {
  return steps.reduce((total, step) => {
    if (step.duration) return total + step.duration / 1000
    if (step.type === 'wait') return total + (step.duration || 1000) / 1000
    return total + 0.5 // Default 0.5s per step
  }, 0)
}