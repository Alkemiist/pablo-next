
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
      2. A one-liner summary that captures the essence of the tactic (max 15 words)
      3. A core message that captures the essence of the tactic (max 1 sentence)
      4. The goal of the tactic (max 1 sentence)
      5. A full description explaining the tactic in detail (max 4 sentences)
      6. Why this tactic works specifically for this brand/product/persona combination (max 4 sentences)
      7. A descriptive image prompt that would represent this tactic visually (be specific about style, mood, colors, composition). IMPORTANT: Request HYPER-REALISTIC, photographic quality images with natural lighting, sharp details, and professional composition. Avoid cartoon, illustration, or artistic styles.
      8. A performance hook that would make this idea scroll-stopping, shareable, or addictive to engage with (max 1 sentence)
      90. An influencer match that would execute this best (max 1 sentence)

      Style and output:
      •	Ensure no repetition across tactics—each idea must stand alone. Title's and one-liners should be unique and different from each other.
      •	Prioritize fresh thinking, and bold creativity
      •	Avoid clichés. Lean into what will get people to stop scrolling and act.

      Each idea must feel like it came from a top-tier agency creative team, ready for presentation to a CMO.

      Format your response as a JSON array with exactly ${numTactics} object${numTactics > 1 ? 's' : ''}, each containing:
      {
        "title": "Campaign-worthy name (max 8 words)",
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
                    •	Offer 2–3 execution ideas 
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

            The image should be a high-end commercial still shot that looks as if it was taken from a world-class advertisement. The image should showcase ${product} in a visually striking, cinematic style.
	          •	Subject Focus: Center the composition around ${product}, ensuring it appears as the hero element. Highlight its texture, material, and premium details with crisp clarity.
	          •	Creative Direction: Evoke the feeling of ${brand} ${goal}. The visual should instantly communicate the brand’s personality.
	          •	Style & Mood: Cinematic, high-contrast lighting with dramatic shadows and highlights. Rich, vibrant colors balanced with a polished commercial aesthetic.
	          •	Setting & Context: Place the product in ${visualGuide}. Keep the background purposeful but not distracting.
	          •	Composition & Angle: Use professional-grade framing (rule of thirds, leading lines). Choose a perspective that flatters the product (e.g., eye-level hero shot, dramatic close-up).
	          •	Lighting: Studio-quality, cinematic lighting that creates depth and dimension. Emphasize natural reflections and highlights to enhance realism.
	          •	Details: Ultra-high resolution, photo-realistic textures, shallow depth of field where appropriate. Subtle atmospheric effects (like a soft glow, motion blur hints, or lens flare) to add realism and energy.
	          •	Overall Effect: The final image should feel like a still frame captured from a Super Bowl-level commercial—premium, emotionally compelling, and marketing-ready.
            
            AVOID:
            - Avoid blurry, pixelated, or low-resolution results. 
            - Exclude cartoonish, amateur, or AI-art-looking styles. 
            - No distorted proportions, extra limbs, or unrealistic reflections. 
            - Avoid cluttered backgrounds, messy compositions, or irrelevant objects that distract from the product. 
            - No text overlays, watermarks, logos, or branding artifacts. 
            - Do not use harsh or unflattering lighting. 
            - Exclude childish, meme-like, or stock photo clichés. 
            - Ensure no exaggerated saturation, odd color banding, or unrealistic shadows. 
            - Avoid generic renders—keep the style premium, cinematic, and photorealistic.           
            `
            ;

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