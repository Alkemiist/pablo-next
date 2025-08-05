import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate API key
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
  console.error('OpenAI API key is not configured properly');
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, contentType } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Debug: Log API key status (without exposing the full key)
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key status:', {
      exists: !!apiKey,
      length: apiKey?.length,
      startsWith: apiKey?.substring(0, 7),
      endsWith: apiKey?.substring(apiKey.length - 4)
    });

    let response;
    
    // Handle different content types
    switch (contentType) {
      case 'text':
        response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a world-class creative content marketer, copywriter, designer, strategist, and creative director. Generate high-quality, engaging content based on the user's prompt."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        });
        break;

      case 'image':
        response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });
        break;

      case 'video':
        // Note: OpenAI doesn't have a video generation API yet
        // This is a placeholder for future implementation
        return NextResponse.json(
          { error: 'Video generation is not yet supported' },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: response,
      contentType: contentType
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured. Please check your .env.local file.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'OpenAI quota exceeded. Please check your billing and usage limits.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate content. Please check your API key and try again.' },
      { status: 500 }
    );
  }
} 