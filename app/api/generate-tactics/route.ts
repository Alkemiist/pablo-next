
// imports
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Tactic, GenerateTacticsRequest, GenerateTacticsResponse, ErrorResponse } from '@/lib/types/tactics';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to detect image format from base64 string
function detectImageFormat(base64String: string): string {
  if (base64String.startsWith('/9j/')) return 'jpeg';
  if (base64String.startsWith('iVBORw0KGgo')) return 'png';
  if (base64String.startsWith('R0lGODlh')) return 'gif';
  if (base64String.startsWith('UklGR')) return 'webp';
  return 'png'; // default to PNG
}

export async function POST(request: NextRequest) {
  try {

    // Parse the request body: what this does is it takes the request body and parses it into a GenerateTacticsRequest object.
    const body: GenerateTacticsRequest = await request.json();
    const { brand, product, persona, goal, visualGuide, cardIndex, generateSingle } = body;

    // Validate required fields
    if (!brand || !product || !persona || !goal || !visualGuide) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const numTactics = generateSingle ? 1 : 4;
    const tacticsText = generateSingle ? '1 creative tactic' : '4 creative tactics';

    // Create the prompt for OpenAI
    const prompt = `You are a world-class creative strategist with experience at top global agencies. 
      Your task is to develop ${tacticsText} that would drive results for a brand campaign at the level of Apple, Nike, or Coca-Cola. 

      Campaign Brief & Context:
      - Brand: ${brand}
      - Product: ${product}
      - Target Persona: ${persona}
      - Goal: ${goal}
      - Visual Guide: ${visualGuide}

      Develop ${tacticsText} that are:
	    •	Strategically aligned with the brand’s voice, audience mindset, and product strengths
	    •	Emotionally resonant, culturally current, and behaviorally impactful
	    •	Visually iconic, suitable for global recognition and platform-native engagement
	    •	Rooted in modern creative platforms (e.g., TikTok-native ideas, IG Reels, YouTube Shorts, IRL activations amplified online)
      •	Unique and different from each other

      For each tactic, provide:
      1. A creative title (max 8 words and not repeatable with other 3 tactics)
      2. The specific platform/medium (e.g., "TikTok Post", "Instagram Reel", "YouTube Short", "TV", "")
      3. A one-liner summary that captures the essence of the tactic (max 15 words)
      4. A core message that captures the essence of the tactic (max 1 sentence)
      5. The goal of the tactic (max 1 sentence)
      6. A full description explaining the tactic in detail (max 4 sentences)
      7. Why this tactic works specifically for this brand/product/persona combination (max 4 sentences)
      8. A descriptive image prompt that would represent this tactic visually (be specific about style, mood, colors, composition). IMPORTANT: Request HYPER-REALISTIC, photographic quality images with natural lighting, sharp details, and professional composition. Avoid cartoon, illustration, or artistic styles.
      9. A performance hook that would make this idea scroll-stopping, shareable, or addictive to engage with (max 1 sentence)
      10. An influencer match that would execute this best (max 1 sentence)

      Style and output:
      •	Ensure no repetition across tactics—each idea must stand alone. Title's and one-liners should be unique and different from each other.
      •	Prioritize fresh thinking, bold creativity, and channel-native storytelling.
      •	Avoid clichés. Lean into what will get people to stop scrolling and act.

      Each idea must feel like it came from a top-tier agency creative team, ready for presentation to a CMO.

      Format your response as a JSON array with exactly ${numTactics} object${numTactics > 1 ? 's' : ''}, each containing:
      {
        "title": "Campaign-worthy name (max 8 words)",
        "platform": "Platform/Medium (e.g., TikTok Post, IG Reel, YouTube Short)",
        "oneLinerSummary": "Punchy one-liner capturing the creative hook (max 15 words)",
        "coreMessage": "Compelling, high-level concept in 1 sentence",
        "goal": "The goal of the tactic in 1 sentence",
        "fullDescription": "Compelling, high-level concept in up to 4 sentences",
        "whyItWorks": "Strategic rationale on why this tactic fits the brand, product, persona, and goal (max 4 sentences)",
        "performanceHook": "What makes this idea scroll-stopping, shareable, or addictive to engage with",
        "influencerMatch": "Describe the ideal creator, aesthetic, or personality who could execute this best",
        "imagePrompt": "Hyper-realistic, cinematic-quality image description. Use natural light, real textures, sharp details, and professional composition. Specify mood, colors, framing. No illustration or cartoon."
      }`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a world-class creative director and marketing strategist known for building viral, award-winning campaigns across social, digital, and experiential channels. You think like a strategist, concept like a creative director, and execute like a growth marketer.

                    You only deliver ideas that are bold, culturally on-point, and worthy of a global brand. You avoid clichés and generic marketing jargon. Every idea must drive clear business results and feel creatively brave.

                    Your output should:
                    •	Include a campaign title or theme
                    •	Offer 2–3 platform-native execution ideas (e.g., Instagram Reel hook, TikTok format, OOH concept)
                    •	Be optimized for high engagement, emotional resonance, and shareability
                    •	Be specific to the brand’s tone, target audience, and market context

                    Use storytelling, humor, tension, and surprise to make ideas unforgettable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
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
    if (!Array.isArray(tactics) || tactics.length !== numTactics) {
      throw new Error('Invalid tactics response structure');
    }

    // Transform the response and generate actual images
    const formattedTactics: Tactic[] = [];
    
    for (let i = 0; i < tactics.length; i++) {
      const tactic = tactics[i];
      
      try {
                // Using gpt-image-1 as requested by user
        console.log('🔍 Attempting to use gpt-image-1 model...');
        console.log('🔑 API Key available:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
        
        const enhancedPrompt = `PHOTOREALISTIC IMAGE: ${tactic.imagePrompt || `Creative marketing visual for: ${tactic.title}`}

            CRITICAL SPECIFICATIONS:
            - Shot with professional DSLR camera, 85mm lens (or what ever lens is best for the image)
            - Hyperrealistic skin textures, fabric details, surface materials
            - Perfect focus, shallow depth of field, cinematic composition (if applicable)
            - Color grading: rich saturation, professional color balance
            - No digital artifacts, no cartoon elements, no illustrations (unless requested)
            - Commercial photography standards, magazine-quality finish
            - Sharp details in foreground, beautiful bokeh in background (if applicable)
            - If you are showing people, make sure they are looking at the camera and smiling, and if you are showing a product, make sure it is in focus and in a good position.
            - Make sure that families look real and having a great time together. One mom, one dad, and one or more kids. (depending on the product)
            - avoid too much softness in the image, make sure the image is sharp and clear.
            - avoid too much blur in the image, make sure the image is sharp and clear.
            - avoid too much noise in the image, make sure the image is sharp and clear.
            - avoid too much grain in the image, make sure the image is sharp and clear.
            - avoid too much contrast in the image, make sure the image is sharp and clear.
            - avoid too much saturation in the image, make sure the image is sharp and clear.
            - avoid too much brightness in the image, make sure the image is sharp and clear.

            MOOD AND STYLE:
            - Cinematic lighting with dramatic shadows and highlights
            - Premium brand aesthetic, luxury visual appeal
            - Marketing campaign ready, advertisement quality
            - Photojournalistic authenticity with artistic flair

            TECHNICAL REQUIREMENTS:
            - Resolution: Maximum available (1792x1024)
            - Quality: Highest definition possible
            - Style: Natural photographic realism`;

        let imageResponse;
        
        try {
          // First attempt: Try gpt-image-1 as requested
          console.log('🚀 Trying gpt-image-1 model...');
          
          // Try different parameter combinations for gpt-image-1
          const gptImageParams = {
            model: "gpt-image-1" as const,
            prompt: enhancedPrompt,
            n: 1,
            // Try different sizes in case gpt-image-1 has different requirements
            size: "1792x1024" as const,
            response_format: "b64_json" as const
          };
          
          // Remove parameters that gpt-image-1 might not support
          console.log('📝 Using parameters:', gptImageParams);
          imageResponse = await openai.images.generate(gptImageParams);
          console.log('✅ gpt-image-1 succeeded!', imageResponse);
          
                 } catch (gptImageError: any) {
           console.error('❌ gpt-image-1 failed:', gptImageError);
           console.log('📋 Error details:', {
             message: gptImageError?.message || 'Unknown error message',
             status: gptImageError?.status || 'Unknown status',
             type: gptImageError?.type || 'Unknown type'
           });
          
          // Fallback to dall-e-3 if gpt-image-1 fails
          console.log('🔄 Falling back to dall-e-3...');
          imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: "1792x1024",
            quality: "hd", 
            style: "natural",
            response_format: "b64_json"
          });
          console.log('✅ dall-e-3 fallback succeeded');
        }

        console.log("imageResponse", imageResponse);

        // Handle both URL and base64 responses with format detection
        let generatedImageUrl;
        if (imageResponse.data?.[0]?.b64_json) {
          // Base64 response - create data URL with proper format detection
          const base64Image = imageResponse.data[0].b64_json;
          const imageFormat = detectImageFormat(base64Image);
          generatedImageUrl = `data:image/${imageFormat};base64,${base64Image}`;
        } else if (imageResponse.data?.[0]?.url) {
          // URL response (fallback)
          generatedImageUrl = imageResponse.data[0].url;
        } else {
          generatedImageUrl = null;
        }

        formattedTactics.push({
          image: generatedImageUrl || `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+${i + 1}`, //
          title: tactic.title || `Tactic ${i + 1}`,
          platform: tactic.platform || "Social Media",
          oneLinerSummary: tactic.oneLinerSummary || `Summary for tactic ${i + 1}`,
          coreMessage: tactic.coreMessage || `Core message for tactic ${i + 1}`,
          goal: tactic.goal || `Goal for tactic ${i + 1}`,
          fullDescription: tactic.fullDescription || `Description for tactic ${i + 1}`,
          whyItWorks: tactic.whyItWorks || `Why tactic ${i + 1} works`,
        });
      } catch (imageError) {
        console.error(`Failed to generate image for tactic ${i + 1}:`, imageError);
        
        // Fallback with placeholder if image generation fails
        formattedTactics.push({
          image: `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+${i + 1}`,
          title: tactic.title || `Tactic ${i + 1}`,
          platform: tactic.platform || "Social Media",
          oneLinerSummary: tactic.oneLinerSummary || `Summary for tactic ${i + 1}`,
          coreMessage: tactic.coreMessage || `Core message for tactic ${i + 1}`,
          goal: tactic.goal || `Goal for tactic ${i + 1}`,
          fullDescription: tactic.fullDescription || `Description for tactic ${i + 1}`,
          whyItWorks: tactic.whyItWorks || `Why tactic ${i + 1} works`,
        });
      }
    }

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