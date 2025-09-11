import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🧪 Test API: Checking environment setup");
  
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o";
  
  return new Response(JSON.stringify({
    status: "ok",
    hasApiKey,
    model,
    message: hasApiKey 
      ? "OpenAI API key is configured correctly" 
      : "OpenAI API key is missing. Please create a .env.local file with your API key.",
    timestamp: new Date().toISOString()
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
