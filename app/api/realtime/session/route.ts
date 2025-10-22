import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { buildRealtimeCallPayload } from "@/lib/ai/portfolio-orchestrator";

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

    const sessionConfig = buildRealtimeCallPayload();

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
