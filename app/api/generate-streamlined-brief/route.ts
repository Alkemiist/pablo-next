import { NextRequest } from "next/server";
import OpenAI from "openai";
import { StreamlinedBriefIntake, validateStreamlinedBriefIntake, createSafeBriefDocument } from "@/lib/streamlined-brief-types";
import { streamlinedSystemPrompt, createStreamlinedPrompt } from "@/lib/streamlined-prompt";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  console.log("🚀 API Route: Starting streamlined brief generation");
  
  try {
    const intake: StreamlinedBriefIntake = await req.json();
    console.log("🚀 API Route: Received intake data:", intake);

    // Validate intake data
    if (!validateStreamlinedBriefIntake(intake)) {
      console.error("❌ Invalid intake data");
      return new Response(JSON.stringify({ 
        error: "Invalid intake data. All required fields must be provided.",
        code: "INVALID_INTAKE"
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

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

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const userPrompt = createStreamlinedPrompt(intake);

    console.log("🚀 API Route: Calling OpenAI API");
    console.log("📝 System prompt length:", streamlinedSystemPrompt.length);
    console.log("📝 User prompt length:", userPrompt.length);
    
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: streamlinedSystemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      stream: true,
      temperature: 0.2, // Lower temperature for more consistent, professional output
      max_tokens: 8000, // Increased for comprehensive briefs
    });

    // Accumulate the complete response
    let fullResponse = "";
    let chunkCount = 0;
    
    for await (const chunk of stream) {
      chunkCount++;
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }

    console.log(`🚀 API Route: Received ${chunkCount} chunks, total response length: ${fullResponse.length}`);

    if (!fullResponse.trim()) {
      console.error("❌ No response received from OpenAI");
      throw new Error("No response received from OpenAI");
    }

    // Parse and validate JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(fullResponse);
      console.log("✅ API Route: Successfully parsed JSON response");
    } catch (parseError) {
      console.error("❌ Invalid JSON response:", fullResponse);
      throw new Error("AI response is not valid JSON");
    }

    // Add generated date and enhance document metadata
    if (parsedResponse.document_info) {
      parsedResponse.document_info.generated_date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Ensure document title is properly formatted
      if (!parsedResponse.document_info.title || parsedResponse.document_info.title === "Marketing Brief for [Project Name]") {
        parsedResponse.document_info.title = `Strategic Marketing Brief: ${intake.project_name}`;
      }
      
      // Set next review date to 30 days from now
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 30);
      parsedResponse.document_info.next_review_date = nextReviewDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Create safe document with validation
    console.log("🔍 API Route: Validating generated document...");
    try {
      const safeDocument = createSafeBriefDocument(intake, parsedResponse);
      console.log("✅ API Route: Document validation passed");
      console.log("🎉 API Route: Returning successful response");
      return new Response(JSON.stringify(safeDocument), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    } catch (validationError) {
      console.error("❌ API Route: Document validation failed:", validationError);
      console.log("📄 API Route: Generated document structure:", Object.keys(parsedResponse));
      throw new Error(`Document validation failed: ${validationError instanceof Error ? validationError.message : 'Unknown validation error'}`);
    }

  } catch (err: any) {
    console.error("💥 API Route Error:", err);
    
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
