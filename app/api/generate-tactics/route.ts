import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Tactic, GenerateTacticsRequest, GenerateTacticsResponse, ErrorResponse } from '@/lib/types/tactics';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

      For each tactic, provide:
      1. A creative title (max 8 words)
      2. The specific platform/medium (e.g., "TikTok Post", "Instagram Reel", "YouTube Short")
      3. A one-liner summary that captures the essence of the tactic (max 15 words)
      4. A full description explaining the tactic in detail (max 4 sentences)
      5. Why this tactic works specifically for this brand/product/persona combination (max 4 sentences)
      6. A descriptive image prompt that would represent this tactic visually (be specific about style, mood, colors, composition). IMPORTANT: Request HYPER-REALISTIC, photographic quality images with natural lighting, sharp details, and professional composition. Avoid cartoon, illustration, or artistic styles.

      Style and output:
      •	Ensure no repetition across tactics—each idea must stand alone.
      •	Prioritize fresh thinking, bold creativity, and channel-native storytelling.
      •	Avoid clichés. Lean into what will get people to stop scrolling and act.

      Each idea must feel like it came from a top-tier agency creative team, ready for presentation to a CMO.

      Format your response as a JSON array with exactly ${numTactics} object${numTactics > 1 ? 's' : ''}, each containing:
      {
        "title": "Campaign-worthy name (max 8 words)",
        "platform": "Platform/Medium (e.g., TikTok Post, IG Reel, YouTube Short)",
        "oneLinerSummary": "Punchy one-liner capturing the creative hook (max 15 words)",
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
      temperature: 0.8,
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
        // Generate actual image using GPT-image-1
        const imageResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: `${tactic.imagePrompt || `Creative marketing visual for: ${tactic.title}`}. IMPORTANT: Create a hyper-realistic, photographic quality image with sharp details, natural lighting, and professional composition. Use cinematic lighting, rich textures, and realistic materials. Avoid cartoon or artistic styles - focus on photorealism.`,
          n: 1,
          size: "1024x1024",
          quality: "high",
        });

        console.log("imageResponse", imageResponse);

        const generatedImageUrl = imageResponse.data[0]?.url;

        formattedTactics.push({
          image: generatedImageUrl || `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+${i + 1}`,
          title: tactic.title || `Tactic ${i + 1}`,
          platform: tactic.platform || "Social Media",
          oneLinerSummary: tactic.oneLinerSummary || `Summary for tactic ${i + 1}`,
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