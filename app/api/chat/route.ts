import { createPortfolioAgentResponse } from "@/lib/ai/portfolio-orchestrator";

export async function POST(req: Request) {
  try {
    const { messages, pathname } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload: messages missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    return createPortfolioAgentResponse(messages, pathname);
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
