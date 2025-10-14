import { NextRequest, NextResponse } from "next/server";
import { getSystemPromptWithKnowledge } from "@/lib/knowledge-utils";
import dns from "dns";

// Force IPv4 DNS resolution
dns.setDefaultResultOrder("ipv4first");

export async function POST(req: NextRequest) {
  try {
    // Read raw SDP text from request body
    const sdp = await req.text();
    console.log("Received SDP offer:", { length: sdp.length });

    if (!sdp || sdp.trim().length === 0) {
      console.error("No SDP in request body");
      return NextResponse.json(
        { error: "SDP offer is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Configure the session with portfolio knowledge and tools
    const sessionConfig = {
      type: "realtime",
      model: "gpt-realtime-mini",
      output_modalities: ["audio", "text"],
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
                description:
                  'The section to navigate to - use "home" for case studies, work samples, or project showcases',
              },
            },
            required: ["section"],
          },
        },
        {
          type: "function",
          name: "highlightContent",
          description:
            "Highlight specific content elements on the page to draw attention to them",
          parameters: {
            type: "object",
            properties: {
              targets: {
                type: "array",
                items: { type: "string" },
                description:
                  'Array of elements to highlight - can be: "hero", "projects", "ventures", "social", "contact", "navigation", specific project names, or CSS selectors',
              },
              duration: {
                type: "number",
                description:
                  "Duration in milliseconds to keep highlighted (default: 4000)",
              },
            },
            required: ["targets"],
          },
        },
        {
          type: "function",
          name: "suggestFollowUps",
          description:
            "Suggest contextual follow-up questions for the user based on the conversation",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 3,
                description:
                  "Exactly 3 follow-up questions that would be helpful based on the current context",
              },
            },
            required: ["questions"],
          },
        },
      ],
    };

    // Create FormData for the multipart request
    const formData = new FormData();
    formData.append("sdp", sdp);
    formData.append("session", JSON.stringify(sessionConfig));

    console.log("Sending request to OpenAI Realtime API...");

    // Send request to OpenAI Realtime API
    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    console.log("OpenAI response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      return NextResponse.json(
        { error: `OpenAI API error: ${error}` },
        { status: response.status }
      );
    }

    // Get the SDP answer
    const sdpAnswer = await response.text();
    console.log("Received SDP answer from OpenAI:", { length: sdpAnswer.length });

    // Extract call ID from Location header
    const location = response.headers.get("Location");
    const callId = location?.split("/").pop();
    console.log("Call ID:", callId);

    // Return SDP answer as text with proper content type
    return new NextResponse(sdpAnswer, {
      status: 200,
      headers: {
        "Content-Type": "application/sdp",
        "X-Call-ID": callId || "",
      },
    });
  } catch (error) {
    console.error("Error creating WebRTC session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
