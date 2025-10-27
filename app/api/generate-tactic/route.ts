import { NextRequest, NextResponse } from 'next/server';
import { loadBrief } from '@/lib/brief-storage';

// Universal Tactic Schema Interface
interface GeneratedTactic {
  tactic_overview: {
    tactic_name: string;
    tactic_type: "Awareness" | "Engagement" | "Conversion" | "Retention" | "Cross-Stage";
    brief_linkage: {
      challenge: string;
      opportunity: string;
      target_audience_summary: string;
      brand_positioning_summary: string;
      creative_hook_or_big_idea: string;
    };
    strategic_role: string;
  };
  executable_idea: {
    core_concept: string;
    execution_premise: string;
    key_mechanism: string;
    unique_angle: string;
    implementation_hook: string;
  };
  concept_and_creative_direction: {
    idea_name: string;
    big_idea_or_theme: string;
    experience_or_execution_concept: string;
    key_creative_assets: string[];
    emotional_hook: string;
  };
  channel_and_audience_integration: {
    primary_channels: string[];
    supporting_channels: string[];
    target_segments: string[];
    customer_journey_entry_points: ("Awareness" | "Consideration" | "Conversion" | "Loyalty")[];
  };
  activation_components: Array<{
    component: string;
    description: string;
    role: "Attract" | "Educate" | "Convert" | "Retain";
    asset_format: string;
  }>;
  channel_plan: Array<{
    channel: string;
    objective: string;
    cadence: string;
    content_type: string;
    budget_allocation_percent: number;
  }>;
  measurement_and_kpis: {
    primary_kpis: string[];
    success_benchmarks: string[];
    measurement_tools: string[];
    testing_plan: string;
  };
  implementation_snapshot: Array<{
    phase: "Pre-Launch" | "Launch" | "Post";
    timeline: string;
    key_actions: string[];
    owners: string[];
  }>;
  compliance_and_risk: {
    regulatory_considerations: string[];
    brand_safety: string[];
    potential_risks: string[];
    mitigation_plan: string[];
  };
  execution_blueprint: Array<{
    step: string;
    description: string;
    owner_role: string;
    dependencies: string[];
  }>;
  meta: {
    input_tactic: string;
    confidence: number;
    notes: string;
  };
}

interface GenerateTacticRequest {
  briefId: string;
  chosenTactic: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTacticRequest = await request.json();
    const { briefId, chosenTactic } = body;

    // Validate input
    if (!briefId || !chosenTactic) {
      return NextResponse.json(
        { error: 'Missing required fields: briefId and chosenTactic' },
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

    // Generate tactic using AI
    const generatedTactic = await generateTacticWithAI(brief.briefData, chosenTactic);

    return NextResponse.json({
      success: true,
      tactic: generatedTactic,
      briefTitle: brief.metadata.title
    });

  } catch (error) {
    console.error('Error generating tactic:', error);
    return NextResponse.json(
      { error: 'Failed to generate tactic' },
      { status: 500 }
    );
  }
}

// Helper function to generate tactic using AI
async function generateTacticWithAI(briefData: any, chosenTactic: string): Promise<GeneratedTactic> {
  // Extract brief data
  const brandName = briefData.document_info?.brand_name || 'Your Brand';
  const projectName = briefData.document_info?.project_name || 'Your Project';
  const challenge = briefData.executive_summary?.challenge || 'meeting your goals';
  const opportunity = briefData.executive_summary?.opportunity || 'growth potential';
  const strategy = briefData.executive_summary?.strategy || 'Engage your audience';
  const expectedOutcome = briefData.executive_summary?.expected_outcome || 'success';

  // Target audience data
  const targetAudience = briefData.strategic_foundation?.target_audience;
  const personaName = targetAudience?.persona_name || 'our audience';
  const personaDescription = targetAudience?.persona_description || 'professional audience';
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

  // Channel strategy data
  const channelStrategy = briefData.channel_strategy;
  const primaryChannels = channelStrategy?.primary_channels || [];
  const channelObjectives = channelStrategy?.channel_objectives || ['engagement'];

  // Measurement framework
  const measurementFramework = briefData.measurement_framework;
  const primaryKpis = measurementFramework?.primary_kpis || ['engagement', 'awareness'];
  const successBenchmarks = measurementFramework?.success_benchmarks || ['10% increase'];

  // Determine tactic type based on chosen tactic
  const tacticType = determineTacticType(chosenTactic);

  // Create the AI prompt
  const prompt = `Generate a detailed tactical plan for the following marketing brief and chosen tactic.

BRIEF CONTEXT:
- Brand: ${brandName}
- Project: ${projectName}
- Challenge: ${challenge}
- Opportunity: ${opportunity}
- Strategy: ${strategy}
- Expected Outcome: ${expectedOutcome}

TARGET AUDIENCE:
- Persona: ${personaName}
- Description: ${personaDescription}
- Pain Points: ${painPoints.join(', ')}
- Motivations: ${motivations.join(', ')}

BRAND POSITIONING:
- Personality: ${brandPersonality}
- Values: ${brandValues.join(', ')}
- USP: ${usp}
- Voice: ${brandVoice}

CREATIVE STRATEGY:
- Big Idea: ${bigIdea}
- Strategic Insight: ${strategicInsight}
- Key Messages: ${keyMessages.join(', ')}

CHANNEL STRATEGY:
- Primary Channels: ${primaryChannels.join(', ')}
- Objectives: ${channelObjectives.join(', ')}

MEASUREMENT:
- Primary KPIs: ${primaryKpis.join(', ')}
- Success Benchmarks: ${successBenchmarks.join(', ')}

CHOSEN TACTIC: ${chosenTactic}
TACTIC TYPE: ${tacticType}

Generate a comprehensive tactical plan that follows the Universal Tactic Schema. Return ONLY valid JSON that conforms to this exact structure:

{
  "tactic_overview": {
    "tactic_name": "string",
    "tactic_type": "Awareness | Engagement | Conversion | Retention | Cross-Stage",
    "brief_linkage": {
      "challenge": "string (≤200 chars)",
      "opportunity": "string (≤200 chars)",
      "target_audience_summary": "string (≤240 chars)",
      "brand_positioning_summary": "string (≤240 chars)",
      "creative_hook_or_big_idea": "string"
    },
    "strategic_role": "string"
  },
  "executable_idea": {
    "core_concept": "string (the main executable idea in 1-2 sentences)",
    "execution_premise": "string (why this approach will work)",
    "key_mechanism": "string (the specific mechanism that drives results)",
    "unique_angle": "string (what makes this different/compelling)",
    "implementation_hook": "string (the specific element that makes it executable)"
  },
  "concept_and_creative_direction": {
    "idea_name": "string",
    "big_idea_or_theme": "string",
    "experience_or_execution_concept": "string",
    "key_creative_assets": ["string"],
    "emotional_hook": "string"
  },
  "channel_and_audience_integration": {
    "primary_channels": ["string"],
    "supporting_channels": ["string"],
    "target_segments": ["string"],
    "customer_journey_entry_points": ["Awareness", "Consideration", "Conversion", "Loyalty"]
  },
  "activation_components": [
    {
      "component": "string",
      "description": "string",
      "role": "Attract | Educate | Convert | Retain",
      "asset_format": "string"
    }
  ],
  "channel_plan": [
    {
      "channel": "string",
      "objective": "string",
      "cadence": "string",
      "content_type": "string",
      "budget_allocation_percent": 0
    }
  ],
  "measurement_and_kpis": {
    "primary_kpis": ["string"],
    "success_benchmarks": ["string"],
    "measurement_tools": ["string"],
    "testing_plan": "string"
  },
  "implementation_snapshot": [
    {
      "phase": "Pre-Launch | Launch | Post",
      "timeline": "string",
      "key_actions": ["string"],
      "owners": ["string"]
    }
  ],
  "compliance_and_risk": {
    "regulatory_considerations": ["string"],
    "brand_safety": ["string"],
    "potential_risks": ["string"],
    "mitigation_plan": ["string"]
  },
  "execution_blueprint": [
    {
      "step": "string",
      "description": "string",
      "owner_role": "string",
      "dependencies": ["string"]
    }
  ],
  "meta": {
    "input_tactic": "string",
    "confidence": 0.0,
    "notes": "string"
  }
}

REQUIREMENTS:
1. All fields must be filled with realistic, specific content
2. The executable_idea section is CRITICAL - focus on creating a clear, actionable concept that teams can immediately understand and implement
3. Core concept should be 1-2 sentences that capture the essence of what will be executed
4. Execution premise should explain WHY this approach will work for the specific audience/challenge
5. Key mechanism should identify the specific driver of results (e.g., "gamification", "social proof", "urgency", "personalization")
6. Unique angle should highlight what makes this different from standard approaches
7. Implementation hook should be the specific element that makes it executable (e.g., "a 30-day challenge", "a personalized quiz", "a limited-time offer")
8. Budget allocations should sum to approximately 100%
9. Include 3-5 activation components minimum
10. Include 2-4 channels in channel plan
11. Include all three implementation phases
12. Confidence should be 0.0-1.0 based on how much brief data was available
13. Notes should mention any assumptions made
14. Return ONLY the JSON object, no other text`;

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
            content: 'You are a strategic marketing expert who creates detailed tactical plans. Always return valid JSON that conforms exactly to the provided schema. Never include any text outside the JSON object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();

    // Parse the JSON response
    const tactic = JSON.parse(generatedContent) as GeneratedTactic;

    // Validate and normalize the response
    return validateAndNormalizeTactic(tactic, chosenTactic);

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Return a fallback tactic if AI fails
    return generateFallbackTactic(briefData, chosenTactic);
  }
}

// Helper function to determine tactic type
function determineTacticType(tactic: string): string {
  const awarenessTactics = ['billboard', 'out-of-home', 'pr', 'press release', 'sponsorship', 'brand stunt', 'experiential'];
  const engagementTactics = ['ugc', 'user-generated', 'interactive', 'live events', 'webinars', 'community', 'ar filters'];
  const conversionTactics = ['paid search', 'sem', 'conversion', 'lead magnet', 'landing page', 'email drip', 'retargeting'];
  const retentionTactics = ['loyalty', 're-engagement', 'anniversary', 'surprise', 'exclusive', 'testimonial'];
  
  const lowerTactic = tactic.toLowerCase();
  
  if (awarenessTactics.some(keyword => lowerTactic.includes(keyword))) {
    return 'Awareness';
  } else if (engagementTactics.some(keyword => lowerTactic.includes(keyword))) {
    return 'Engagement';
  } else if (conversionTactics.some(keyword => lowerTactic.includes(keyword))) {
    return 'Conversion';
  } else if (retentionTactics.some(keyword => lowerTactic.includes(keyword))) {
    return 'Retention';
  } else {
    return 'Cross-Stage';
  }
}

// Helper function to validate and normalize tactic
function validateAndNormalizeTactic(tactic: GeneratedTactic, chosenTactic: string): GeneratedTactic {
  // Ensure all required fields exist
  const normalizedTactic: GeneratedTactic = {
    tactic_overview: {
      tactic_name: tactic.tactic_overview?.tactic_name || chosenTactic,
      tactic_type: tactic.tactic_overview?.tactic_type || 'Cross-Stage',
      brief_linkage: {
        challenge: tactic.tactic_overview?.brief_linkage?.challenge || 'Challenge not specified',
        opportunity: tactic.tactic_overview?.brief_linkage?.opportunity || 'Opportunity not specified',
        target_audience_summary: tactic.tactic_overview?.brief_linkage?.target_audience_summary || 'Target audience not specified',
        brand_positioning_summary: tactic.tactic_overview?.brief_linkage?.brand_positioning_summary || 'Brand positioning not specified',
        creative_hook_or_big_idea: tactic.tactic_overview?.brief_linkage?.creative_hook_or_big_idea || 'Creative hook not specified'
      },
      strategic_role: tactic.tactic_overview?.strategic_role || 'Strategic role not specified'
    },
    executable_idea: {
      core_concept: tactic.executable_idea?.core_concept || 'Core executable concept not specified',
      execution_premise: tactic.executable_idea?.execution_premise || 'Execution premise not specified',
      key_mechanism: tactic.executable_idea?.key_mechanism || 'Key mechanism not specified',
      unique_angle: tactic.executable_idea?.unique_angle || 'Unique angle not specified',
      implementation_hook: tactic.executable_idea?.implementation_hook || 'Implementation hook not specified'
    },
    concept_and_creative_direction: {
      idea_name: tactic.concept_and_creative_direction?.idea_name || 'Tactic Idea Name',
      big_idea_or_theme: tactic.concept_and_creative_direction?.big_idea_or_theme || 'Big idea not specified',
      experience_or_execution_concept: tactic.concept_and_creative_direction?.experience_or_execution_concept || 'Execution concept not specified',
      key_creative_assets: tactic.concept_and_creative_direction?.key_creative_assets || [],
      emotional_hook: tactic.concept_and_creative_direction?.emotional_hook || 'Emotional hook not specified'
    },
    channel_and_audience_integration: {
      primary_channels: tactic.channel_and_audience_integration?.primary_channels || [],
      supporting_channels: tactic.channel_and_audience_integration?.supporting_channels || [],
      target_segments: tactic.channel_and_audience_integration?.target_segments || [],
      customer_journey_entry_points: tactic.channel_and_audience_integration?.customer_journey_entry_points || []
    },
    activation_components: tactic.activation_components || [],
    channel_plan: tactic.channel_plan || [],
    measurement_and_kpis: {
      primary_kpis: tactic.measurement_and_kpis?.primary_kpis || [],
      success_benchmarks: tactic.measurement_and_kpis?.success_benchmarks || [],
      measurement_tools: tactic.measurement_and_kpis?.measurement_tools || [],
      testing_plan: tactic.measurement_and_kpis?.testing_plan || 'Testing plan not specified'
    },
    implementation_snapshot: tactic.implementation_snapshot || [],
    compliance_and_risk: {
      regulatory_considerations: tactic.compliance_and_risk?.regulatory_considerations || [],
      brand_safety: tactic.compliance_and_risk?.brand_safety || [],
      potential_risks: tactic.compliance_and_risk?.potential_risks || [],
      mitigation_plan: tactic.compliance_and_risk?.mitigation_plan || []
    },
    execution_blueprint: tactic.execution_blueprint || [],
    meta: {
      input_tactic: chosenTactic,
      confidence: tactic.meta?.confidence || 0.7,
      notes: tactic.meta?.notes || 'Generated with standard assumptions'
    }
  };

  // Normalize budget allocations to sum to ~100%
  const totalBudget = normalizedTactic.channel_plan.reduce((sum, channel) => sum + (channel.budget_allocation_percent || 0), 0);
  if (totalBudget > 0 && Math.abs(totalBudget - 100) > 10) {
    normalizedTactic.channel_plan.forEach(channel => {
      channel.budget_allocation_percent = Math.round((channel.budget_allocation_percent || 0) * 100 / totalBudget);
    });
  }

  return normalizedTactic;
}

// Fallback tactic generator if AI fails
function generateFallbackTactic(briefData: any, chosenTactic: string): GeneratedTactic {
  const brandName = briefData.document_info?.brand_name || 'Your Brand';
  const challenge = briefData.executive_summary?.challenge || 'meeting your goals';
  const opportunity = briefData.executive_summary?.opportunity || 'growth potential';
  
  return {
    tactic_overview: {
      tactic_name: chosenTactic,
      tactic_type: 'Cross-Stage',
      brief_linkage: {
        challenge: challenge.substring(0, 200),
        opportunity: opportunity.substring(0, 200),
        target_audience_summary: 'Target audience from brief',
        brand_positioning_summary: `${brandName} brand positioning`,
        creative_hook_or_big_idea: 'Creative hook from brief'
      },
      strategic_role: 'Drive awareness and engagement'
    },
    executable_idea: {
      core_concept: 'Core executable concept for this tactic',
      execution_premise: 'Why this approach will work for the target audience',
      key_mechanism: 'The specific mechanism that drives results',
      unique_angle: 'What makes this different from standard approaches',
      implementation_hook: 'The specific element that makes it executable'
    },
    concept_and_creative_direction: {
      idea_name: 'Tactic Idea Name',
      big_idea_or_theme: 'Big idea from brief',
      experience_or_execution_concept: 'Execution concept for this tactic',
      key_creative_assets: ['Creative asset 1', 'Creative asset 2'],
      emotional_hook: 'inspiration'
    },
    channel_and_audience_integration: {
      primary_channels: ['Primary channel'],
      supporting_channels: ['Supporting channel'],
      target_segments: ['Target segment'],
      customer_journey_entry_points: ['Awareness']
    },
    activation_components: [
      {
        component: 'Component 1',
        description: 'Description of component',
        role: 'Attract',
        asset_format: 'Asset format'
      }
    ],
    channel_plan: [
      {
        channel: 'Primary Channel',
        objective: 'Primary objective',
        cadence: 'Daily',
        content_type: 'Content type',
        budget_allocation_percent: 100
      }
    ],
    measurement_and_kpis: {
      primary_kpis: ['Primary KPI'],
      success_benchmarks: ['Success benchmark'],
      measurement_tools: ['Measurement tool'],
      testing_plan: 'A/B testing plan'
    },
    implementation_snapshot: [
      {
        phase: 'Pre-Launch',
        timeline: 'T-4 weeks to T-1 day',
        key_actions: ['Key action 1'],
        owners: ['Owner 1']
      },
      {
        phase: 'Launch',
        timeline: 'T-0 to T+2 weeks',
        key_actions: ['Key action 2'],
        owners: ['Owner 2']
      },
      {
        phase: 'Post',
        timeline: 'T+2 weeks to T+4 weeks',
        key_actions: ['Key action 3'],
        owners: ['Owner 3']
      }
    ],
    compliance_and_risk: {
      regulatory_considerations: ['Regulatory consideration'],
      brand_safety: ['Brand safety measure'],
      potential_risks: ['Potential risk'],
      mitigation_plan: ['Mitigation plan']
    },
    execution_blueprint: [
      {
        step: 'Step 1',
        description: 'Description of step 1',
        owner_role: 'Owner Role 1',
        dependencies: ['Dependency 1']
      },
      {
        step: 'Step 2',
        description: 'Description of step 2',
        owner_role: 'Owner Role 2',
        dependencies: ['Dependency 2']
      }
    ],
    meta: {
      input_tactic: chosenTactic,
      confidence: 0.5,
      notes: 'Fallback tactic generated due to AI service unavailability'
    }
  };
}
