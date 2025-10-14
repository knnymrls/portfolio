import { NextResponse } from "next/server";
import { getSystemPromptWithKnowledge } from "@/lib/knowledge-utils";
import dns from "dns";

// Force IPv4 DNS resolution
dns.setDefaultResultOrder("ipv4first");

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Request an ephemeral token from OpenAI
    const sessionConfig = {
      session: {
        type: "realtime",
        model: "gpt-realtime-mini",
        audio: {
          output: {
            voice: "sage",
          },
        },
        instructions: getSystemPromptWithKnowledge(),
        tools: [
          {
            type: "function",
            name: "navigateToSection",
            description: "Navigate to a specific section of the portfolio",
            parameters: {
              type: "object",
              properties: {
                section: {
                  type: "string",
                  enum: ["home", "skills", "ventures", "about", "contact"],
                },
              },
              required: ["section"],
            },
          },
          {
            type: "function",
            name: "highlightContent",
            description: "Highlight specific content elements on the page to draw attention to them",
            parameters: {
              type: "object",
              properties: {
                targets: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: 'Array of elements to highlight. Use data-highlight-id values for precision: "hero-title", "hero-image", "hero-actions", "cta-contact", "social-github", "social-linkedin", "case-studies-title", "projects-grid", "project-findu", "project-mkrs", "skills-title", "about-title", "contact-form". Can also use sections: "hero", "case-studies", "skills", "about", "contact"'
                },
                duration: {
                  type: "number",
                  description: "Duration in milliseconds to keep highlighted (default: 4000)"
                }
              },
              required: ["targets"]
            }
          },
          {
            type: "function",
            name: "suggestFollowUps",
            description: "Suggest contextual follow-up questions for the user",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  minItems: 3,
                  maxItems: 3,
                  description: "Exactly 3 follow-up questions based on context"
                }
              },
              required: ["questions"]
            }
          }
        ],
      },
    };

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to create ephemeral token:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      token: data.value,
      expires_at: data.expires_at,
    });
  } catch (error) {
    console.error("Error creating ephemeral token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
