export interface ConversationContext {
  topics: Set<string>
  mentionedProjects: Set<string>
  userInterests: Set<string>
  lastAction: string | null
  questionsAsked: string[]
  currentDepth: number // How deep into a topic we are
}

export class ConversationMemory {
  private context: ConversationContext = {
    topics: new Set(),
    mentionedProjects: new Set(),
    userInterests: new Set(),
    lastAction: null,
    questionsAsked: [],
    currentDepth: 0
  }

  updateFromQuery(query: string) {
    const queryLower = query.toLowerCase()
    
    // Track projects mentioned
    if (queryLower.includes('nural')) this.context.mentionedProjects.add('nural')
    if (queryLower.includes('flock')) this.context.mentionedProjects.add('flock')
    if (queryLower.includes('findu')) this.context.mentionedProjects.add('findu')
    
    // Track topics
    if (queryLower.includes('design')) this.context.topics.add('design')
    if (queryLower.includes('tech') || queryLower.includes('stack')) this.context.topics.add('technical')
    if (queryLower.includes('challenge') || queryLower.includes('problem')) this.context.topics.add('challenges')
    if (queryLower.includes('ai') || queryLower.includes('machine learning')) this.context.topics.add('ai')
    if (queryLower.includes('venture')) this.context.topics.add('ventures')
    
    // Track user interests based on questions
    if (queryLower.includes('how')) this.context.userInterests.add('implementation')
    if (queryLower.includes('why')) this.context.userInterests.add('reasoning')
    if (queryLower.includes('what')) this.context.userInterests.add('details')
    
    // Track question depth
    if (this.context.questionsAsked.includes(query)) {
      this.context.currentDepth = 0
    } else {
      this.context.currentDepth++
    }
    
    this.context.questionsAsked.push(query)
    if (this.context.questionsAsked.length > 10) {
      this.context.questionsAsked.shift()
    }
  }

  updateFromResponse(response: string, action?: string, highlightedProject?: string) {
    const responseLower = response.toLowerCase()
    
    // Track what was shown/discussed
    if (action) {
      this.context.lastAction = action
    }
    
    // Track highlighted project specifically
    if (highlightedProject) {
      this.context.mentionedProjects.add(highlightedProject)
    }
    
    // Update mentioned projects from response
    if (responseLower.includes('nural')) this.context.mentionedProjects.add('nural')
    if (responseLower.includes('flock')) this.context.mentionedProjects.add('flock')
    if (responseLower.includes('findu')) this.context.mentionedProjects.add('findu')
  }
  
  // Get next project to show that hasn't been shown yet
  getNextProject(): string | null {
    const allProjects = ['nural', 'flock', 'findu-college', 'findu-highschool']
    const unshownProjects = allProjects.filter(p => !this.context.mentionedProjects.has(p))
    return unshownProjects.length > 0 ? unshownProjects[0] : null
  }

  generateSmartSuggestions(): string[] {
    const suggestions: string[] = []
    const { topics, mentionedProjects, userInterests, lastAction, questionsAsked, currentDepth } = this.context
    
    // If this is the start of conversation (no questions asked or just greeting)
    if (questionsAsked.length <= 1 && lastAction === null) {
      suggestions.push('[suggest:Show me your projects]Show me your projects[/suggest]')
      suggestions.push('[suggest:What do you do?]What do you do?[/suggest]')
      suggestions.push('[suggest:What are you currently working on?]Current work?[/suggest]')
      return suggestions
    }
    
    // If projects were just shown, ask about specific ones
    if (lastAction === 'show_projects' || lastAction === 'highlight_projects') {
      // Always provide these key follow-ups after showing projects
      suggestions.push('[suggest:Which project are you most proud of and why?]Which are you most proud of?[/suggest]')
      suggestions.push('[suggest:What was the most technically challenging project?]Most challenging project?[/suggest]')
      suggestions.push('[suggest:Tell me about the impact of these projects]What impact did they have?[/suggest]')
      return suggestions
    }
    
    // If a specific project was mentioned, dive deeper
    if (mentionedProjects.size === 1) {
      const project = Array.from(mentionedProjects)[0]
      
      if (currentDepth < 2) {
        // Surface level questions
        if (project === 'nural' && !questionsAsked.some(q => q.includes('real-time'))) {
          suggestions.push('[suggest:How did you handle real-time stock data updates?]Real-time data handling?[/suggest]')
        }
        if (project === 'flock' && !questionsAsked.some(q => q.includes('algorithm'))) {
          suggestions.push('[suggest:How does the scheduling algorithm work?]Scheduling algorithm?[/suggest]')
        }
        if (project === 'findu' && !questionsAsked.some(q => q.includes('user'))) {
          suggestions.push('[suggest:How many users did FindU have?]User traction?[/suggest]')
        }
      } else {
        // Deeper questions
        suggestions.push(`[suggest:What would you do differently if rebuilding ${project} today?]What would you change?[/suggest]`)
        suggestions.push(`[suggest:What did you learn from building ${project}?]Key learnings?[/suggest]`)
      }
      
      // Offer to see specific other projects
      if (!mentionedProjects.has('nural')) {
        suggestions.push('[suggest:Tell me about Nural]Show me Nural[/suggest]')
      } else if (!mentionedProjects.has('flock')) {
        suggestions.push('[suggest:Tell me about Flock]Show me Flock[/suggest]')
      } else if (!mentionedProjects.has('findu')) {
        suggestions.push('[suggest:Tell me about FindU]Show me FindU[/suggest]')
      }
    }
    
    // Topic-based suggestions
    if (topics.has('technical') && !topics.has('challenges')) {
      suggestions.push('[suggest:What technical challenges did you overcome?]Technical challenges?[/suggest]')
    }
    
    if (topics.has('design') && !userInterests.has('implementation')) {
      suggestions.push('[suggest:How do you approach UI/UX design?]UI/UX approach?[/suggest]')
    }
    
    if (topics.has('ai') && currentDepth < 2) {
      suggestions.push('[suggest:How are you using AI in your projects?]AI implementation?[/suggest]')
    }
    
    // Fallback suggestions - always include basics if nothing specific
    if (suggestions.length === 0) {
      // Haven't seen projects yet
      if (mentionedProjects.size === 0 && !questionsAsked.some(q => q.toLowerCase().includes('project'))) {
        suggestions.push('[suggest:Show me your projects]Show me your projects[/suggest]')
      }
      // Haven't asked about current work
      if (!topics.has('ventures')) {
        suggestions.push('[suggest:What are you currently building?]Current projects?[/suggest]')
      }
      // Haven't asked about contact
      if (!questionsAsked.some(q => q.includes('contact'))) {
        suggestions.push('[suggest:How can I work with you?]Work together?[/suggest]')
      }
      // Generic exploration
      if (suggestions.length === 0) {
        suggestions.push('[suggest:Tell me about your experience]Your experience?[/suggest]')
        suggestions.push('[suggest:What technologies do you use?]Tech stack?[/suggest]')
      }
    }
    
    return suggestions.slice(0, 3)
  }

  reset() {
    this.context = {
      topics: new Set(),
      mentionedProjects: new Set(),
      userInterests: new Set(),
      lastAction: null,
      questionsAsked: [],
      currentDepth: 0
    }
  }

  getContext() {
    return this.context
  }
}

export const conversationMemory = new ConversationMemory()