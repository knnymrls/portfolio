import { analyzeQuery, needsPlanning } from './query-analyzer'
import { createExecutionPlan, getPlanSummary } from './execution-planner'
import { actionExecutor } from './action-executor'
import { composeResponse, ComposedResponse } from './response-composer'
import { conversationMemory } from '../conversation-memory'

export interface OrchestratorResponse {
  response: ComposedResponse
  plan?: {
    id: string
    summary: string
    estimatedDuration: number
  }
  debug?: {
    analysis: any
    plan: any
    executionResults: any
  }
}

export class AIOrchestrator {
  private debugMode: boolean = false

  constructor(options?: { debug?: boolean }) {
    this.debugMode = options?.debug || false
  }

  async processQuery(
    query: string,
    options?: {
      onProgress?: (message: string, progress: number) => void
      includeDebug?: boolean
    }
  ): Promise<OrchestratorResponse> {
    try {
      // Step 1: Analyze the query
      if (options?.onProgress) {
        options.onProgress('Analyzing your question...', 0.2)
      }
      const analysis = await analyzeQuery(query)
      
      // Update conversation memory
      conversationMemory.updateFromQuery(query)

      // Step 2: Create execution plan
      if (options?.onProgress) {
        options.onProgress('Planning response...', 0.4)
      }
      const plan = await createExecutionPlan(query, analysis)

      // Step 3: Execute the plan
      if (options?.onProgress) {
        options.onProgress('Gathering information...', 0.6)
      }
      const executionResult = await actionExecutor.execute(
        plan,
        (step, progress) => {
          if (options?.onProgress && step.description) {
            options.onProgress(step.description, 0.6 + progress * 0.3)
          }
        }
      )

      // Step 4: Compose the response
      if (options?.onProgress) {
        options.onProgress('Preparing response...', 0.9)
      }
      const response = await composeResponse(
        plan,
        executionResult.results,
        executionResult.context
      )

      // Update memory with response
      conversationMemory.updateFromResponse(
        response.message,
        plan.selectedAction,
        response.commands.highlight
      )

      // Build result
      const result: OrchestratorResponse = {
        response,
        plan: {
          id: plan.id,
          summary: getPlanSummary(plan),
          estimatedDuration: plan.estimatedDuration
        }
      }

      // Add debug info if requested
      if (this.debugMode || options?.includeDebug) {
        result.debug = {
          analysis,
          plan,
          executionResults: executionResult.results
        }
      }

      if (options?.onProgress) {
        options.onProgress('Complete!', 1.0)
      }

      return result
    } catch (error) {
      console.error('Orchestrator error:', error)
      
      // Fallback response
      return {
        response: {
          message: "I apologize, but I encountered an issue processing your request. Could you please try rephrasing your question?",
          commands: {},
          suggestions: [
            '[suggest:Show me your projects]Show me projects[/suggest]',
            '[suggest:Tell me about yourself]About you?[/suggest]',
            '[suggest:What do you do?]What do you do?[/suggest]'
          ]
        }
      }
    }
  }

  // Quick response for simple queries
  async quickResponse(query: string): Promise<string> {
    const analysis = await analyzeQuery(query)
    
    if (!needsPlanning(analysis)) {
      // Simple response without full orchestration
      switch (analysis.intent) {
        case 'greeting':
          return "Hi! I'm Kenny's portfolio assistant. How can I help you explore my work?"
        
        case 'navigate':
          if (analysis.entities.includes('projects')) {
            return "I'll show you my projects right away!"
          }
          return `Navigating to ${analysis.entities.join(', ')}...`
        
        default:
          return `Let me help you with ${analysis.entities.join(', ')}...`
      }
    }
    
    // Needs full orchestration
    const result = await this.processQuery(query)
    return result.response.message
  }

  // Get suggested actions for current context
  async getSuggestions(): Promise<string[]> {
    const context = conversationMemory.getContext()
    
    if (context.questionsAsked.length === 0) {
      // Initial suggestions
      return [
        'Show me your projects',
        'What do you do?',
        'Tell me about yourself'
      ]
    }
    
    // Context-based suggestions
    return conversationMemory.generateSmartSuggestions()
  }

  // Reset conversation
  reset() {
    conversationMemory.reset()
  }
}

// Export singleton instance
export const aiOrchestrator = new AIOrchestrator({ debug: process.env.NODE_ENV === 'development' })

// Export all sub-modules for direct access if needed
export { analyzeQuery } from './query-analyzer'
export { createExecutionPlan } from './execution-planner'
export { actionExecutor } from './action-executor'
export { composeResponse } from './response-composer'
export type { QueryAnalysis } from './query-analyzer'
export type { ExecutionPlan } from './execution-planner'
export type { ComposedResponse } from './response-composer'