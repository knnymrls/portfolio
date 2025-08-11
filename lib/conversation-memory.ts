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
    console.log(`📥 [MEMORY] Processing query: "${query}"`)
    const queryLower = query.toLowerCase()
    
    // Track projects mentioned
    const previousProjects = this.context.mentionedProjects.size
    if (queryLower.includes('nural')) this.context.mentionedProjects.add('nural')
    if (queryLower.includes('flock')) this.context.mentionedProjects.add('flock')
    if (queryLower.includes('findu')) this.context.mentionedProjects.add('findu')
    
    if (this.context.mentionedProjects.size > previousProjects) {
      console.log(`📦 [MEMORY] New projects mentioned:`, Array.from(this.context.mentionedProjects))
    }
    
    // Track topics
    const previousTopics = this.context.topics.size
    if (queryLower.includes('design')) this.context.topics.add('design')
    if (queryLower.includes('tech') || queryLower.includes('stack')) this.context.topics.add('technical')
    if (queryLower.includes('challenge') || queryLower.includes('problem')) this.context.topics.add('challenges')
    if (queryLower.includes('ai') || queryLower.includes('machine learning')) this.context.topics.add('ai')
    if (queryLower.includes('venture')) this.context.topics.add('ventures')
    
    if (this.context.topics.size > previousTopics) {
      console.log(`🏷️ [MEMORY] New topics detected:`, Array.from(this.context.topics))
    }
    
    // Track user interests based on questions
    const previousInterests = this.context.userInterests.size
    if (queryLower.includes('how')) this.context.userInterests.add('implementation')
    if (queryLower.includes('why')) this.context.userInterests.add('reasoning')
    if (queryLower.includes('what')) this.context.userInterests.add('details')
    
    if (this.context.userInterests.size > previousInterests) {
      console.log(`💡 [MEMORY] User interests updated:`, Array.from(this.context.userInterests))
    }
    
    // Track question depth
    if (this.context.questionsAsked.includes(query)) {
      this.context.currentDepth = 0
      console.log('🔁 [MEMORY] Repeated question detected, resetting depth')
    } else {
      this.context.currentDepth++
      console.log(`📈 [MEMORY] Conversation depth: ${this.context.currentDepth}`)
    }
    
    this.context.questionsAsked.push(query)
    if (this.context.questionsAsked.length > 10) {
      this.context.questionsAsked.shift()
    }
    
    console.log(`📊 [MEMORY] Questions history: ${this.context.questionsAsked.length} items`)
  }

  updateFromResponse(response: string, action?: string, highlightedProject?: string) {
    console.log(`📤 [MEMORY] Processing response with action: ${action || 'none'}`)
    const responseLower = response.toLowerCase()
    
    // Track what was shown/discussed
    if (action) {
      this.context.lastAction = action
      console.log(`🎬 [MEMORY] Last action updated: ${action}`)
    }
    
    // Track highlighted project specifically
    if (highlightedProject) {
      this.context.mentionedProjects.add(highlightedProject)
      console.log(`🔆 [MEMORY] Highlighted project tracked: ${highlightedProject}`)
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
    
    const nextProject = unshownProjects.length > 0 ? unshownProjects[0] : null
    console.log(`🎯 [MEMORY] Next project to show: ${nextProject || 'none (all shown)'}`)
    console.log(`📉 [MEMORY] Projects shown: ${this.context.mentionedProjects.size}/${allProjects.length}`)
    
    return nextProject
  }

  generateSmartSuggestions(): string[] {
    console.log('🤔 [MEMORY] Generating smart suggestions based on context')
    const suggestions: string[] = []
    const { topics, mentionedProjects, userInterests, lastAction, questionsAsked, currentDepth } = this.context
    
    console.log('📊 [MEMORY] Context for suggestions:', {
      topics: Array.from(topics),
      mentionedProjects: Array.from(mentionedProjects),
      lastAction,
      depth: currentDepth
    })
    
    // If this is the start of conversation (no questions asked or just greeting)
    if (questionsAsked.length <= 1 && lastAction === null) {
      suggestions.push('[suggest:Show me your projects]Show me your projects[/suggest]')
      suggestions.push('[suggest:Show me FindU]Show FindU[/suggest]')
      suggestions.push('[suggest:Show me Nural]Show Nural[/suggest]')
      const finalSuggestions = suggestions.slice(0, 3)
      console.log(`💡 [MEMORY] Generated ${finalSuggestions.length} suggestions`)
      return finalSuggestions
    }
    
    // If projects were just shown, suggest exploring specific ones
    if (lastAction === 'show_projects') {
      // Suggest diving into specific projects
      suggestions.push('[suggest:Tell me more about FindU]Tell me about FindU[/suggest]')
      suggestions.push('[suggest:Show me Nural in detail]Show Nural details[/suggest]')
      suggestions.push('[suggest:Read the FindU case study]Read FindU case study[/suggest]')
      const finalSuggestions = suggestions.slice(0, 3)
      console.log(`💡 [MEMORY] Generated ${finalSuggestions.length} suggestions`)
      return finalSuggestions
    }
    
    // If a single project was highlighted, suggest related actions
    if (lastAction === 'highlight_projects') {
      const allProjects = ['nural', 'flock', 'findu-highschool', 'findu-college']
      const unshownProjects = allProjects.filter(p => !mentionedProjects.has(p))
      
      if (unshownProjects.length > 0) {
        suggestions.push(`[suggest:Show me ${unshownProjects[0]}]Show ${unshownProjects[0]}[/suggest]`)
      }
      suggestions.push('[suggest:Show all projects]Show all projects[/suggest]')
      suggestions.push('[suggest:Show me your ventures]Show ventures[/suggest]')
      const finalSuggestions = suggestions.slice(0, 3)
      console.log(`💡 [MEMORY] Generated ${finalSuggestions.length} suggestions`)
      return finalSuggestions
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
    
    // Fallback suggestions - always include navigation options
    if (suggestions.length === 0) {
      // Haven't seen specific projects yet - suggest them
      if (!mentionedProjects.has('findu-highschool')) {
        suggestions.push('[suggest:Show me FindU]Show FindU[/suggest]')
      } else if (!mentionedProjects.has('nural')) {
        suggestions.push('[suggest:Show me Nural]Show Nural[/suggest]')
      } else if (!mentionedProjects.has('flock')) {
        suggestions.push('[suggest:Show me Flock]Show Flock[/suggest]')
      }
      
      // Haven't seen all projects
      if (mentionedProjects.size === 0 && !questionsAsked.some(q => q.toLowerCase().includes('project'))) {
        suggestions.push('[suggest:Show me your projects]Show all projects[/suggest]')
      }
      
      // Haven't asked about ventures
      if (!topics.has('ventures')) {
        suggestions.push('[suggest:Show me your ventures]Show ventures[/suggest]')
      }
      
      // Haven't read case studies
      if (!questionsAsked.some(q => q.includes('case study'))) {
        suggestions.push('[suggest:Read the FindU case study]FindU case study[/suggest]')
      }
      
      // Generic navigation options
      if (suggestions.length === 0) {
        suggestions.push('[suggest:Show me your latest work]Latest work[/suggest]')
        suggestions.push('[suggest:Navigate to experiments]Show experiments[/suggest]')
        suggestions.push('[suggest:Show me the blog]Read blog[/suggest]')
      }
    }
    
    const finalSuggestions = suggestions.slice(0, 3)
    console.log(`💡 [MEMORY] Generated ${finalSuggestions.length} suggestions`)
    return finalSuggestions
  }

  reset() {
    console.log('🔄 [MEMORY] Resetting conversation memory')
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