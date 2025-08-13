import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { IMAGE_GENERATION_CONFIG, getModelParams } from '@/lib/config';

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
    const { prompt, contentType, model } = await request.json();

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
          model: model || "gpt-4o-mini",
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
        try {
          // Use the specified model or default to the primary model from config
          const imageModel = model || IMAGE_GENERATION_CONFIG.PRIMARY_MODEL;
          console.log(`🚀 Using ${imageModel} model for image generation...`);
          
          // Get model-specific parameters
          const modelParams = getModelParams(imageModel);
          
          response = await openai.images.generate({
            model: imageModel,
            prompt: prompt,
            ...modelParams
          });
          console.log(`✅ ${imageModel} succeeded!`);
          
        } catch (imageError: any) {
          console.error(`❌ ${model || IMAGE_GENERATION_CONFIG.PRIMARY_MODEL} failed:`, imageError);
          
          // If the specified model fails and it's not the primary model, try primary as fallback
          if (model && model !== IMAGE_GENERATION_CONFIG.PRIMARY_MODEL) {
            try {
              console.log(`🔄 Trying ${IMAGE_GENERATION_CONFIG.PRIMARY_MODEL} as fallback...`);
              const primaryParams = getModelParams(IMAGE_GENERATION_CONFIG.PRIMARY_MODEL);
              response = await openai.images.generate({
                model: IMAGE_GENERATION_CONFIG.PRIMARY_MODEL,
                prompt: prompt,
                ...primaryParams
              });
              console.log(`✅ ${IMAGE_GENERATION_CONFIG.PRIMARY_MODEL} fallback succeeded!`);
            } catch (primaryError) {
              console.error(`❌ ${IMAGE_GENERATION_CONFIG.PRIMARY_MODEL} fallback also failed:`, primaryError);
              throw imageError; // Throw the original error
            }
          } else {
            throw imageError;
          }
        }
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