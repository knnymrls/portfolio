import OpenAI from 'openai'

export interface QueryAnalysis {
  intent: 'navigate' | 'explain' | 'compare' | 'showcase' | 'research' | 'action' | 'greeting'
  complexity: 'simple' | 'complex' | 'multi-step'
  entities: string[]
  aspects?: string[] // technical, business, design, etc.
  confidence: number
  requiresContext: boolean
  estimatedDuration: number // in seconds
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a query analyzer for a portfolio website. Analyze the user's query and return a JSON object with the following structure:

{
  "intent": "navigate|explain|compare|showcase|research|action|greeting",
  "complexity": "simple|complex|multi-step",
  "entities": ["project names", "topics", "technologies"],
  "aspects": ["technical", "business", "design", "impact"],
  "confidence": 0.0-1.0,
  "requiresContext": true/false,
  "estimatedDuration": seconds
}

Intent types:
- navigate: User wants to go somewhere or see something specific
- explain: User wants detailed information about something
- compare: User wants to compare multiple things
- showcase: User wants a presentation or demo
- research: User is exploring or learning
- action: User wants to do something (contact, download, etc.)
- greeting: Simple greeting or small talk

Complexity:
- simple: Single step, direct answer (< 2 seconds)
- complex: Multiple retrieval or analysis needed (2-5 seconds)
- multi-step: Sequential actions with UI updates (5+ seconds)

Examples:
"Show me your projects" → showcase, multi-step, ["projects"], 20 seconds
"What's Nural?" → explain, simple, ["nural"], 2 seconds
"Compare Flock and Nural technically" → compare, complex, ["flock", "nural"], ["technical"], 5 seconds
"How can I contact you?" → action, simple, ["contact"], 1 second
"Hello" → greeting, simple, [], 1 second`
        },
        {
          role: 'user',
          content: query
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Low temperature for consistency
      max_tokens: 200
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    
    // Validate and provide defaults
    return {
      intent: result.intent || 'explain',
      complexity: result.complexity || 'simple',
      entities: result.entities || [],
      aspects: result.aspects,
      confidence: result.confidence || 0.8,
      requiresContext: result.requiresContext !== false,
      estimatedDuration: result.estimatedDuration || 2
    }
  } catch (error) {
    console.error('Query analysis failed:', error)
    
    // Fallback analysis based on keywords
    return fallbackAnalysis(query)
  }
}

// Fallback analysis without AI
function fallbackAnalysis(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase()
  
  // Detect intent from keywords
  let intent: QueryAnalysis['intent'] = 'explain'
  let complexity: QueryAnalysis['complexity'] = 'simple'
  let estimatedDuration = 2
  
  if (lowerQuery.includes('show') || lowerQuery.includes('see')) {
    intent = 'showcase'
    complexity = 'multi-step'
    estimatedDuration = 20
  } else if (lowerQuery.includes('compare') || lowerQuery.includes('difference')) {
    intent = 'compare'
    complexity = 'complex'
    estimatedDuration = 5
  } else if (lowerQuery.includes('go to') || lowerQuery.includes('navigate')) {
    intent = 'navigate'
    complexity = 'simple'
    estimatedDuration = 1
  } else if (lowerQuery.includes('contact') || lowerQuery.includes('email')) {
    intent = 'action'
    complexity = 'simple'
    estimatedDuration = 1
  } else if (lowerQuery.includes('hi') || lowerQuery.includes('hello')) {
    intent = 'greeting'
    complexity = 'simple'
    estimatedDuration = 1
  }
  
  // Extract entities
  const entities: string[] = []
  if (lowerQuery.includes('nural')) entities.push('nural')
  if (lowerQuery.includes('flock')) entities.push('flock')
  if (lowerQuery.includes('findu')) entities.push('findu')
  if (lowerQuery.includes('project')) entities.push('projects')
  
  return {
    intent,
    complexity,
    entities,
    confidence: 0.6,
    requiresContext: intent !== 'greeting',
    estimatedDuration
  }
}

// Helper to determine if query needs immediate response
export function needsImmediateResponse(analysis: QueryAnalysis): boolean {
  return analysis.complexity === 'simple' && analysis.estimatedDuration <= 2
}

// Helper to determine if query needs planning
export function needsPlanning(analysis: QueryAnalysis): boolean {
  return analysis.complexity !== 'simple' || analysis.estimatedDuration > 2
}