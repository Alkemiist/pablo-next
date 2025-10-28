import { NextRequest, NextResponse } from 'next/server';

interface GenerateCoreIdeasRequest {
  brand: string;
  product: string;
  persona: string;
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
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCoreIdeasRequest = await request.json();
    const { brand, product, persona, trend, cardIndex, generateSingle } = body;

    // Generate core ideas using AI
    if (generateSingle && cardIndex !== undefined) {
      // Generate a single core idea
      const idea = await generateSingleCoreIdea(brand, product, persona, trend, cardIndex);
      return NextResponse.json({
        success: true,
        ideas: [idea],
      });
    } else {
      // Generate all 4 core ideas
      const ideas = await generateAllCoreIdeas(brand, product, persona, trend);
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
  persona: string,
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

  const prompt = `You are a marketing strategist tasked with creating a groundbreaking marketing core idea. 

CONTEXT:
- Brand: ${brand}
- Product: ${product}
- Target Persona: ${persona}
- Current Trend: ${trend}

Generate ONE insanely good, unique, marketing core idea of type "${ideaType}". This is NOT a specific tactic (like a social campaign or billboard), but rather a CORE MARKETING IDEA that can be translated into ANY tactic (social campaign, billboard, podcast, event, etc.).

The idea should:
1. Be genuinely innovative and fresh
2. Deeply connect the brand/product with the trend and persona
3. Be emotionally compelling
4. Have clear potential for viral/memorable impact
5. Work across multiple marketing channels and tactics

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
    "Example 3: How this could work as a partnership or collaboration"
  ],
  "targetOutcome": "The desired marketing outcome (1-2 sentences)"
}

Be specific, be creative, be strategic. Return ONLY the JSON object, no other text.`;

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
      max_tokens: 1500,
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
  persona: string,
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

