/**
 * Command Processor Utility
 * Handles command generation, validation, and injection for AI responses
 */

import { logger } from './logger'

export interface CommandSet {
  navigate?: string
  navigatePage?: string
  highlight?: string[]
  presentProjects?: boolean
  suggestions?: string[]
}

export interface ProcessedResponse {
  commands: CommandSet
  cleanedReply: string
  originalReply: string
  hasCommands: boolean
}

// Common query patterns and their corresponding commands
const COMMAND_TEMPLATES = {
  // Navigation patterns
  'show.*projects?|your work|what.*built': {
    commands: { presentProjects: true, navigate: 'case-studies' },
    priority: 1
  },
  'ventures?|startup': {
    commands: { navigatePage: '/content/ventures' },
    priority: 2
  },
  'experiments?': {
    commands: { navigate: 'experiments' },
    priority: 2
  },
  'blog|posts?|writing': {
    commands: { navigate: 'blog' },
    priority: 2
  },
  'about|who are you': {
    commands: { navigate: 'about' },
    priority: 2
  },
  
  // Project highlighting patterns
  'nural': {
    commands: { highlight: ['nural'] },
    priority: 1
  },
  'flock': {
    commands: { highlight: ['flock'] },
    priority: 1
  },
  'findu': {
    commands: { highlight: ['findu-highschool', 'findu-college'] },
    priority: 1
  },
  
  // Section highlighting patterns
  'technical.*implementation|how.*built': {
    commands: { highlight: ['section-technical-implementation'] },
    priority: 2
  },
  'results?|impact|outcome': {
    commands: { highlight: ['section-results-impact'] },
    priority: 2
  },
  'challenge|problem': {
    commands: { highlight: ['section-the-challenge'] },
    priority: 2
  }
}

export class CommandProcessor {
  /**
   * Extract commands from AI response text
   */
  extractCommands(response: string): CommandSet {
    const commands: CommandSet = {}
    
    // Extract NAVIGATE_PAGE commands
    const pageNavMatch = response.match(/NAVIGATE_PAGE:([/\w-]+)/i)
    if (pageNavMatch) {
      commands.navigatePage = pageNavMatch[1]
    }
    
    // Extract NAVIGATE commands
    const navMatch = response.match(/NAVIGATE:(\w+(?:-\w+)*)/i)
    if (navMatch) {
      commands.navigate = navMatch[1]
    }
    
    // Extract PRESENT_PROJECTS command
    if (response.includes('PRESENT_PROJECTS')) {
      commands.presentProjects = true
    }
    
    // Extract HIGHLIGHT commands (can be multiple)
    const highlightMatches = response.matchAll(/HIGHLIGHT:(\w+(?:-\w+)*)/gi)
    const highlights = Array.from(highlightMatches).map(match => match[1])
    if (highlights.length > 0) {
      commands.highlight = highlights
    }
    
    // Extract suggestions
    const suggestionMatches = response.matchAll(/\[SUGGEST:(.*?)\](.*?)\[\/SUGGEST\]/g)
    const suggestions = Array.from(suggestionMatches).map(match => match[0])
    if (suggestions.length > 0) {
      commands.suggestions = suggestions
    }
    
    return commands
  }
  
  /**
   * Clean commands from response text
   */
  cleanResponse(response: string): string {
    let cleaned = response
      .replace(/NAVIGATE_PAGE:[/\w-]+\s*/gi, '')
      .replace(/NAVIGATE:\w+(?:-\w+)*\s*/gi, '')
      .replace(/PRESENT_PROJECTS\s*/gi, '')
      .replace(/HIGHLIGHT:\w+(?:-\w+)*\s*/gi, '')
      .trim()
    
    // If cleaning removed everything, it means the AI only sent commands without text
    // In this case, return a default message
    if (!cleaned || cleaned.length < 10) {
      if (response.includes('PRESENT_PROJECTS')) {
        cleaned = "I'd love to show you my projects! Let me walk you through each one..."
      } else if (response.includes('HIGHLIGHT:')) {
        cleaned = "Let me highlight that for you!"
      } else if (response.includes('NAVIGATE')) {
        cleaned = "Navigating now..."
      }
    }
    
    return cleaned
  }
  
  /**
   * Detect intent from query and generate appropriate commands
   */
  detectIntentAndGenerateCommands(query: string): CommandSet {
    const lowerQuery = query.toLowerCase()
    const detectedCommands: CommandSet = {}
    let highestPriority = 0
    
    // Check against all templates
    for (const [pattern, config] of Object.entries(COMMAND_TEMPLATES)) {
      const regex = new RegExp(pattern, 'i')
      if (regex.test(lowerQuery)) {
        if (config.priority >= highestPriority) {
          Object.assign(detectedCommands, config.commands)
          highestPriority = config.priority
        }
      }
    }
    
    logger.debug('COMMAND-PROCESSOR', `Detected commands from query: ${JSON.stringify(detectedCommands)}`)
    return detectedCommands
  }
  
  /**
   * Validate if response has necessary commands based on query
   */
  validateCommands(query: string, commands: CommandSet): boolean {
    const lowerQuery = query.toLowerCase()
    
    // Check if navigation is expected
    if (lowerQuery.includes('show') || lowerQuery.includes('navigate') || lowerQuery.includes('go to')) {
      if (!commands.navigate && !commands.navigatePage && !commands.presentProjects) {
        logger.warn('COMMAND-PROCESSOR', 'Expected navigation command not found')
        return false
      }
    }
    
    // Check if highlighting is expected
    if (lowerQuery.includes('highlight') || lowerQuery.includes('tell me about') || 
        lowerQuery.includes('nural') || lowerQuery.includes('flock') || lowerQuery.includes('findu')) {
      if (!commands.highlight || commands.highlight.length === 0) {
        logger.warn('COMMAND-PROCESSOR', 'Expected highlight command not found')
        return false
      }
    }
    
    return true
  }
  
  /**
   * Inject missing commands based on response content
   */
  injectMissingCommands(response: string, existingCommands: CommandSet): CommandSet {
    const commands = { ...existingCommands }
    const lowerResponse = response.toLowerCase()
    
    // Inject highlight commands based on project mentions
    if (!commands.highlight) {
      const highlights: string[] = []
      
      if (lowerResponse.includes('nural')) highlights.push('nural')
      if (lowerResponse.includes('flock')) highlights.push('flock')
      if (lowerResponse.includes('findu')) {
        highlights.push('findu-highschool', 'findu-college')
      }
      
      if (highlights.length > 0) {
        commands.highlight = highlights
        logger.info('COMMAND-PROCESSOR', `Injected highlight commands: ${highlights.join(', ')}`)
      }
    }
    
    // Inject navigation based on content
    if (!commands.navigate && !commands.navigatePage) {
      if (lowerResponse.includes('show you my projects') || 
          lowerResponse.includes('walk you through') ||
          lowerResponse.includes('let me show you')) {
        commands.presentProjects = true
        commands.navigate = 'case-studies'
        logger.info('COMMAND-PROCESSOR', 'Injected project presentation commands')
      }
    }
    
    return commands
  }
  
  /**
   * Process AI response and ensure it has proper commands
   */
  processResponse(query: string, aiResponse: string): ProcessedResponse {
    logger.debug('COMMAND-PROCESSOR', 'Processing AI response')
    
    // Step 1: Extract existing commands
    let commands = this.extractCommands(aiResponse)
    
    // Step 2: If no commands found, try to detect from query
    if (Object.keys(commands).length === 0) {
      logger.warn('COMMAND-PROCESSOR', 'No commands found in AI response, detecting from query')
      commands = this.detectIntentAndGenerateCommands(query)
    }
    
    // Step 3: Validate and inject missing commands
    if (!this.validateCommands(query, commands)) {
      commands = this.injectMissingCommands(aiResponse, commands)
    }
    
    // Step 4: Clean the response
    const cleanedReply = this.cleanResponse(aiResponse)
    
    // Step 5: Log results
    const hasCommands = Object.keys(commands).length > 0
    logger.info('COMMAND-PROCESSOR', `Processed response - Has commands: ${hasCommands}`, commands)
    
    return {
      commands,
      cleanedReply,
      originalReply: aiResponse,
      hasCommands
    }
  }
  
  /**
   * Format commands for insertion into response
   */
  formatCommandsForResponse(commands: CommandSet): string {
    const parts: string[] = []
    
    if (commands.presentProjects) {
      parts.push('PRESENT_PROJECTS')
    }
    
    if (commands.navigate) {
      parts.push(`NAVIGATE:${commands.navigate}`)
    }
    
    if (commands.navigatePage) {
      parts.push(`NAVIGATE_PAGE:${commands.navigatePage}`)
    }
    
    if (commands.highlight && commands.highlight.length > 0) {
      commands.highlight.forEach(h => parts.push(`HIGHLIGHT:${h}`))
    }
    
    return parts.join(' ')
  }
  
  /**
   * Generate a stronger prompt for retry
   */
  generateStrongerPrompt(originalQuery: string): string {
    return `CRITICAL: You MUST include navigation or highlight commands in your response.
    
For the query "${originalQuery}", you MUST:
1. Start with appropriate commands (NAVIGATE:, HIGHLIGHT:, or PRESENT_PROJECTS)
2. Then provide your explanation

Example format:
HIGHLIGHT:nural Let me show you Nural...
or
NAVIGATE:case-studies PRESENT_PROJECTS I'll show you my projects...

Now respond to: ${originalQuery}`
  }
}

// Export singleton instance
export const commandProcessor = new CommandProcessor()