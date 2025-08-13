import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MoodboardRequest, GenerateMoodboardResponse, Moodboard } from '@/lib/types/moodboard';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { brand, product, targetAudience, campaignGoal, industry }: MoodboardRequest = await request.json();

    if (!brand || !product || !targetAudience) {
      return NextResponse.json(
        { error: 'Brand, product, and target audience are required' },
        { status: 400 }
      );
    }

    // Strict JSON instructions to match our interface keys exactly
    const systemPrompt = `You are a world-class creative director and brand strategist.
Return a professional marketing campaign moodboard as strict JSON ONLY (no markdown, no prose),
matching these exact key names and shapes (arrays must be arrays, use lower-case keys as written):
{
  "briefEssentials": {
    "campaignGoal": string,
    "audience": string,
    "keyMessage": string,
    "kpis": string[],
    "channels": string[]
  },
  "brandGuardrails": {
    "logoUse": string[],
    "colors": { "primary": string[], "secondary": string[], "accent": string[] },
    "typography": { "headings": string[], "body": string[], "display": string[] },
    "voiceTone": { "adjectives": string[], "examples": string[] },
    "doDont": { "do": string[], "dont": string[] }
  },
  "creativeDirections": [{
    "name": string,
    "hypothesis": string,
    "adjectives": string[],
    "sampleComps": string[],
    "visualStyle": string
  }],
  "visualSystem": {
    "colorPalettes": [{ "name": string, "colors": string[], "usage": string }],
    "typeStacks": { "heading": string, "body": string, "caption": string },
    "gridLayout": string[],
    "iconography": string[],
    "shapes": string[],
    "textures": string[],
    "lighting": string[],
    "compositionRules": string[]
  },
  "imagery": {
    "photographyRefs": string[],
    "illustrationStyles": string[],
    "stockUgcNotes": string[],
    "diversityRepresentation": string[],
    "usageRights": string[]
  },
  "motionInteraction": {
    "transitions": string[],
    "pacing": string,
    "microInteractions": string[],
    "ar3dNotes": string[],
    "aspectRatios": string[],
    "platformVariations": string[]
  },
  "copyCues": {
    "headlines": string[],
    "taglines": string[],
    "ctaPatterns": string[],
    "voiceExamples": string[]
  },
  "referencesCompetitors": {
    "inspirationLinks": string[],
    "competitorAnalysis": string,
    "differentiationNotes": string
  },
  "accessibilityInclusivity": {
    "contrastTargets": string[],
    "legibilityRules": string[],
    "altTextCues": string[],
    "safeAreaChecks": string[]
  },
  "productionNotes": {
    "exportSpecs": string[],
    "fileNaming": string[],
    "handoffLinks": string[],
    "licensing": string[],
    "riskFlags": string[]
  },
  "governance": {
    "version": string,
    "status": "draft" | "review" | "approved" | "final",
    "approvers": string[],
    "decisionLog": string[],
    "lastUpdated": string
  }
}`;

    const userPrompt = `Generate a professional marketing campaign moodboard for:
    Brand: ${brand}
    Product: ${product}
    Target Audience: ${targetAudience}
    ${campaignGoal ? `Campaign Goal: ${campaignGoal}` : ''}
    ${industry ? `Industry: ${industry}` : ''}
    
    Make this moodboard comprehensive and actionable for marketing professionals. Include specific, practical guidance that can be immediately implemented by designers and marketers.`;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: 'Missing OPENAI_API_KEY', moodboard: null }, { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: 'json_object' },
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse the AI response and ensure it's valid JSON
    let moodboardData: any;
    try {
      moodboardData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return NextResponse.json({ success: false, error: 'AI returned invalid JSON', moodboard: null, raw: process.env.NODE_ENV !== 'production' ? content : undefined }, { status: 500 });
    }

    // Add metadata and ensure all required fields exist
    const nowIso = new Date().toISOString();
    const moodboard: Moodboard = {
      id: `moodboard_${Date.now()}`,
      ...moodboardData,
      // Backfill fields if the model returns slightly different shapes/keys
      briefEssentials: {
        campaignGoal: moodboardData?.briefEssentials?.campaignGoal ?? moodboardData?.brief?.campaignGoal ?? '',
        audience: moodboardData?.briefEssentials?.audience ?? moodboardData?.brief?.audience ?? '',
        keyMessage: moodboardData?.briefEssentials?.keyMessage ?? moodboardData?.brief?.keyMessage ?? '',
        kpis: moodboardData?.briefEssentials?.kpis ?? moodboardData?.briefEssentials?.KPIs ?? moodboardData?.brief?.kpis ?? [],
        channels: moodboardData?.briefEssentials?.channels ?? moodboardData?.brief?.channels ?? [],
      },
      governance: {
        version: moodboardData?.governance?.version ?? moodboardData?.governance?.versionControl ?? 'v1.0',
        status: (moodboardData?.governance?.status ?? 'draft').toLowerCase(),
        approvers: moodboardData?.governance?.approvers ?? [],
        decisionLog: moodboardData?.governance?.decisionLog ?? [],
        lastUpdated: moodboardData?.governance?.lastUpdated ?? nowIso,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const responseData: GenerateMoodboardResponse = {
      success: true,
      moodboard,
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Error generating moodboard:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to generate moodboard',
        moodboard: null
      },
      { status: 500 }
    );
  }
}
