import OpenAI from 'openai'
import { ExecutionPlan } from './execution-planner'
import { StepResult } from './action-executor'

export interface ComposedResponse {
  message: string
  commands: {
    navigate?: string
    navigatePage?: string
    highlight?: string
    presentProjects?: boolean
  }
  suggestions: string[]
  metadata?: Record<string, any>
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function composeResponse(
  plan: ExecutionPlan,
  executionResults: StepResult[],
  context: Map<string, any>
): Promise<ComposedResponse> {
  // Extract key data from execution
  const retrievedData = extractRetrievedData(executionResults, context)
  const navigationCommands = extractNavigationCommands(executionResults)
  const analysisResults = extractAnalysisResults(context)

  // For simple responses, use templates
  if (plan.analysis.complexity === 'simple' && plan.selectedAction === 'respond_greeting') {
    return {
      message: "Hi! I'm Kenny's portfolio assistant. I can show you my projects, explain my work, or help you learn more about my experience. What would you like to explore?",
      commands: {},
      suggestions: [
        '[suggest:Show me your projects]Show me your projects[/suggest]',
        '[suggest:What do you do?]What do you do?[/suggest]',
        '[suggest:Tell me about yourself]About you?[/suggest]'
      ]
    }
  }

  // For complex responses, use AI to compose
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Kenny's portfolio AI assistant composing a response based on an executed plan.

CONTEXT PROVIDED:
${formatContext(retrievedData, analysisResults)}

EXECUTION PLAN:
- Query: "${plan.query}"
- Intent: ${plan.analysis.intent}
- Action taken: ${plan.selectedAction}

INSTRUCTIONS:
1. Create a natural, conversational response using the ACTUAL DATA provided
2. Be specific - use real numbers, names, and details from the context
3. Keep it concise but informative
4. Match the intent (explain, showcase, compare, etc.)
5. If showcasing projects, describe what's being shown
6. For comparisons, highlight key differences

IMPORTANT: Use the actual data provided. Don't make up generic descriptions.

Response format:
{
  "message": "Your natural response here",
  "internalCommands": ["HIGHLIGHT:nural", "NAVIGATE:case-studies"],
  "metadata": { "mentionedProjects": ["nural"], "topics": ["ai", "scheduling"] }
}`
        },
        {
          role: 'user',
          content: `Generate response for: ${plan.query}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 400
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    
    // Parse internal commands
    const commands = parseInternalCommands(result.internalCommands || [], navigationCommands)
    
    // Generate contextual suggestions
    const suggestions = generateContextualSuggestions(
      plan,
      result.metadata,
      context
    )

    return {
      message: result.message || generateFallbackMessage(plan, retrievedData),
      commands,
      suggestions,
      metadata: result.metadata
    }
  } catch (error) {
    console.error('Response composition failed:', error)
    
    // Fallback response
    return {
      message: generateFallbackMessage(plan, retrievedData),
      commands: navigationCommands,
      suggestions: plan.followUps.map(f => `[suggest:${f}]${f.replace(/_/g, ' ')}[/suggest]`)
    }
  }
}

function extractRetrievedData(results: StepResult[], context: Map<string, any>): Record<string, any> {
  const data: Record<string, any> = {}
  
  // Get all retrieved data from results
  results
    .filter(r => r.step.type === 'retrieve' && r.result.success)
    .forEach(r => {
      Object.assign(data, r.result.data)
    })
  
  // Add context data
  context.forEach((value, key) => {
    if (!key.startsWith('analysis_')) {
      data[key] = value
    }
  })
  
  return data
}

function extractNavigationCommands(results: StepResult[]): ComposedResponse['commands'] {
  const commands: ComposedResponse['commands'] = {}
  
  results.forEach(r => {
    if (r.step.type === 'navigate' && r.result.success) {
      const navData = r.result.data
      if (navData.type === 'page') {
        commands.navigatePage = navData.navigateTo
      } else {
        commands.navigate = navData.navigateTo
      }
    }
    
    if (r.step.type === 'highlight' && r.result.success) {
      commands.highlight = r.result.data.highlighted
    }
    
    if (r.step.type === 'present' && r.result.data?.presentationType === 'project_sequence') {
      commands.presentProjects = true
    }
  })
  
  return commands
}

function extractAnalysisResults(context: Map<string, any>): Record<string, any> {
  const analysis: Record<string, any> = {}
  
  context.forEach((value, key) => {
    if (key.startsWith('analysis_')) {
      analysis[key.replace('analysis_', '')] = value
    }
  })
  
  return analysis
}

function formatContext(data: Record<string, any>, analysis: Record<string, any>): string {
  const sections: string[] = []
  
  // Format project data
  if (data.all_projects) {
    sections.push(`PROJECTS:
${data.all_projects.map((p: any) => `- ${p.title}: ${p.description}`).join('\n')}`)
  }
  
  // Format stats
  if (data.project_stats) {
    sections.push(`PROJECT STATS:
${Object.entries(data.project_stats).map(([k, v]: [string, any]) => 
  `- ${k}: ${Object.entries(v).map(([stat, val]) => `${stat}: ${val}`).join(', ')}`
).join('\n')}`)
  }
  
  // Format analysis
  if (Object.keys(analysis).length > 0) {
    sections.push(`ANALYSIS RESULTS:
${Object.entries(analysis).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}`)
  }
  
  return sections.join('\n\n')
}

function parseInternalCommands(
  internalCommands: string[], 
  executionCommands: ComposedResponse['commands']
): ComposedResponse['commands'] {
  const commands = { ...executionCommands }
  
  internalCommands.forEach(cmd => {
    if (cmd.startsWith('HIGHLIGHT:')) {
      commands.highlight = cmd.replace('HIGHLIGHT:', '')
    } else if (cmd.startsWith('NAVIGATE:')) {
      commands.navigate = cmd.replace('NAVIGATE:', '')
    } else if (cmd.startsWith('NAVIGATE_PAGE:')) {
      commands.navigatePage = cmd.replace('NAVIGATE_PAGE:', '')
    } else if (cmd === 'PRESENT_PROJECTS') {
      commands.presentProjects = true
    }
  })
  
  return commands
}

function generateContextualSuggestions(
  plan: ExecutionPlan,
  metadata: any,
  context: Map<string, any>
): string[] {
  const suggestions: string[] = []
  
  // Project-specific suggestions
  if (metadata?.mentionedProjects?.includes('nural')) {
    suggestions.push('[suggest:How does the chat-based learning work?]How does it work?[/suggest]')
  }
  if (metadata?.mentionedProjects?.includes('flock')) {
    suggestions.push('[suggest:How does the AI scheduling work?]Scheduling algorithm?[/suggest]')
  }
  if (metadata?.mentionedProjects?.includes('findu')) {
    suggestions.push('[suggest:What was the user impact?]User impact?[/suggest]')
  }
  
  // Topic-based suggestions
  if (metadata?.topics?.includes('ai')) {
    suggestions.push('[suggest:What AI techniques do you use?]AI techniques?[/suggest]')
  }
  if (metadata?.topics?.includes('technical')) {
    suggestions.push('[suggest:What was the biggest technical challenge?]Biggest challenge?[/suggest]')
  }
  
  // Action-based suggestions
  if (plan.selectedAction === 'showcase_all_projects') {
    suggestions.push('[suggest:Which project are you most proud of?]Most proud of?[/suggest]')
    suggestions.push('[suggest:What was the most challenging?]Most challenging?[/suggest]')
  } else if (plan.selectedAction === 'compare_projects') {
    suggestions.push('[suggest:Which was harder to build?]Which was harder?[/suggest]')
    suggestions.push('[suggest:Why different approaches?]Why different?[/suggest]')
  }
  
  // Add navigation suggestion if not already showing projects
  if (!plan.selectedAction.includes('showcase')) {
    suggestions.push('[suggest:Show me your projects]Show me projects[/suggest]')
  } else {
    // Check if there are unshown projects
    const shownProjects = metadata?.mentionedProjects || []
    const allProjects = context.get('all_projects') || []
    if (allProjects.length > shownProjects.length) {
      suggestions.push('[suggest:Show me another project]Show another project[/suggest]')
    }
  }
  
  return suggestions.slice(0, 3)
}

function generateFallbackMessage(plan: ExecutionPlan, data: Record<string, any>): string {
  switch (plan.selectedAction) {
    case 'showcase_all_projects':
      return "I'd love to show you my projects! Let me walk you through each one..."
    
    case 'showcase_single_project':
      const project = plan.metadata?.specific_projects?.[0]
      return `Let me show you ${project || 'this project'}...`
    
    case 'compare_projects':
      const items = plan.metadata?.comparison_items
      return `Let me compare ${items?.join(' and ') || 'these projects'} for you...`
    
    case 'explain_simple':
    case 'explain_detailed':
      return `Here's what you need to know about ${plan.analysis.entities.join(', ') || 'this'}...`
    
    default:
      return "Let me help you with that..."
  }
}