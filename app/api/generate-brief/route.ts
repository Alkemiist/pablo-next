import { NextRequest } from "next/server";
import OpenAI from "openai";
import { BriefJsonSchema } from "@/lib/brief-schema";
import { systemPrompt, userPromptFromIntake } from "@/lib/prompt";
import { BriefIntake } from "@/lib/brief-types";

export const runtime = "edge"; // lower latency streaming

export async function POST(req: NextRequest) {
  try {
    const intake: BriefIntake = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable");
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userPrompt = userPromptFromIntake(intake);

    // Use chat.completions.create with streaming for better JSON handling
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
    });

    // Accumulate the complete response first, then send it
    let fullResponse = "";
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }

    // Validate that we have a complete response
    if (!fullResponse.trim()) {
      throw new Error("No response received from OpenAI");
    }

    // Try to parse to ensure it's valid JSON
    try {
      JSON.parse(fullResponse);
    } catch (parseError) {
      console.error("Invalid JSON response:", fullResponse);
      throw new Error("AI response is not valid JSON");
    }

    // Return the complete JSON response
    return new Response(fullResponse, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
      },
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ 
      error: err?.message || "Unknown error",
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
