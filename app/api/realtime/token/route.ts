import { NextResponse } from "next/server";
import dns from "dns";
import { buildRealtimeClientSecretPayload } from "@/lib/ai/portfolio-orchestrator";

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

    const sessionConfig = buildRealtimeClientSecretPayload();

    console.log("Requesting ephemeral token from OpenAI...");
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
      console.error("OpenAI API error:", response.status, error);
      return NextResponse.json(
        { error: `OpenAI API error: ${error}` },
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
