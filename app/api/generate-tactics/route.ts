import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Tactic, GenerateTacticsRequest, GenerateTacticsResponse, ErrorResponse } from '@/lib/types/tactics';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: GenerateTacticsRequest = await request.json();
    const { brand, product, persona, goal, visualGuide } = body;

    // Validate required fields
    if (!brand || !product || !persona || !goal || !visualGuide) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the prompt for OpenAI
    const prompt = `You are a creative strategist tasked with generating 4 innovative marketing tactics for a brand. 

CONTEXT:
- Brand: ${brand}
- Product: ${product}
- Target Persona: ${persona}
- Goal: ${goal}
- Visual Guide: ${visualGuide}

Generate 4 creative tactics that would work well for this specific context. Each tactic should be innovative, practical, and tailored to the provided information.

For each tactic, provide:
1. A creative title (max 8 words)
2. A one-liner summary that captures the essence of the tactic (max 15 words)
3. A full description explaining the tactic in detail (max 4 sentences)
4. Why this tactic works specifically for this brand/product/persona combination (max 4 sentences)
5. A descriptive image prompt that would represent this tactic visually (be specific about style, mood, colors, composition)

Format your response as a JSON array with exactly 4 objects, each containing:
{
  "title": "Creative Title",
  "oneLinerSummary": "One sentence summary",
  "fullDescription": "Full description in 4 sentences max",
  "whyItWorks": "Why this tactic works for this specific context in 4 sentences max",
  "imagePrompt": "Detailed image prompt for visual representation"
}

Make sure each tactic is unique, creative, and specifically tailored to the provided context. Focus on modern, innovative approaches that would resonate with the target persona and achieve the stated goal.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a distinguished creative marketing strategist with expertise in digital marketing, social media, and brand strategy. You excel at generating innovative, practical tactics that drive results."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let tactics;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tactics = JSON.parse(jsonMatch[0]);
      } else {
        tactics = JSON.parse(responseContent);
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate the response structure
    if (!Array.isArray(tactics) || tactics.length !== 4) {
      throw new Error('Invalid tactics response structure');
    }

    // Transform the response to match our exact format
    const formattedTactics: Tactic[] = tactics.map((tactic, index) => ({
      image: tactic.imagePrompt || `Generated image for tactic ${index + 1}`,
      title: tactic.title || `Tactic ${index + 1}`,
      oneLinerSummary: tactic.oneLinerSummary || `Summary for tactic ${index + 1}`,
      fullDescription: tactic.fullDescription || `Description for tactic ${index + 1}`,
      whyItWorks: tactic.whyItWorks || `Why tactic ${index + 1} works`,
    }));

    return NextResponse.json({
      success: true,
      tactics: formattedTactics,
      context: {
        brand,
        product,
        persona,
        goal,
        visualGuide
      }
    });

  } catch (error) {
    console.error('Error generating tactics:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate tactics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 