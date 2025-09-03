import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { persona } = await request.json();

    if (!persona) {
      return NextResponse.json(
        { error: 'Persona description is required' },
        { status: 400 }
      );
    }

    // AI prompt to generate unique persona traits
    const prompt = `Analyze the following persona description and extract 8 unique, specific traits that define this target audience. Focus on key characteristics, behaviors, values, and lifestyle elements that make this persona distinct.

Persona Description: "${persona}"

Generate exactly 8 traits that are:
1. Specific to this persona (not generic)
2. Actionable and meaningful for marketing
3. Unique characteristics that define this audience
4. Mix of demographic, psychographic, and behavioral traits
5. Professional and concise (2-4 words each)

Return only a JSON array of 8 trait strings, no other text. Example format:
["Urban Lifestyle", "Tech Innovation", "Sustainability Focus", "Social Connection", "Digital Native", "Early Adopter", "Design Aesthetic", "Experience Seeker"]`;

    // Call to OpenAI API (you'll need to add your API key to environment variables)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing strategist who specializes in persona analysis. Generate precise, actionable traits for target audiences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let traits;
    try {
      // Clean up the response and parse as JSON
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      traits = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // Fallback: try to extract traits from text response
      const lines = aiResponse.split('\n').filter(line => line.trim());
      traits = lines.map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim()).slice(0, 8);
    }

    // Ensure we have exactly 8 traits
    if (!Array.isArray(traits) || traits.length === 0) {
      throw new Error('Invalid traits format from AI');
    }

    // Pad with fallback traits if needed
    const fallbackTraits = [
      'Digital Native', 'Experience Seeker', 'Social Connection', 'Innovation Driven',
      'Quality Focused', 'Community Oriented', 'Tech Savvy', 'Lifestyle Driven'
    ];

    while (traits.length < 8) {
      const fallback = fallbackTraits.find(trait => !traits.includes(trait));
      if (fallback) {
        traits.push(fallback);
      } else {
        break;
      }
    }

    return NextResponse.json({
      traits: traits.slice(0, 8),
      success: true
    });

  } catch (error) {
    console.error('Error generating persona traits:', error);
    
    // Fallback traits if AI fails
    const fallbackTraits = [
      'Digital Native', 'Experience Seeker', 'Social Connection', 'Innovation Driven',
      'Quality Focused', 'Community Oriented', 'Tech Savvy', 'Lifestyle Driven'
    ];

    return NextResponse.json({
      traits: fallbackTraits,
      success: false,
      error: 'AI generation failed, using fallback traits'
    });
  }
}
