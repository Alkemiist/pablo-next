import { NextRequest, NextResponse } from 'next/server';

interface GenerateCoreIdeasRequest {
  brand: string;
  product: string;
  persona: string | {
    name: string;
    demographics: string;
    psychographics: string;
    emotionalDrivers: string[];
    valuesAspirations: string[];
    painPoints: string[];
    goalsMotivations: string[];
    mediaConsumption: string[];
    emotionalKeywords: string[];
    desiredTransformation: string;
  };
  trend: string;
  cardIndex?: number;
  generateSingle?: boolean;
}

interface CoreIdeaData {
  title: string;
  description: string;
  coreConcept: string;
  whyItWorks: string;
  emotionalHook: string;
  trendConnection: string;
  keyMechanism: string;
  uniqueAngle: string;
  executionExamples: string[];
  targetOutcome: string;
  imageUrl?: string;
  personaFit: {
    whyThisPersona: string;
    archetype: string;
    motivations: string[];
    channels: string[];
    psychographicCluster: string;
    overlapWithBaseIdea: string;
    keyBehaviors: string[];
    dataProvenance?: {
      sources: string[];
      modelConfidence: string;
      audienceSize: string;
    };
  };
  marketIntelligence: {
    totalAddressableMarket: {
      immediateAudience: string;
      expandedAudience: string;
      potentialReach: string;
      engagementPotential: string;
      conversionPotential: string;
    };
    funnelAlignment: {
      awareness: { score: number; reasoning: string };
      consideration: { score: number; reasoning: string };
      conversion: { score: number; reasoning: string };
      retention: { score: number; reasoning: string };
    };
    tactics: Array<{
      name: string;
      impact: 'low' | 'medium' | 'high' | 'very-high';
      feasibility: 'low' | 'medium' | 'high';
      budget: string;
      expectedROI: string;
    }>;
    channelEffectiveness: Array<{
      channel: string;
      effectiveness: number; // 1-10
      affordability: 'budget' | 'mid' | 'premium';
      audienceAlignment: 'low' | 'medium' | 'high';
    }>;
    timing: {
      optimalLaunchWindow: string;
      trendLifecyclePhase: 'emerging' | 'peak' | 'mature' | 'declining';
      seasonalFit: string;
      urgency: 'low' | 'medium' | 'high';
    };
    competitive: {
      whiteSpaceScore: number; // 1-10
      differentiationStrength: string;
      marketSaturation: 'uncrowded' | 'moderate' | 'crowded';
    };
    psychological: {
      triggers: string[];
      emotionalVsRational: number; // 0-10 where 10 is purely emotional
      persuasionStrength: string;
    };
    virality: {
      shareabilityScore: number; // 1-10
      memePotential: string;
      talkability: string;
      factors: string[];
    };
    confidence: {
      overall: number; // 1-10
      feasibility: number;
      marketReadiness: number;
      trendAlignment: number;
      brandFit: number;
      innovation: number;
    };
    implementationRoadmap: {
      phase1: { name: string; timeline: string; actions: string[]; quickWins: string[] };
      phase2: { name: string; timeline: string; actions: string[]; quickWins: string[] };
      phase3: { name: string; timeline: string; actions: string[]; quickWins: string[] };
    };
    sources: Array<{
      title: string;
      url: string;
      domain: string;
      snippet: string;
      date?: string;
      relevanceScore: number; // 1-10
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCoreIdeasRequest = await request.json();
    const { brand, product, persona, trend, cardIndex, generateSingle } = body;

    // Generate core ideas using AI
    if (generateSingle) {
      // Generate a single core idea
      const idea = await generateSingleCoreIdea(brand, product, persona as any, trend, cardIndex || 0);
      return NextResponse.json({
        success: true,
        ideas: [idea],
      });
    } else {
      // Generate all 4 core ideas
      const ideas = await generateAllCoreIdeas(brand, product, persona as any, trend);
      return NextResponse.json({
        success: true,
        ideas,
      });
    }
  } catch (error) {
    console.error('Error generating core ideas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate core ideas' },
      { status: 500 }
    );
  }
}

async function generateSingleCoreIdea(
  brand: string,
  product: string,
  persona: any,
  trend: string,
  cardIndex: number
): Promise<CoreIdeaData> {
  const ideaTypes = [
    'disruptive innovation',
    'emotional storytelling',
    'cultural participation',
    'behavioral transformation'
  ];

  const ideaType = ideaTypes[cardIndex] || 'innovative marketing';
  
  // Extract persona details
  const personaName = typeof persona === 'string' ? persona : persona.name;
  const personaDetails = typeof persona === 'string' ? '' : `
- Demographics: ${persona.demographics}
- Psychographics: ${persona.psychographics}
- Emotional Drivers: ${persona.emotionalDrivers?.join(', ')}
- Values & Aspirations: ${persona.valuesAspirations?.join(', ')}
- Pain Points: ${persona.painPoints?.join(', ')}
- Goals & Motivations: ${persona.goalsMotivations?.join(', ')}
- Media Consumption: ${persona.mediaConsumption?.join(', ')}
- Emotional Keywords: ${persona.emotionalKeywords?.join(', ')}
- Desired Transformation: ${persona.desiredTransformation}`;

  const prompt = `You are an elite marketing intelligence strategist tasked with creating a groundbreaking marketing core idea with deep persona insights. 

CONTEXT:
- Brand: ${brand}
- Product: ${product}
- Target Persona: ${personaName}
${personaDetails}
- Current Trend: ${trend}

Generate ONE insanely good, unique, marketing core idea of type "${ideaType}". This is NOT a specific tactic (like a social campaign or billboard), but rather a CORE MARKETING IDEA that can be translated into ANY tactic (social campaign, billboard, podcast, event, etc.).

The idea should:
1. Be genuinely innovative and fresh
2. Deeply connect the brand/product with the trend and persona
3. Be emotionally compelling
4. Have clear potential for viral/memorable impact
5. Work across multiple marketing channels and tactics

CRITICAL: You must also provide deep persona intelligence explaining WHY this persona is perfect for this idea. This should read like a high-end intelligence report.

Return ONLY valid JSON with this exact structure:
{
  "title": "A catchy, memorable title for the core idea (3-8 words)",
  "description": "A compelling 1-2 sentence description of the core idea",
  "coreConcept": "The main marketing concept in 2-3 clear sentences",
  "whyItWorks": "Why this idea is compelling and will resonate (2-3 sentences)",
  "emotionalHook": "The specific emotional connection this creates (1-2 sentences)",
  "trendConnection": "How this connects to the current trend (1-2 sentences)",
  "keyMechanism": "The specific mechanism that drives results (e.g., 'challenge', 'revelation', 'transformation', 'belonging')",
  "uniqueAngle": "What makes this different from standard approaches (1-2 sentences)",
  "executionExamples": [
    "Example 1: How this could work as a social media campaign",
    "Example 2: How this could work as an event/experience",
    "Example 3: How this could work as a partnership or collaboration",
    "Example 4: How this could work as a content or influencer activation"
  ],
  "targetOutcome": "The desired marketing outcome (1-2 sentences)",
  "personaFit": {
    "whyThisPersona": "A compelling 2-3 sentence explanation of why this persona is the perfect match for this idea. Make it feel like high-end intelligence - specific, strategic, and compelling.",
    "archetype": "Identify the Jungian or marketing archetype (e.g., 'The Aspirational Creator', 'The Conscious Explorer', 'The Status Seeker') that best describes this persona",
    "motivations": [
      "Primary motivation 1 (one sentence, specific and psychological)",
      "Primary motivation 2",
      "Primary motivation 3"
    ],
    "channels": [
      "Primary marketing channel where this persona is most active and engaged",
      "Secondary channel",
      "Tertiary channel"
    ],
    "psychographicCluster": "Describe the psychographic segment this persona belongs to (e.g., 'Ethical Individualists', 'Status-Driven Achievers') in one clear sentence",
    "overlapWithBaseIdea": "Explain in 2-3 sentences how this persona's core desires, values, and behaviors overlap with the core idea. Make this strategic and specific.",
    "keyBehaviors": [
      "Specific behavior this persona exhibits that makes them receptive to this idea",
      "Second key behavior",
      "Third key behavior"
    ],
    "dataProvenance": {
      "sources": [
        "Market research data",
        "Behavioral analytics",
        "Psychographic segmentation models"
      ],
      "modelConfidence": "High - 85-95% match confidence",
      "audienceSize": "Estimate the addressable market size for this persona-idea combination"
    }
  },
  "marketIntelligence": {
    "totalAddressableMarket": {
      "immediateAudience": "Number + description of core qualified audience (e.g., '250K active lifestyle enthusiasts')",
      "expandedAudience": "Number + description of secondary audience (e.g., '1.2M aspirational millennials')",
      "potentialReach": "Total reachable audience number",
      "engagementPotential": "Expected engagement rate percentage",
      "conversionPotential": "Expected conversion rate percentage"
    },
    "funnelAlignment": {
      "awareness": { "score": 7, "reasoning": "1-2 sentences why this works for awareness stage" },
      "consideration": { "score": 8, "reasoning": "1-2 sentences why this works for consideration stage" },
      "conversion": { "score": 9, "reasoning": "1-2 sentences why this works for conversion stage" },
      "retention": { "score": 6, "reasoning": "1-2 sentences why this works for retention stage" }
    },
    "tactics": [
      { "name": "Social Media Campaign", "impact": "high", "feasibility": "high", "budget": "$25K-$50K", "expectedROI": "3:1" },
      { "name": "Influencer Partnership", "impact": "very-high", "feasibility": "medium", "budget": "$50K-$100K", "expectedROI": "4:1" },
      { "name": "Event Experience", "impact": "high", "feasibility": "low", "budget": "$100K-$200K", "expectedROI": "2:1" }
    ],
    "channelEffectiveness": [
      { "channel": "Instagram", "effectiveness": 9, "affordability": "mid", "audienceAlignment": "high" },
      { "channel": "TikTok", "effectiveness": 8, "affordability": "budget", "audienceAlignment": "high" },
      { "channel": "YouTube", "effectiveness": 7, "affordability": "premium", "audienceAlignment": "medium" }
    ],
    "timing": {
      "optimalLaunchWindow": "Q2 2024 - aligns with trend peak",
      "trendLifecyclePhase": "emerging",
      "seasonalFit": "Best during summer months for this demographic",
      "urgency": "medium"
    },
    "competitive": {
      "whiteSpaceScore": 8,
      "differentiationStrength": "High differentiation in approach and execution",
      "marketSaturation": "uncrowded"
    },
    "psychological": {
      "triggers": ["Social proof", "Scarcity", "Belonging"],
      "emotionalVsRational": 7,
      "persuasionStrength": "Strong emotional appeal with logical foundation"
    },
    "virality": {
      "shareabilityScore": 8,
      "memePotential": "High - relatable and amusing concept",
      "talkability": "Bridges offline and online conversations",
      "factors": ["Surprising twist", "Shareable format", "Relatable experience"]
    },
    "confidence": {
      "overall": 8,
      "feasibility": 7,
      "marketReadiness": 9,
      "trendAlignment": 8,
      "brandFit": 9,
      "innovation": 7
    },
    "implementationRoadmap": {
      "phase1": {
        "name": "Foundation & Testing",
        "timeline": "Weeks 1-4",
        "actions": ["Finalize core concept", "Create test content", "Select pilot channels"],
        "quickWins": ["Social proof collection", "Early adopter engagement"]
      },
      "phase2": {
        "name": "Scale & Amplify",
        "timeline": "Weeks 5-12",
        "actions": ["Expand to all channels", "Launch influencer partnerships", "Scale content production"],
        "quickWins": ["Organic virality", "User-generated content"]
      },
      "phase3": {
        "name": "Optimize & Expand",
        "timeline": "Weeks 13-24",
        "actions": ["Optimize based on data", "Expand to new markets", "Develop long-term partnerships"],
        "quickWins": ["Refine messaging", "Expand audience segments"]
      }
    },
    "sources": [
      {
        "title": "Example title of a research article or study relevant to this idea",
        "url": "https://example.com/article-name",
        "domain": "example.com",
        "snippet": "Brief 1-2 sentence excerpt from the source that validates or supports this idea",
        "date": "2024",
        "relevanceScore": 9
      },
      {
        "title": "Another relevant source title",
        "url": "https://example.com/another-article",
        "domain": "example.com",
        "snippet": "Another brief excerpt supporting the concept",
        "relevanceScore": 8
      }
    ]
  }
}

IMPORTANT: For the sources array, generate 3-5 credible sources that would realistically support this idea. These should be:
- Research reports, industry studies, or major publications
- Format: Include plausible titles, URLs (use recognizable domains like nielsen.com, forrester.com, hbr.org, marketingland.com, statista.com), brief snippets
- Relevance: Sources should directly relate to the trend, persona behaviors, or the core idea itself
- Make them feel authentic and trustworthy

Be specific, be creative, be strategic. Make the persona fit analysis feel like real intelligence that would convince stakeholders to invest in this idea. Return ONLY the JSON object, no other text.`;

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
          content: 'You are a creative marketing strategist. Return ONLY valid JSON that conforms exactly to the provided schema. Never include any text outside the JSON object.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedContent = data.choices[0].message.content.trim();
  const idea = JSON.parse(generatedContent) as CoreIdeaData;

  // Generate image for the core idea
  try {
    const imageUrl = await generateCoreIdeaImage(idea.title, idea.description, brand, product);
    idea.imageUrl = imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    // Continue without image
  }

  return idea;
}

// Helper function to generate image using DALL-E
async function generateCoreIdeaImage(title: string, description: string, brand: string, product: string): Promise<string> {
  try {
    const prompt = `Create a stunning, professional marketing visual concept for: ${title}. ${description}. Brand: ${brand}. Product: ${product}. 

Style requirements:
- Modern, aspirational marketing imagery
- Clean, sophisticated composition with vibrant colors
- Professional advertising quality
- Conveys innovation and creativity
- Eye-catching and memorable
- High-end commercial photography aesthetic
- Focus on the marketing concept and brand essence`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024'
      }),
    });

    if (!response.ok) {
      throw new Error(`DALL-E API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    // Return a placeholder
    return 'https://via.placeholder.com/1792x1024/6366f1/f3f4f6?text=Core+Idea+Visual';
  }
}

async function generateAllCoreIdeas(
  brand: string,
  product: string,
  persona: any,
  trend: string
): Promise<CoreIdeaData[]> {
  // Generate all 4 ideas in parallel
  const ideas = await Promise.all([
    generateSingleCoreIdea(brand, product, persona, trend, 0),
    generateSingleCoreIdea(brand, product, persona, trend, 1),
    generateSingleCoreIdea(brand, product, persona, trend, 2),
    generateSingleCoreIdea(brand, product, persona, trend, 3),
  ]);

  return ideas;
}

