import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { navigationFunction } from '../../utils/navigation'
import { ChatResponse } from '../../types'
import { getAIContentSummary } from '../../../lib/content-registry'
import { searchContent, understandUserQuery, SearchResult } from '../../../lib/semantic-search'
import { conversationMemory } from '../../../lib/conversation-memory'
import { commandProcessor } from '../../../lib/command-processor'

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
      model: 'gpt-4o-mini', // GPT-5-mini returns empty responses, using gpt-4o-mini
      messages: [
        {
          role: 'system',
          content: `You are Kenny's portfolio AI assistant. You help visitors learn about Kenny's work, projects, ventures, and writings.

🚨 CRITICAL COMMAND REQUIREMENT 🚨
YOU MUST START EVERY RESPONSE WITH COMMANDS. THE SYSTEM WILL BREAK WITHOUT COMMANDS.

MANDATORY FORMAT FOR ALL RESPONSES:
1. FIRST: Write the command(s) at the very beginning
2. THEN: Add a space
3. FINALLY: Write your human-readable response

COMMAND RULES - ABSOLUTELY NO EXCEPTIONS:
✅ When user asks about projects → START with: "PRESENT_PROJECTS NAVIGATE:case-studies"
✅ When user mentions Nural → START with: "HIGHLIGHT:nural"
✅ When user mentions Flock → START with: "HIGHLIGHT:flock"
✅ When user mentions FindU → START with: "HIGHLIGHT:findu-highschool"
✅ When user asks about ventures → START with: "NAVIGATE_PAGE:/content/ventures"
✅ When user asks about blog → START with: "NAVIGATE:blog"
✅ When user asks about experiments → START with: "NAVIGATE:experiments"

⚠️ FAILURE TO INCLUDE COMMANDS MEANS THE USER CANNOT SEE THE CONTENT ⚠️

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

EXAMPLES - START EVERY RESPONSE WITH THE COMMAND:
"Show me your projects" → Your response MUST start with: "PRESENT_PROJECTS NAVIGATE:case-studies"
"Tell me about Nural" → Your response MUST start with: "HIGHLIGHT:nural"
"Show me Flock" → Your response MUST start with: "HIGHLIGHT:flock"
"Navigate to ventures" → Your response MUST start with: "NAVIGATE_PAGE:/content/ventures"

YOUR FIRST WORD MUST BE A COMMAND. NOT "Let me" or "I'll" - START WITH THE COMMAND!
${nextProject ? `- "Show another project" → "Let me show you ${nextProject}! HIGHLIGHT:${nextProject} [Provide specific details about ${nextProject}]"` : ''}
- "What ventures are you working on?" → "I'm working on several ventures! NAVIGATE_PAGE:/content/ventures Let me show you what I'm building..."
- "Tell me about the AI Writing Assistant" → "The AI Writing Assistant is one of my active ventures. NAVIGATE_PAGE:/content/ventures/ai-writing-assistant It's an intelligent tool..."
- "Read the FindU case study" → "Let me show you the detailed FindU case study! NAVIGATE_PAGE:/content/case-studies/findu-highschool This comprehensive breakdown..."

SUGGESTION GENERATION:
After EVERY response, generate 2-3 contextually relevant suggestions based on:
1. What the user just asked about
2. What they haven't seen yet
3. Natural follow-up questions

Format suggestions as: [SUGGEST:display text]suggestion text[/SUGGEST]

Examples after showing all projects:
[SUGGEST:Tell me more about FindU]Tell me about FindU[/SUGGEST]
[SUGGEST:Which project was most challenging?]Most challenging project?[/SUGGEST]
[SUGGEST:Show me your ventures]Show ventures[/SUGGEST]

Examples after showing a specific project:
[SUGGEST:How does it work technically?]Technical details[/SUGGEST]
[SUGGEST:What was the impact?]What impact did it have?[/SUGGEST]
[SUGGEST:Show me another project]Show another project[/SUGGEST]

Be creative and vary the suggestions based on the actual conversation context!`
        },
        ...conversationHistory.slice(-5), // Include last 5 messages for context
        {
          role: 'user',
          content: message
        }
      ],
      // GPT-5 requires specific parameters
      // temperature: 1, // GPT-5 only supports default temperature
      max_completion_tokens: 300, // GPT-5 uses max_completion_tokens, not max_tokens
    })

    const responseMessage = completion.choices[0]?.message
    let aiReply = responseMessage?.content || 'Sorry, I could not generate a response.'

    // Process the response using command processor
    const processed = commandProcessor.processResponse(message, aiReply)

    // If no commands were found, try one more time with a stronger prompt
    if (!processed.hasCommands) {
      console.log('⚠️ No commands found in initial response, retrying with stronger prompt...')

      const retryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // GPT-5-mini returns empty responses, using gpt-4o-mini
        messages: [
          {
            role: 'system',
            content: `🚨 CRITICAL ERROR: Your previous response had NO COMMANDS. The user cannot see content without commands!
            
YOU MUST START YOUR RESPONSE WITH A COMMAND. Examples:
- For projects: "PRESENT_PROJECTS NAVIGATE:case-studies"
- For Nural: "HIGHLIGHT:nural"
- For Flock: "HIGHLIGHT:flock"
- For ventures: "NAVIGATE_PAGE:/content/ventures"

RESPOND AGAIN WITH COMMANDS FIRST!`
          },
          { role: 'user', content: message }
        ],
        // temperature: 1, // GPT-5 only supports default
        max_completion_tokens: 300,
      })

      const retryReply = retryCompletion.choices[0]?.message?.content || aiReply
      const retryProcessed = commandProcessor.processResponse(message, retryReply)

      if (retryProcessed.hasCommands) {
        console.log('✅ Retry successful - commands found!')
        aiReply = retryReply
      } else {
        console.log('⚠️ Retry failed - injecting commands based on query')
        // Inject commands based on query as last resort
        const injectedCommands = commandProcessor.detectIntentAndGenerateCommands(message)
        if (Object.keys(injectedCommands).length > 0) {
          const commandString = commandProcessor.formatCommandsForResponse(injectedCommands)
          aiReply = `${commandString} ${processed.cleanedReply}`
        }
      }
    }

    // Re-process the final response
    const finalProcessed = commandProcessor.processResponse(message, aiReply)

    // Extract commands for the response
    let navigationAction = finalProcessed.commands.navigate
    let navigatePage = finalProcessed.commands.navigatePage
    let presentProjects = finalProcessed.commands.presentProjects || false
    let highlightProject = finalProcessed.commands.highlight?.[0] // Take first highlight for compatibility
    let reply = finalProcessed.cleanedReply

    // Determine action type
    let action = 'response'
    if (presentProjects) action = 'show_projects'
    else if (highlightProject) action = 'highlight_projects'
    else if (navigationAction) action = 'navigate_section'
    else if (navigatePage) action = 'navigate'

    // Update memory with response and action
    conversationMemory.updateFromResponse(reply, action, highlightProject)

    // The AI should have already included suggestions in the reply
    // Extract them to verify they exist, if not add fallback
    const suggestionMatches = reply.match(/\[SUGGEST:.*?\].*?\[\/SUGGEST\]/g)

    if (!suggestionMatches || suggestionMatches.length === 0) {
      // AI didn't generate suggestions, add some fallback ones
      console.log('No AI-generated suggestions found, adding fallbacks')
      const fallbackSuggestions = conversationMemory.generateSmartSuggestions()

      if (fallbackSuggestions.length > 0) {
        reply += '\n\n' + fallbackSuggestions.join(' ')
      }
    } else {
      console.log(`Found ${suggestionMatches.length} AI-generated suggestions`)
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