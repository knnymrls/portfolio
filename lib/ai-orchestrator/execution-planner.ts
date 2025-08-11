import OpenAI from 'openai'
import { QueryAnalysis } from './query-analyzer'
import { ActionDefinition, ActionStep, ACTION_REGISTRY, getActionsByIntent } from './action-registry'

export interface ExecutionPlan {
  id: string
  query: string
  analysis: QueryAnalysis
  selectedAction: string
  steps: ActionStep[]
  contextRequired: string[]
  estimatedDuration: number
  followUps: string[]
  metadata?: Record<string, any>
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createExecutionPlan(
  query: string, 
  analysis: QueryAnalysis
): Promise<ExecutionPlan> {
  // For simple greetings, use direct action
  if (analysis.intent === 'greeting') {
    return {
      id: generatePlanId(),
      query,
      analysis,
      selectedAction: 'respond_greeting',
      steps: ACTION_REGISTRY.respond_greeting.steps,
      contextRequired: [],
      estimatedDuration: 1,
      followUps: ACTION_REGISTRY.respond_greeting.followUps
    }
  }

  // For simple queries, pick the right action based on intent
  if (analysis.complexity === 'simple') {
    const action = selectSimpleAction(analysis)
    return {
      id: generatePlanId(),
      query,
      analysis,
      selectedAction: action.id,
      steps: action.steps,
      contextRequired: action.contextNeeded,
      estimatedDuration: action.estimatedDuration,
      followUps: action.followUps
    }
  }

  // For complex queries, use AI to create custom plan
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an execution planner for a portfolio website. Based on the query analysis, create a detailed execution plan.

Available actions: ${Object.keys(ACTION_REGISTRY).join(', ')}

For the given query and analysis, return a JSON object:
{
  "selectedAction": "action_id from registry or 'custom'",
  "customSteps": [...] // Only if selectedAction is 'custom'
  "contextRequired": ["what content to retrieve"],
  "metadata": { "specific_projects": [...], "comparison_items": [...] }
}

Examples:
- "Show me projects" → selectedAction: "showcase_all_projects"
- "Tell me about Nural" → selectedAction: "showcase_single_project", metadata: { specific_projects: ["nural"] }
- "Compare Flock and Nural" → selectedAction: "compare_projects", metadata: { comparison_items: ["flock", "nural"] }`
        },
        {
          role: 'user',
          content: JSON.stringify({ query, analysis })
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    
    // Get the selected action or create custom
    let action: ActionDefinition
    if (result.selectedAction && ACTION_REGISTRY[result.selectedAction]) {
      action = ACTION_REGISTRY[result.selectedAction]
    } else if (result.customSteps) {
      // Create custom action from AI-generated steps
      action = {
        id: 'custom',
        name: 'Custom Action',
        description: `Custom plan for: ${query}`,
        steps: result.customSteps,
        contextNeeded: result.contextRequired || [],
        estimatedDuration: analysis.estimatedDuration,
        followUps: generateSmartFollowUps(analysis, result.metadata)
      }
    } else {
      // Fallback to best matching action
      action = selectBestAction(analysis)
    }

    // Customize steps with metadata
    const customizedSteps = customizeSteps(action.steps, result.metadata)

    return {
      id: generatePlanId(),
      query,
      analysis,
      selectedAction: action.id,
      steps: customizedSteps,
      contextRequired: [...action.contextNeeded, ...(result.contextRequired || [])],
      estimatedDuration: action.estimatedDuration,
      followUps: action.followUps,
      metadata: result.metadata
    }
  } catch (error) {
    console.error('Execution planning failed:', error)
    
    // Fallback plan
    const fallbackAction = selectBestAction(analysis)
    return {
      id: generatePlanId(),
      query,
      analysis,
      selectedAction: fallbackAction.id,
      steps: fallbackAction.steps,
      contextRequired: fallbackAction.contextNeeded,
      estimatedDuration: fallbackAction.estimatedDuration,
      followUps: fallbackAction.followUps
    }
  }
}

function selectSimpleAction(analysis: QueryAnalysis): ActionDefinition {
  switch (analysis.intent) {
    case 'navigate':
      return ACTION_REGISTRY.navigate_to_section
    case 'explain':
      return ACTION_REGISTRY.explain_simple
    case 'action':
      return ACTION_REGISTRY.provide_contact
    case 'greeting':
      return ACTION_REGISTRY.respond_greeting
    default:
      return ACTION_REGISTRY.explain_simple
  }
}

function selectBestAction(analysis: QueryAnalysis): ActionDefinition {
  // Map intent to action
  const intentMap: Record<string, string> = {
    'showcase': 'showcase_all_projects',
    'compare': 'compare_projects',
    'explain': 'explain_detailed',
    'research': 'explore_topic',
    'navigate': 'navigate_to_section',
    'action': 'provide_contact',
    'greeting': 'respond_greeting'
  }

  const actionId = intentMap[analysis.intent] || 'explain_simple'
  return ACTION_REGISTRY[actionId]
}

function customizeSteps(steps: ActionStep[], metadata?: Record<string, any>): ActionStep[] {
  if (!metadata) return steps

  return steps.map(step => {
    const customStep = { ...step }
    
    // Customize based on metadata
    if (step.target === 'specific_project' && metadata.specific_projects) {
      customStep.target = metadata.specific_projects[0]
    }
    
    if (step.target === 'multiple_projects' && metadata.comparison_items) {
      customStep.target = metadata.comparison_items
    }
    
    return customStep
  })
}

function generateSmartFollowUps(analysis: QueryAnalysis, metadata?: Record<string, any>): string[] {
  const followUps: string[] = []
  
  // Based on intent
  if (analysis.intent === 'showcase') {
    followUps.push('which_project_proud_of', 'technical_challenges')
  } else if (analysis.intent === 'compare') {
    followUps.push('which_was_harder', 'why_different_approaches')
  } else if (analysis.intent === 'explain') {
    followUps.push('how_it_works', 'see_example')
  }
  
  // Based on entities
  if (analysis.entities.includes('nural')) {
    followUps.push('nural_user_impact')
  }
  if (analysis.entities.includes('flock')) {
    followUps.push('flock_scheduling_algorithm')
  }
  
  // Add variety
  if (metadata?.specific_projects) {
    followUps.push('see_another_project')
  }
  
  return followUps.slice(0, 3)
}

function generatePlanId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper to check if plan needs user confirmation
export function needsUserConfirmation(plan: ExecutionPlan): boolean {
  return plan.estimatedDuration > 10 || plan.steps.length > 5
}

// Helper to get plan summary for user
export function getPlanSummary(plan: ExecutionPlan): string {
  const stepDescriptions = plan.steps
    .filter(s => s.description)
    .map(s => s.description)
    .join(' → ')
  
  return `I'll ${plan.selectedAction.replace(/_/g, ' ')}. ${stepDescriptions} (${plan.estimatedDuration}s)`
}