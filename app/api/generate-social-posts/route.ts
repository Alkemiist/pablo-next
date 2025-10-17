import { NextRequest, NextResponse } from 'next/server';
import { loadBrief } from '@/lib/brief-storage';

// Interface for generated social post
interface GeneratedSocialPost {
  id: string;
  copy: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string;
  platform: string;
  aspectRatio: string;
  isLoadingImage?: boolean;
}

// Interface for request body
interface GenerateSocialPostsRequest {
  briefId: string;
  numberOfPosts: number;
  platform: string;
  aspectRatio: string;
  copyLength: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSocialPostsRequest = await request.json();
    const { briefId, numberOfPosts, platform, aspectRatio, copyLength } = body;

    // Validate input
    if (!briefId || !numberOfPosts || !platform || !aspectRatio || !copyLength) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Load the brief data
    const brief = await loadBrief(briefId);
    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    // Generate social posts with AI copy generation
    const generatedPosts: GeneratedSocialPost[] = [];
    
    // Generate posts with AI copy
    for (let i = 0; i < numberOfPosts; i++) {
      const copy = await generatePostCopy(brief.briefData, platform, copyLength, i + 1);
      
      const post: GeneratedSocialPost = {
        id: `post_${Date.now()}_${i}`,
        copy,
        hashtags: generateHashtags(brief.briefData, platform),
        imagePrompt: generateImagePrompt(brief.briefData, aspectRatio, i + 1),
        platform,
        aspectRatio,
        isLoadingImage: true
      };
      
      generatedPosts.push(post);
    }

    // Return posts immediately with loading states
    return NextResponse.json({
      success: true,
      posts: generatedPosts,
      briefTitle: brief.metadata.title
    });

  } catch (error) {
    console.error('Error generating social posts:', error);
    return NextResponse.json(
      { error: 'Failed to generate social posts' },
      { status: 500 }
    );
  }
}

// Helper function to generate post copy using AI
async function generatePostCopy(briefData: any, platform: string, copyLength: string, postNumber: number): Promise<string> {
  // Extract comprehensive data from brief
  const brandName = briefData.document_info?.brand_name || 'Your Brand';
  const projectName = briefData.document_info?.project_name || 'Your Project';
  const strategy = briefData.executive_summary?.strategy || 'Engage your audience';
  const challenge = briefData.executive_summary?.challenge || 'meeting your goals';
  const opportunity = briefData.executive_summary?.opportunity || 'growth potential';
  const expectedOutcome = briefData.executive_summary?.expected_outcome || 'success';
  
  // Target audience data
  const targetAudience = briefData.strategic_foundation?.target_audience;
  const personaName = targetAudience?.persona_name || 'our audience';
  const painPoints = targetAudience?.pain_points || ['challenges'];
  const motivations = targetAudience?.motivations || ['success'];
  
  // Brand positioning data
  const brandPersonality = briefData.brand_positioning?.brand_personality || 'innovative';
  const brandValues = briefData.brand_positioning?.brand_values || ['quality'];
  const usp = briefData.brand_positioning?.unique_selling_proposition || 'unique value';
  const brandVoice = briefData.brand_positioning?.brand_voice || 'professional';
  
  // Creative strategy data
  const bigIdea = briefData.creative_strategy?.big_idea || 'innovation';
  const strategicInsight = briefData.creative_strategy?.strategic_insight || 'key insight';
  const keyMessages = briefData.creative_strategy?.key_messages || ['important message'];

  // Platform-specific tone and style
  const platformStyles = {
    instagram: 'engaging, visual, emoji-rich, conversational, inspiring',
    twitter: 'concise, witty, trending, conversational, punchy',
    linkedin: 'professional, insightful, authoritative, thought-leadership focused',
    tiktok: 'trendy, energetic, relatable, Gen Z friendly, viral potential'
  };

  // Copy length specifications with strict character limits
  const lengthSpecs = {
    short: 'VERY SHORT: Maximum 100 characters total. Be extremely punchy and direct. Use abbreviations if needed.',
    medium: 'MEDIUM: 100-200 characters. Include key message and call-to-action. Be concise but complete.',
    long: 'LONG: 200-300 characters. Full context with detailed explanation. Maximum 300 characters.'
  };

  const prompt = `Generate a unique social media post for ${platform} that is ${platformStyles[platform as keyof typeof platformStyles]}.

Brand Context:
- Brand: ${brandName}
- Project: ${projectName}
- Strategy: ${strategy}
- Challenge: ${challenge}
- Opportunity: ${opportunity}
- Expected Outcome: ${expectedOutcome}

Target Audience:
- Persona: ${personaName}
- Pain Points: ${painPoints.join(', ')}
- Motivations: ${motivations.join(', ')}

Brand Positioning:
- Personality: ${brandPersonality}
- Values: ${brandValues.join(', ')}
- USP: ${usp}
- Voice: ${brandVoice}

Creative Strategy:
- Big Idea: ${bigIdea}
- Strategic Insight: ${strategicInsight}
- Key Messages: ${keyMessages.join(', ')}

Requirements:
- Make it unique and different from typical social media posts
- Include relevant emojis for ${platform}
- Keep it authentic to the brand voice
- Make it engaging and actionable
- Post number: ${postNumber} (make it different from other posts)
- Copy length: ${lengthSpecs[copyLength as keyof typeof lengthSpecs]}
- DO NOT include hashtags in the copy text - hashtags will be added separately
- CRITICAL: STRICT CHARACTER LIMIT - ${copyLength === 'short' ? 'UNDER 100 CHARACTERS' : copyLength === 'medium' ? '100-200 CHARACTERS' : '200-300 CHARACTERS'}
- Count every character including spaces, punctuation, and emojis
- If you exceed the limit, shorten the text immediately

Generate ONE unique post that feels fresh and authentic:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a creative social media copywriter who creates engaging, platform-specific content that feels authentic and unique.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: copyLength === 'short' ? 50 : copyLength === 'medium' ? 100 : 200,
        temperature: 0.9
      })
    });

    if (response.ok) {
      const data = await response.json();
      let copy = data.choices[0]?.message?.content?.trim() || `✨ ${brandName} is transforming ${projectName.toLowerCase()}! ${strategy.toLowerCase()}. What's your take? 👇`;
      
      // Remove hashtags from copy text (they'll be added separately)
      copy = copy.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
      
      // Enforce character limits
      const charLimits = {
        short: 100,
        medium: 200,
        long: 300
      };
      
      const maxChars = charLimits[copyLength as keyof typeof charLimits];
      if (copy.length > maxChars) {
        console.log(`⚠️ Copy exceeded ${maxChars} chars (${copy.length}), truncating...`);
        copy = copy.substring(0, maxChars - 3) + '...';
      }
      
      console.log(`📝 Generated copy (${copy.length}/${maxChars} chars):`, copy);
      
      return copy;
    } else {
      console.error('OpenAI API error:', await response.text());
      let fallbackCopy = `✨ ${brandName} is transforming ${projectName.toLowerCase()}! ${strategy.toLowerCase()}. What's your take? 👇`;
      
      // Enforce character limits on fallback too
      const charLimits = {
        short: 100,
        medium: 200,
        long: 300
      };
      
      const maxChars = charLimits[copyLength as keyof typeof charLimits];
      if (fallbackCopy.length > maxChars) {
        fallbackCopy = fallbackCopy.substring(0, maxChars - 3) + '...';
      }
      
      return fallbackCopy;
    }
  } catch (error) {
    console.error('Error generating AI copy:', error);
    let fallbackCopy = `✨ ${brandName} is transforming ${projectName.toLowerCase()}! ${strategy.toLowerCase()}. What's your take? 👇`;
    
    // Enforce character limits on fallback too
    const charLimits = {
      short: 100,
      medium: 200,
      long: 300
    };
    
    const maxChars = charLimits[copyLength as keyof typeof charLimits];
    if (fallbackCopy.length > maxChars) {
      fallbackCopy = fallbackCopy.substring(0, maxChars - 3) + '...';
    }
    
    return fallbackCopy;
  }
}

// Helper function to generate hashtags
function generateHashtags(briefData: any, platform: string): string[] {
  const brandName = briefData.document_info?.brand_name || 'YourBrand';
  const projectName = briefData.document_info?.project_name || 'YourProject';
  
  // Extract brand values and creative elements for hashtags
  const brandValues = briefData.brand_positioning?.brand_values || ['Innovation'];
  const brandPersonality = briefData.brand_positioning?.brand_personality || 'Creative';
  const bigIdea = briefData.creative_strategy?.big_idea || 'Innovation';
  const targetAudience = briefData.strategic_foundation?.target_audience;
  const personaName = targetAudience?.persona_name || 'Professionals';
  
  // Helper function to create hashtag from text
  const createHashtag = (text: string) => `#${text.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`;
  
  const baseHashtags = [
    createHashtag(brandName),
    createHashtag(projectName),
    createHashtag(brandPersonality),
    createHashtag(bigIdea)
  ];

  // Add brand values as hashtags
  const brandValueHashtags = brandValues.slice(0, 2).map(createHashtag);
  
  const platformHashtags = {
    instagram: ['#Instagram', '#SocialMedia', '#Content', '#Creative', '#Visual'],
    twitter: ['#Twitter', '#SocialMedia', '#Tech', '#Innovation', '#Trending'],
    linkedin: ['#LinkedIn', '#Professional', '#Business', '#Networking', '#Career'],
    tiktok: ['#TikTok', '#Viral', '#Trending', '#GenZ', '#FYP']
  };

  const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.instagram;
  
  // Combine all hashtags and limit to 3 most relevant
  const allHashtags = [...baseHashtags, ...brandValueHashtags, ...platformSpecific];
  return allHashtags.slice(0, 3);
}

// Helper function to generate image prompts
function generateImagePrompt(briefData: any, aspectRatio: string, postNumber: number): string {
  const brandName = briefData.document_info?.brand_name || 'modern brand';
  const projectName = briefData.document_info?.project_name || 'innovative project';
  const visualDirection = briefData.visual_direction?.description || briefData.brand_positioning?.visual_direction || 'modern, clean, professional';
  
  // Extract more visual and brand elements
  const brandPersonality = briefData.brand_positioning?.brand_personality || 'innovative';
  const brandValues = briefData.brand_positioning?.brand_values || ['quality'];
  const bigIdea = briefData.creative_strategy?.big_idea || 'innovation';
  const targetAudience = briefData.strategic_foundation?.target_audience;
  const personaDescription = targetAudience?.persona_description || 'professional audience';
  
  // Extract action-oriented elements from brief
  const strategy = briefData.executive_summary?.strategy || 'engaging experience';
  const challenge = briefData.executive_summary?.challenge || 'meeting goals';
  const opportunity = briefData.executive_summary?.opportunity || 'growth potential';
  const expectedOutcome = briefData.executive_summary?.expected_outcome || 'success';
  
  // Channel strategy for context
  const channelStrategy = briefData.channel_strategy;
  const primaryChannels = channelStrategy?.primary_channels || [];
  const channelObjectives = channelStrategy?.channel_objectives || ['engagement'];
  
  const aspectRatioPrompts = {
    square: 'square format, 1:1 aspect ratio, Instagram feed optimized',
    portrait: 'vertical format, 9:16 aspect ratio, mobile-optimized, story format',
    landscape: 'horizontal format, 16:9 aspect ratio, wide format, desktop optimized',
    story: 'vertical story format, 9:16 aspect ratio, mobile-first, full screen'
  };

  // Helper function to get random brand value
  const getRandomBrandValue = () => brandValues[Math.floor(Math.random() * brandValues.length)];
  const getRandomChannelObjective = () => channelObjectives[Math.floor(Math.random() * channelObjectives.length)];

  // Create highly specific, action-focused prompts that show the product solving real problems
  const prompts = [
    `Professional photographer using ${brandName} ${projectName} camera to capture cinematic footage, ${visualDirection}, ${aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]}, ${strategy.toLowerCase()} in action, high-end production quality, realistic lighting`,
    `${brandName} ${projectName} camera setup on professional film set, ${visualDirection}, ${aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]}, ${challenge.toLowerCase()} being solved, behind-the-scenes documentary style, authentic equipment shots`,
    `Cinematographer achieving ${expectedOutcome.toLowerCase()} with ${brandName} ${projectName}, ${visualDirection}, ${aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]}, ${bigIdea.toLowerCase()} visualization, professional grade equipment, studio lighting`,
    `${brandName} ${projectName} camera capturing ${opportunity.toLowerCase()}, ${visualDirection}, ${aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]}, ${getRandomBrandValue().toLowerCase()} in practice, real-world usage, professional photography`,
    `Dynamic shot of ${brandName} ${projectName} camera in use during ${strategy.toLowerCase()}, ${visualDirection}, ${aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]}, ${bigIdea.toLowerCase()} execution, action-oriented composition, cinematic quality`
  ];

  return prompts[postNumber % prompts.length];
}