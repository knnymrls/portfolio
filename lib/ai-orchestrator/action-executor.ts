import { ExecutionPlan } from './execution-planner'
import { ActionStep } from './action-registry'
import { searchContent } from '../semantic-search'
import { highlightManager } from '../highlight-manager'
import { conversationMemory } from '../conversation-memory'
import { getMDXByCategory, getMDXBySlug } from '../mdx-loader'

export interface ExecutionResult {
  success: boolean
  data: any
  error?: string
}

export interface StepResult {
  step: ActionStep
  result: ExecutionResult
  timestamp: number
}

export class ActionExecutor {
  private currentPlan: ExecutionPlan | null = null
  private results: StepResult[] = []
  private context: Map<string, any> = new Map()

  async execute(plan: ExecutionPlan, onProgress?: (step: ActionStep, progress: number) => void): Promise<{
    results: StepResult[]
    context: Map<string, any>
    success: boolean
  }> {
    this.currentPlan = plan
    this.results = []
    this.context = new Map()

    // Pre-load required context
    await this.loadContext(plan.contextRequired)

    // Execute each step
    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i]
      
      // Report progress
      if (onProgress) {
        onProgress(step, (i + 1) / plan.steps.length)
      }

      // Execute step
      const result = await this.executeStep(step)
      
      this.results.push({
        step,
        result,
        timestamp: Date.now()
      })

      // Stop on failure unless it's optional
      if (!result.success && !step.options?.optional) {
        console.error(`Step failed: ${step.type}`, result.error)
        break
      }
    }

    const success = this.results.every(r => r.result.success || r.step.options?.optional)

    return {
      results: this.results,
      context: this.context,
      success
    }
  }

  private async loadContext(contextRequired: string[]): Promise<void> {
    for (const contextKey of contextRequired) {
      const data = await this.fetchContext(contextKey)
      if (data) {
        this.context.set(contextKey, data)
      }
    }
  }

  private async fetchContext(contextKey: string): Promise<any> {
    switch (contextKey) {
      case 'all_projects':
        return this.getAllProjects()
      
      case 'project_stats':
        return this.getProjectStats()
      
      case 'project_descriptions':
        return this.getProjectDescriptions()
      
      case 'tech_stacks':
        return this.getTechStacks()
      
      case 'contact_details':
        return {
          email: 'kenny@example.com',
          github: 'github.com/kenny',
          linkedin: 'linkedin.com/in/kenny'
        }
      
      default:
        // Try semantic search for other context
        const results = await searchContent(contextKey, { limit: 3 })
        return results.map(r => r.content)
    }
  }

  private async executeStep(step: ActionStep): Promise<ExecutionResult> {
    try {
      switch (step.type) {
        case 'retrieve':
          return await this.executeRetrieve(step)
        
        case 'navigate':
          return await this.executeNavigate(step)
        
        case 'highlight':
          return await this.executeHighlight(step)
        
        case 'wait':
          return await this.executeWait(step)
        
        case 'generate':
          return await this.executeGenerate(step)
        
        case 'analyze':
          return await this.executeAnalyze(step)
        
        case 'present':
          return await this.executePresent(step)
        
        default:
          return { success: false, data: null, error: `Unknown step type: ${step.type}` }
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  private async executeRetrieve(step: ActionStep): Promise<ExecutionResult> {
    const targets = Array.isArray(step.target) ? step.target : [step.target || '']
    const retrieved: Record<string, any> = {}

    for (const target of targets) {
      const data = await this.fetchContext(target)
      retrieved[target] = data
      this.context.set(target, data)
    }

    return { success: true, data: retrieved }
  }

  private async executeNavigate(step: ActionStep): Promise<ExecutionResult> {
    // This will be handled by the ChatProvider
    return { 
      success: true, 
      data: { 
        navigateTo: step.target,
        type: step.target?.includes('/') ? 'page' : 'section'
      }
    }
  }

  private async executeHighlight(step: ActionStep): Promise<ExecutionResult> {
    const target = step.target
    const duration = step.duration || 5000

    if (target === 'alternating' && step.options?.items) {
      // Alternating highlights for comparison
      for (const item of step.options.items) {
        await highlightManager.highlight(item, {
          style: 'simple',
          duration: duration / step.options.items.length,
          dimOthers: true
        })
        await new Promise(resolve => setTimeout(resolve, duration / step.options.items.length))
      }
    } else if (target) {
      // Single highlight
      await highlightManager.highlight(target as string, {
        style: 'simple',
        duration,
        dimOthers: true
      })
    }

    return { success: true, data: { highlighted: target, duration } }
  }

  private async executeWait(step: ActionStep): Promise<ExecutionResult> {
    const duration = step.duration || 1000
    await new Promise(resolve => setTimeout(resolve, duration))
    return { success: true, data: { waited: duration } }
  }

  private async executeGenerate(step: ActionStep): Promise<ExecutionResult> {
    // This will be handled by the response composer
    return { 
      success: true, 
      data: { 
        generateType: step.target,
        context: Array.from(this.context.keys())
      }
    }
  }

  private async executeAnalyze(step: ActionStep): Promise<ExecutionResult> {
    const analysisType = step.target
    let analysis: any = {}

    switch (analysisType) {
      case 'similarities_differences':
        const items = this.context.get('multiple_projects') || []
        analysis = this.analyzeSimilaritiesDifferences(items)
        break
      
      case 'architecture':
        analysis = this.analyzeArchitecture()
        break
      
      case 'topic_usage':
        analysis = this.analyzeTopicUsage()
        break
      
      default:
        analysis = { type: analysisType, status: 'pending' }
    }

    this.context.set(`analysis_${analysisType}`, analysis)
    return { success: true, data: analysis }
  }

  private async executePresent(step: ActionStep): Promise<ExecutionResult> {
    if (step.target === 'project_sequence') {
      // This will trigger the full project presentation
      return { 
        success: true, 
        data: { 
          presentationType: 'project_sequence',
          duration: step.duration,
          projects: this.context.get('all_projects')
        }
      }
    }

    return { success: true, data: { presented: step.target } }
  }

  // Helper methods for data fetching
  private async getAllProjects() {
    return [
      { id: 'nural', title: 'Nural', description: 'Chat-based learning platform for stock trading' },
      { id: 'flock', title: 'Flock', description: 'AI scheduling platform for teams' },
      { id: 'findu-college', title: 'FindU College', description: 'College matching platform' },
      { id: 'findu-highschool', title: 'FindU Highschool', description: 'Study partner matching for students' }
    ]
  }

  private async getProjectStats() {
    return {
      nural: { users: '10,000+', satisfaction: '94%' },
      flock: { teams: '500+', timesSaved: '2hrs/week' },
      'findu-college': { students: '15,000+', colleges: '2,000+' },
      'findu-highschool': { students: '5,000+', schools: '25' }
    }
  }

  private async getProjectDescriptions() {
    const caseStudies = await getMDXByCategory('case-studies')
    return caseStudies.reduce((acc, study) => {
      acc[study.slug] = study.description || study.content.substring(0, 200)
      return acc
    }, {} as Record<string, string>)
  }

  private async getTechStacks() {
    return {
      nural: ['React', 'Node.js', 'OpenAI', 'PostgreSQL'],
      flock: ['Next.js', 'TypeScript', 'Prisma', 'Vercel'],
      'findu-college': ['React Native', 'Firebase', 'ML Kit'],
      'findu-highschool': ['React', 'Node.js', 'WebRTC', 'Socket.io']
    }
  }

  private analyzeSimilaritiesDifferences(items: any[]) {
    return {
      similarities: ['All use React', 'AI-powered', 'Focus on user experience'],
      differences: ['Different target audiences', 'Varying tech stacks', 'Different problem domains']
    }
  }

  private analyzeArchitecture() {
    return {
      frontend: 'React/Next.js',
      backend: 'Node.js/Express',
      database: 'PostgreSQL/Firebase',
      deployment: 'Vercel/AWS'
    }
  }

  private analyzeTopicUsage() {
    return {
      ai_usage: ['Nural: NLP for chat', 'Flock: Scheduling algorithms', 'FindU: Matching algorithms'],
      common_patterns: ['User-centric design', 'Real-time features', 'Data-driven decisions']
    }
  }
}

export const actionExecutor = new ActionExecutor()