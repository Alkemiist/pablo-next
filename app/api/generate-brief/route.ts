import { NextRequest } from "next/server";
import OpenAI from "openai";
import { BriefJsonSchema } from "@/lib/brief-schema";
import { systemPrompt, userPromptFromIntake } from "@/lib/prompt";
import { BriefIntake } from "@/lib/brief-types";

export const runtime = "edge"; // lower latency streaming

export async function POST(req: NextRequest) {
  console.log("🔧 API Route: Starting brief generation");
  
  try {
    const intake: BriefIntake = await req.json();
    console.log("🔧 API Route: Received intake data:", intake);

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Missing OPENAI_API_KEY environment variable");
      return new Response(JSON.stringify({ 
        error: "OpenAI API key not configured. Please create a .env.local file with your API key.",
        code: "MISSING_API_KEY"
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("🔧 API Route: API key found, creating OpenAI client");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userPrompt = userPromptFromIntake(intake);
    console.log("🔧 API Route: Generated user prompt:", userPrompt.substring(0, 200) + "...");

    console.log("🔧 API Route: Calling OpenAI API");
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
    let chunkCount = 0;
    
    for await (const chunk of stream) {
      chunkCount++;
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }

    console.log(`🔧 API Route: Received ${chunkCount} chunks, total response length: ${fullResponse.length}`);

    // Validate that we have a complete response
    if (!fullResponse.trim()) {
      console.error("❌ No response received from OpenAI");
      throw new Error("No response received from OpenAI");
    }

    console.log("🔧 API Route: Raw response:", fullResponse.substring(0, 500) + "...");

    // Try to parse to ensure it's valid JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(fullResponse);
      console.log("✅ API Route: Successfully parsed JSON response");
    } catch (parseError) {
      console.error("❌ Invalid JSON response:", fullResponse);
      throw new Error("AI response is not valid JSON");
    }

    // Return the complete JSON response
    console.log("🎉 API Route: Returning successful response");
    return new Response(fullResponse, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
      },
    });

  } catch (err: any) {
    console.error("💥 API Route Error:", err);
    console.error("💥 API Route Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return new Response(JSON.stringify({ 
      error: err?.message || "Unknown error",
      code: err?.code || "UNKNOWN_ERROR",
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
