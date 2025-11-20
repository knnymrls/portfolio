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

const DEFAULT_TEXT_MODEL = process.env.PORTFOLIO_TEXT_MODEL ?? "gpt-4o-mini";
const DEFAULT_REALTIME_MODEL =
  process.env.PORTFOLIO_REALTIME_MODEL ?? "gpt-realtime-mini";

export const PORTFOLIO_MODELS = {
  text: DEFAULT_TEXT_MODEL,
  realtime: DEFAULT_REALTIME_MODEL,
} as const;

export function createPortfolioAgent(pathname?: string) {
  return new Agent({
    model: openai(PORTFOLIO_MODELS.text),
    system: buildPortfolioSystemPrompt({ channel: "text", pathname }),
    tools: portfolioTools,
    stopWhen: stepCountIs(8),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPortfolioAgentResponse(messages: any[], pathname?: string) {
  const agent = createPortfolioAgent(pathname);
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
