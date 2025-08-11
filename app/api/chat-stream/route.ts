import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
// Streaming temporarily disabled - package exports changed
// import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getAIContentSummary } from '../../../lib/content-registry'
import { searchContent, understandUserQuery } from '../../../lib/semantic-search'
import { conversationMemory } from '../../../lib/conversation-memory'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  // Temporarily return non-streaming response until streaming is fixed
  return NextResponse.json({ 
    error: 'Streaming temporarily disabled. Use /api/chat instead.' 
  }, { status: 503 })
  
  /*
  try {
    const { message, conversationHistory = [], currentPath } = await req.json()

    if (!message) {
      return new Response('Message is required', { status: 400 })
    }

    // Update conversation memory
    conversationMemory.updateFromQuery(message)
    
    // Check for next project
    const nextProject = message.toLowerCase().includes('another project') || message.toLowerCase().includes('show another')
      ? conversationMemory.getNextProject()
      : null

    // Get dynamic content summary
    const contentSummary = await getAIContentSummary()
    
    // Perform semantic search
    const queryAnalysis = await understandUserQuery(message)
    const relevantContent = await searchContent(message, {
      filters: queryAnalysis.filters,
      limit: 5,
      threshold: 0.6
    })
    
    // Format relevant content
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

IMPORTANT: Use the actual content above to provide specific, accurate responses.`
      : ''

    // Create streaming completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are Kenny's portfolio AI assistant. You help visitors learn about Kenny's work, projects, ventures, and writings. Be friendly, professional, and concise.

MANDATORY HIGHLIGHTING RULES - ENFORCE ON EVERY RESPONSE:
1. **EVERY response about content MUST include at least one HIGHLIGHT command**
2. **NO EXCEPTIONS** - When discussing projects, ALWAYS highlight them
3. **ALWAYS highlight** when user mentions:
   - Any project name → HIGHLIGHT it immediately
   - "Nural" → HIGHLIGHT:nural
   - "Flock" → HIGHLIGHT:flock
   - "FindU" → HIGHLIGHT:findu-highschool or HIGHLIGHT:findu-college
4. **FORMAT**: Use HIGHLIGHT:[id] when discussing any project
5. **DEFAULT**: If showing a project, HIGHLIGHT it first, then describe it

${contentSummary}
${relevantContext}

NAVIGATION INSTRUCTIONS:
- For showing projects: Use "PRESENT_PROJECTS NAVIGATE:case-studies"
- For ventures: Use "NAVIGATE_PAGE:/content/ventures"
- For sections: Use "NAVIGATE:case-studies", "NAVIGATE:experiments", etc.
- For highlighting: Use "HIGHLIGHT:[project-id]"

RESPONSE EXAMPLES (ALWAYS START WITH HIGHLIGHT):
- "Show me your projects" → "PRESENT_PROJECTS NAVIGATE:case-studies I'd love to show you my projects!"
- "Tell me about Nural" → "HIGHLIGHT:nural Let me highlight Nural for you!"
- "Show me Flock" → "HIGHLIGHT:flock Here's Flock highlighted for you!"
${nextProject ? `- "Show another project" → "HIGHLIGHT:${nextProject} Let me show you ${nextProject}!"` : ''}

SUGGESTION GENERATION:
After EVERY response, generate 2-3 contextual suggestions:
Format: [SUGGEST:display text]suggestion text[/SUGGEST]

Be creative and vary suggestions based on context!`
        },
        ...conversationHistory.slice(-5),
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.5, // Lower temperature for more consistent command generation
      max_tokens: 500,
    })

    // Convert to stream - DISABLED: OpenAIStream not available
    /* const stream = OpenAIStream(response, {
      onStart: async () => {
        console.log('🎬 [STREAM] Started streaming response')
      },
      onCompletion: async (completion) => {
        console.log('✅ [STREAM] Completed streaming')
        
        // Update memory with the complete response
        // Parse commands from the complete text
        let navigationAction: string | undefined
        let navigatePage: string | undefined
        let presentProjects = false
        let highlightProject: string | undefined
        
        const pageNavMatch = completion.match(/NAVIGATE_PAGE:([/\w-]+)/i)
        if (pageNavMatch) navigatePage = pageNavMatch[1]
        
        const navMatch = completion.match(/NAVIGATE:(\w+(?:-\w+)*)/i)
        if (navMatch) navigationAction = navMatch[1]
        
        if (completion.includes('PRESENT_PROJECTS')) presentProjects = true
        
        const highlightMatch = completion.match(/HIGHLIGHT:(\w+(?:-\w+)*)/i)
        if (highlightMatch) highlightProject = highlightMatch[1]
        
        const action = presentProjects ? 'show_projects' : 
                       highlightProject ? 'highlight_projects' :
                       navigationAction ? 'navigate_section' :
                       navigatePage ? 'navigate' : 'response'
        
        conversationMemory.updateFromResponse(completion, action, highlightProject)
      },
    }) */

    // Return streaming response - DISABLED
    /* return new StreamingTextResponse(stream, {
      headers: {
        'X-Stream-Type': 'openai',
        'Cache-Control': 'no-cache',
      }
    }) */
    return NextResponse.json({ error: 'Streaming disabled' }, { status: 503 })
  } catch (error) {
    console.error('Chat Stream API error:', error)
    
    // Reset memory on error
    conversationMemory.reset()
    
    return new Response('Failed to process message', { status: 500 })
  }
  */
}