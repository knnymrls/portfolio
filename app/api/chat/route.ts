import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getSystemPromptWithKnowledge } from "@/lib/knowledge-utils";

// OpenAI provider is imported directly

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"), // Upgraded from mini for better tool calling
      messages: convertToModelMessages(messages),
      system: getSystemPromptWithKnowledge(),
      tools: {
        navigateToSection: tool({
          description: "Navigate to a specific section of the portfolio",
          inputSchema: z.object({
            section: z
              .enum(["home", "skills", "ventures", "about", "contact"])
              .describe(
                'The section to navigate to - use "home" for case studies, work samples, or project showcases'
              ),
          }),
          execute: async ({ section }) => {
            return { navigated: true, section };
          },
        }),
        highlightContent: tool({
          description:
            "Highlight specific content elements on the page to draw attention to them",
          inputSchema: z.object({
            targets: z
              .array(z.string())
              .describe(
                'Array of elements to highlight - can be: "hero", "projects", "ventures", "social", "contact", "navigation", specific project names, or CSS selectors'
              ),
            duration: z
              .number()
              .optional()
              .describe(
                "Duration in milliseconds to keep highlighted (default: 4000)"
              ),
          }),
          execute: async ({ targets, duration = 4000 }) => {
            return { highlighted: true, targets, duration };
          },
        }),
        suggestFollowUps: tool({
          description:
            "Suggest contextual follow-up questions for the user based on the conversation",
          inputSchema: z.object({
            questions: z
              .array(z.string())
              .min(3)
              .max(3)
              .describe(
                "Exactly 3 follow-up questions that would be helpful based on the current context"
              ),
          }),
          execute: async ({ questions }) => {
            return { suggested: true, questions };
          },
        }),
      },
      maxTokens: 500,
      temperature: 0.7,
      // Simplified tool calling approach
      toolChoice: "auto", // Let AI decide when to use tools
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
