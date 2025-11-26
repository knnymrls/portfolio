import {
  Experimental_Agent as Agent,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { buildPortfolioSystemPrompt } from "./portfolio-instructions";
import {
  portfolioRealtimeTools,
  portfolioTools,
} from "./portfolio-tools";
import { retrieveContext } from "./rag-retriever";
import type { StoredChunk } from "./vector-store";

const DEFAULT_TEXT_MODEL = process.env.PORTFOLIO_TEXT_MODEL ?? "gpt-5.1";
const DEFAULT_REALTIME_MODEL =
  process.env.PORTFOLIO_REALTIME_MODEL ?? "gpt-realtime-mini";

export const PORTFOLIO_MODELS = {
  text: DEFAULT_TEXT_MODEL,
  realtime: DEFAULT_REALTIME_MODEL,
} as const;

export function createPortfolioAgent(pathname?: string, retrievedContext?: StoredChunk[]) {
  return new Agent({
    model: openai(PORTFOLIO_MODELS.text),
    system: buildPortfolioSystemPrompt({ channel: "text", pathname, retrievedContext }),
    tools: portfolioTools,
    stopWhen: stepCountIs(8),
  });
}

// Extract the latest user message for RAG retrieval
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLatestUserMessage(messages: any[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      const content = messages[i].content;
      if (typeof content === "string") return content;
      // Handle array content (e.g., multi-modal messages)
      if (Array.isArray(content)) {
        const textPart = content.find((p: { type: string }) => p.type === "text");
        if (textPart?.text) return textPart.text;
      }
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPortfolioAgentResponse(messages: any[], pathname?: string) {
  // Get the latest user message for RAG retrieval
  const userQuery = getLatestUserMessage(messages);

  // Retrieve relevant context if we have a query
  let retrievedContext: StoredChunk[] = [];
  if (userQuery) {
    try {
      retrievedContext = await retrieveContext(userQuery, {
        topK: 5,
        threshold: 0.3, // Lower threshold to get more context
        currentRoute: pathname,
      });
      // Debug: log what context was retrieved
      console.log(`[RAG] Query: "${userQuery}"`);
      console.log(`[RAG] Retrieved ${retrievedContext.length} chunks:`, retrievedContext.map(c => c.title).join(", "));
    } catch (error) {
      console.warn("RAG retrieval failed, using empty context:", error);
    }
  }

  const agent = createPortfolioAgent(pathname, retrievedContext);
  return agent.respond({ messages });
}

export function buildRealtimeClientSecretPayload() {
  return {
    session: {
      type: "realtime",
      model: PORTFOLIO_MODELS.realtime,
      instructions: buildPortfolioSystemPrompt({ channel: "realtime" }),
      audio: {
        output: {
          voice: "sage",
        },
      },
      tools: [...portfolioRealtimeTools],
    },
  };
}

export function buildRealtimeCallPayload() {
  return {
    type: "realtime",
    model: PORTFOLIO_MODELS.realtime,
    output_modalities: ["audio", "text"],
    instructions: buildPortfolioSystemPrompt({ channel: "realtime" }),
    audio: {
      input: {
        format: {
          type: "audio/pcm",
          rate: 24000,
        },
        turn_detection: {
          type: "semantic_vad",
        },
      },
      output: {
        format: {
          type: "audio/pcm",
        },
        voice: "sage",
      },
    },
    tools: [...portfolioRealtimeTools],
  };
}
