import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { navigationFunction } from '../../utils/navigation'
import { ChatResponse } from '../../types'
import { getAIContentSummary } from '../../../lib/content-registry'
import { searchContent, understandUserQuery, SearchResult } from '../../../lib/semantic-search'
import { conversationMemory } from '../../../lib/conversation-memory'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Update conversation memory with the query
    conversationMemory.updateFromQuery(message)
    
    // Check if user wants to see another project
    const nextProject = message.toLowerCase().includes('another project') || message.toLowerCase().includes('show another')
      ? conversationMemory.getNextProject()
      : null

    // Get dynamic content summary
    const contentSummary = await getAIContentSummary()
    
    // Perform semantic search to find relevant content
    const queryAnalysis = await understandUserQuery(message)
    const relevantContent = await searchContent(message, {
      filters: queryAnalysis.filters,
      limit: 5,
      threshold: 0.6
    })
    
    // Format relevant content for AI context with actual content
    const relevantContext = relevantContent.length > 0
      ? `\nRELEVANT CONTENT FOUND (by semantic similarity):
${relevantContent.map(r => {
  const content = r.content
  return `
### ${content.title} (${Math.round(r.similarity * 100)}% match)
Type: ${content.type}
${content.description ? `Description: ${content.description}` : ''}
${content.content ? `\nContent excerpt:\n${content.content.substring(0, 500)}...` : ''}
${content.metadata ? `\nKey details: ${JSON.stringify(content.metadata)}` : ''}
`}).join('\n')}

IMPORTANT: Use the actual content above to provide specific, accurate responses. Quote statistics, features, and details from the content when relevant.`
      : ''

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Kenny's portfolio AI assistant. You help visitors learn about Kenny's work, projects, ventures, and writings. Be friendly, professional, and concise.

CRITICAL INSTRUCTION: When discussing any project, venture, or content, you MUST use the specific details provided in the RELEVANT CONTENT section below. Do not make up generic descriptions. Use actual statistics, features, and facts from the content.

${contentSummary}
${relevantContext}

RESPONSE GUIDELINES:
- When asked about FindU: Mention it helped 5,000+ students across 25 schools, has 92% satisfaction, improved grades by 18%
- When asked about Nural: Describe it as a chat-based learning platform for stock trading with 10,000+ users
- When asked about Flock: Explain it's an AI scheduling platform that helps teams find meeting times
- Always use specific numbers, features, and details from the content provided
- If no relevant content is found, acknowledge that and provide what you know

NAVIGATION INSTRUCTIONS:
- For showing projects with highlighting: Use "PRESENT_PROJECTS NAVIGATE:case-studies" (stays on main page, highlights each project)
- For ventures list: Use "NAVIGATE_PAGE:/content/ventures" 
- For specific venture: Use "NAVIGATE_PAGE:/content/ventures/[slug]"
- For case study detail pages: Use "NAVIGATE_PAGE:/content/case-studies/[slug]"
- For blog posts: Use "NAVIGATE_PAGE:/content/blog/[slug]"
- For sections on main page: Use "NAVIGATE:case-studies", "NAVIGATE:experiments", "NAVIGATE:hero"
- For highlighting specific project: Use "HIGHLIGHT:[project-id]" (e.g., HIGHLIGHT:flock)

IMPORTANT: 
- When users ask to "see projects" or "show me your work", use "PRESENT_PROJECTS NAVIGATE:case-studies" to highlight them on the main page
- Only navigate to /content/case-studies page if they ask to see "all case studies" or "case study list"

CONTENT AWARENESS:
You have access to:
- Case Studies: FindU Highschool (AI education platform)
- Ventures: AI Writing Assistant (active development)
- Blog Posts: Building with AI in 2024
- Plus existing portfolio projects: Nural, Flock, FindU College

RESPONSE EXAMPLES:
- "Show me your projects" → "I'd love to show you my projects! PRESENT_PROJECTS NAVIGATE:case-studies Let me walk you through each one..."
- "What work have you done?" → "Here are my recent projects! PRESENT_PROJECTS NAVIGATE:case-studies I'll highlight each one for you..."
- "Tell me about Flock" or "Show me Flock" → "Let me highlight Flock for you! HIGHLIGHT:flock Flock is a real-time collaboration platform..."
- "Tell me about Nural" or "Show me Nural" → "Let me highlight Nural for you! HIGHLIGHT:nural Nural is an innovative chat-based learning platform..."
- "Tell me about FindU" → "Let me highlight FindU for you! HIGHLIGHT:findu-college FindU helps students find the perfect college..."
${nextProject ? `- "Show another project" → "Let me show you ${nextProject}! HIGHLIGHT:${nextProject} [Provide specific details about ${nextProject}]"` : ''}
- "What ventures are you working on?" → "I'm working on several ventures! NAVIGATE_PAGE:/content/ventures Let me show you what I'm building..."
- "Tell me about the AI Writing Assistant" → "The AI Writing Assistant is one of my active ventures. NAVIGATE_PAGE:/content/ventures/ai-writing-assistant It's an intelligent tool..."
- "Read the FindU case study" → "Let me show you the detailed FindU case study! NAVIGATE_PAGE:/content/case-studies/findu-highschool This comprehensive breakdown..."

Remember: Be specific about which content exists and guide users to the right place.`
        },
        ...conversationHistory.slice(-5), // Include last 5 messages for context
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const responseMessage = completion.choices[0]?.message
    let reply = responseMessage?.content || 'Sorry, I could not generate a response.'
    
    // Parse navigation keywords from response BEFORE modifying it
    let navigationAction: string | undefined = undefined
    let navigatePage: string | undefined = undefined
    let presentProjects = false
    let highlightProject: string | undefined = undefined
    let action = 'response' // Track what action was taken

    // Check for page navigation (new MDX pages)
    const pageNavMatch = reply.match(/NAVIGATE_PAGE:([/\w-]+)/i)
    if (pageNavMatch) {
      navigatePage = pageNavMatch[1]
      reply = reply.replace(/NAVIGATE_PAGE:[/\w-]+/gi, '').trim()
      action = 'navigate'
    }

    // Check for section navigation (existing sections)
    const navMatch = reply.match(/NAVIGATE:(\w+(?:-\w+)*)/i)
    if (navMatch) {
      navigationAction = navMatch[1]
      reply = reply.replace(/NAVIGATE:\w+(?:-\w+)*/gi, '').trim()
      action = 'navigate_section'
    }

    if (reply.includes('PRESENT_PROJECTS')) {
      presentProjects = true
      reply = reply.replace(/PRESENT_PROJECTS/gi, '').trim()
      action = 'show_projects'
    }

    const highlightMatch = reply.match(/HIGHLIGHT:(\w+(?:-\w+)*)/i)
    if (highlightMatch) {
      highlightProject = highlightMatch[1]
      reply = reply.replace(/HIGHLIGHT:\w+(?:-\w+)*/gi, '').trim()
      action = 'highlight_projects'
    }

    // Update memory with response and action
    conversationMemory.updateFromResponse(reply, action, highlightProject)
    
    // Generate contextual suggestions based on the response content
    let suggestions: string[] = []
    
    // If we just showed a specific project, suggest related questions
    if (highlightProject) {
      if (highlightProject.includes('findu')) {
        suggestions = [
          '[suggest:How does the AI matching work?]How does the AI matching work?[/suggest]',
          '[suggest:What was the impact on students?]What was the impact?[/suggest]',
          '[suggest:Show me another project]Show another project[/suggest]'
        ]
      } else if (highlightProject === 'nural') {
        suggestions = [
          '[suggest:How does the chat-based learning work?]How does it work?[/suggest]',
          '[suggest:What makes it different from other platforms?]What makes it unique?[/suggest]',
          '[suggest:Show me another project]Show another project[/suggest]'
        ]
      } else if (highlightProject === 'flock') {
        suggestions = [
          '[suggest:How does the AI scheduling work?]How does scheduling work?[/suggest]',
          '[suggest:What problem does it solve?]What problem does it solve?[/suggest]',
          '[suggest:Show me another project]Show another project[/suggest]'
        ]
      }
    } 
    // If we presented all projects, suggest deeper questions
    else if (presentProjects) {
      suggestions = conversationMemory.generateSmartSuggestions()
    }
    // For other responses, analyze the content to generate relevant suggestions
    else {
      const responseLower = reply.toLowerCase()
      
      // If talking about technical aspects
      if (responseLower.includes('technical') || responseLower.includes('built') || responseLower.includes('stack')) {
        suggestions.push('[suggest:What was the most challenging part?]Most challenging part?[/suggest]')
      }
      
      // If mentioning AI or ML
      if (responseLower.includes('ai') || responseLower.includes('machine learning')) {
        suggestions.push('[suggest:How do you approach AI implementation?]Your AI approach?[/suggest]')
      }
      
      // If discussing impact or results
      if (responseLower.includes('user') || responseLower.includes('impact') || responseLower.includes('result')) {
        suggestions.push('[suggest:What metrics do you track?]What metrics matter?[/suggest]')
      }
      
      // Always include at least one navigation suggestion
      if (suggestions.length < 3) {
        const fallbackSuggestions = conversationMemory.generateSmartSuggestions()
        suggestions = [...suggestions, ...fallbackSuggestions].slice(0, 3)
      }
    }
    
    // Add suggestions to the response
    if (suggestions.length > 0) {
      reply += '\n\n' + suggestions.join(' ')
    }

    const response: ChatResponse = {
      reply,
      ...(navigationAction && { navigationAction }),
      ...(navigatePage && { navigatePage }),
      ...(presentProjects && { presentProjects }),
      ...(highlightProject && { highlightProject })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Reset memory on error to avoid stuck state
    conversationMemory.reset()
    
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}