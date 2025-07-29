import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { type, tactic, brand, product, persona, goal, visualGuide } = await request.json();

    if (!type || !tactic || !brand || !product || !persona || !goal || !visualGuide) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create specialized prompts for each content type
    const prompts = {
      'audience-journey': `You are a customer journey mapping expert. Create a detailed audience journey map for:

Campaign: ${brand} ${product} - ${tactic.title}
Target Audience: ${persona}
Tactic: ${tactic.title}
Core Message: ${tactic.coreMessage}
Goal: ${tactic.goal}
Platform: ${tactic.platform}
Why It Works: ${tactic.whyItWorks}
Visual Guide: ${visualGuide}

Create a comprehensive audience journey with 3 stages (Awareness, Engagement, Conversion). For each stage, provide:
- Realistic touchpoints specific to this tactic and platform
- Authentic emotions the persona would feel
- Specific actions they would take
- Real barriers they might face

Also include 4 key insights and 4 optimization opportunities that are genuinely relevant to this specific tactic and audience.

Return as JSON with this exact structure:
{
  "campaign": "Campaign name",
  "targetAudience": "Target audience",
  "stages": [
    {
      "stage": "Awareness",
      "description": "Stage description",
      "touchpoints": ["touchpoint1", "touchpoint2", "touchpoint3", "touchpoint4"],
      "emotions": ["emotion1", "emotion2", "emotion3"],
      "actions": ["action1", "action2", "action3"],
      "barriers": ["barrier1", "barrier2", "barrier3"]
    }
    // ... similar for Engagement and Conversion
  ],
  "keyInsights": ["insight1", "insight2", "insight3", "insight4"],
  "optimizationOpportunities": ["opportunity1", "opportunity2", "opportunity3", "opportunity4"]
}`,

      'social-post': `You are a social media strategist. Create platform-specific social media posts for:

Campaign: ${brand} ${product} - ${tactic.title}
Tactic Details: ${tactic.oneLinerSummary}
Core Message: ${tactic.coreMessage}
Goal: ${tactic.goal}
Platform: ${tactic.platform}
Why It Works: ${tactic.whyItWorks}
Target Persona: ${persona}
Visual Guide: ${visualGuide}

Create authentic, engaging social media content for Instagram, Twitter, and LinkedIn. Each post should:
- Be tailored to the platform's unique style and audience
- Incorporate the specific tactic and core message naturally
- Feel genuine, not overly promotional
- Include platform-appropriate hashtags and CTAs
- Reflect the brand voice and visual guide

Return as JSON with this structure:
{
  "campaign": "Campaign name",
  "platforms": [
    {
      "platform": "Instagram",
      "format": "Feed Post",
      "caption": "Engaging caption with line breaks and emojis",
      "cta": "Clear call to action",
      "bestTimes": "Optimal posting times",
      "considerations": "Platform-specific considerations"
    }
    // ... similar for Twitter and LinkedIn
  ],
  "contentPillars": ["pillar1", "pillar2", "pillar3", "pillar4"],
  "engagementStrategy": ["strategy1", "strategy2", "strategy3", "strategy4"]
}`,

      'caption-pack': `You are a copywriting expert specializing in social media captions. Create 5 distinct caption variations for:

Campaign: ${brand} ${product} - ${tactic.title}
Concept: ${tactic.oneLinerSummary}
Core Message: ${tactic.coreMessage}
Goal: ${tactic.goal}
Why It Works: ${tactic.whyItWorks}
Target Persona: ${persona}
Brand: ${brand}
Product: ${product}

Create 5 unique caption styles:
1. Direct & Confident - Authoritative, results-focused
2. Story-Driven - Narrative, emotional connection
3. Question-Led - Thought-provoking, engaging
4. Social Proof - Trust-building, community-focused
5. Urgent & Exclusive - FOMO, premium positioning

Each caption should be authentic, engaging, and naturally incorporate the tactic. Make them feel distinctly different from each other.

Return as JSON:
{
  "campaign": "Campaign name",
  "concept": "Main concept",
  "variations": [
    {
      "style": "Direct & Confident",
      "caption": "Full caption with emojis and hashtags",
      "tone": "Description of tone",
      "bestFor": "When to use this style"
    }
    // ... 4 more variations
  ],
  "abTestingGuide": ["guide1", "guide2", "guide3", "guide4"],
  "performanceMetrics": ["metric1", "metric2", "metric3", "metric4"]
}`,

      'blog-outline': `You are a content strategist and SEO expert. Create a comprehensive blog outline for:

Topic: ${tactic.title} - ${tactic.oneLinerSummary}
Brand: ${brand}
Product: ${product}
Target Audience: ${persona}
Goal: ${tactic.goal}
Core Message: ${tactic.coreMessage}
Why It Works: ${tactic.whyItWorks}
Platform Context: ${tactic.platform}

Create a detailed blog outline with:
- Compelling title and subtitle
- 5-6 main sections with specific content points
- Word count recommendations
- SEO strategy with relevant keywords
- Content upgrades that would provide value

Make this genuinely helpful and specific to the tactic and audience.

Return as JSON:
{
  "title": "Compelling blog title",
  "subtitle": "Engaging subtitle",
  "outline": [
    {
      "section": "Section name",
      "wordCount": "Word count range",
      "content": ["point1", "point2", "point3", "point4"]
    }
    // ... more sections
  ],
  "totalWordCount": "Total word count range",
  "seoStrategy": {
    "primaryKeyword": "Main keyword",
    "secondaryKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
    "metaDescription": "SEO meta description"
  },
  "contentUpgrades": ["upgrade1", "upgrade2", "upgrade3", "upgrade4"]
}`,

      'email-campaign': `You are an email marketing expert. Create a strategic email campaign for:

Campaign: ${brand} ${product} - ${tactic.title}
Objective: ${tactic.goal}
Target Audience: ${persona}
Core Message: ${tactic.coreMessage}
Tactic: ${tactic.oneLinerSummary}
Why It Works: ${tactic.whyItWorks}

Create a 3-email sequence with:
1. Introduction Email - Hook and introduce the concept
2. Value Email - Provide deep value and education
3. Social Proof Email - Share success stories and credibility

Each email should feel personal, valuable, and naturally lead to the next. Include subject lines, preview text, and full email content.

Return as JSON:
{
  "campaignName": "Campaign name",
  "objective": "Main objective",
  "emails": [
    {
      "type": "Introduction Email",
      "subject": "Compelling subject line",
      "preview": "Preview text",
      "content": {
        "greeting": "Personalized greeting",
        "opening": "Engaging opening",
        "problem": "Problem statement",
        "solution": "Solution introduction",
        "cta": "Call to action",
        "ctaButton": "Button text",
        "closing": "Email signature"
      },
      "sendTime": "Optimal send time",
      "expectedOpenRate": "Expected open rate"
    }
    // ... 2 more emails
  ],
  "campaignMetrics": {
    "expectedDeliverability": "Deliverability rate",
    "targetOpenRate": "Open rate target",
    "targetClickRate": "Click rate target",
    "targetConversionRate": "Conversion rate target"
  },
  "followUpStrategy": ["strategy1", "strategy2", "strategy3", "strategy4"]
}`,

      'influencer-brief': `You are an influencer marketing strategist. Create a comprehensive influencer brief for:

Campaign: ${brand} ${product} - ${tactic.title}
Tactic: ${tactic.title}
Core Message: ${tactic.coreMessage}
Goal: ${tactic.goal}
Platform: ${tactic.platform}
Target Audience: ${persona}
Why It Works: ${tactic.whyItWorks}
Visual Guide: ${visualGuide}

Create a detailed brief that includes:
- Clear campaign objectives
- Specific influencer criteria
- Content requirements and guidelines
- Deliverables with timelines
- Brand guidelines
- Compensation structure
- Success metrics

Make this professional and actionable for actual influencer outreach.

Return as JSON:
{
  "campaignName": "Campaign name",
  "briefOverview": "Brief overview",
  "campaignObjectives": ["objective1", "objective2", "objective3", "objective4"],
  "targetInfluencers": {
    "audienceSize": "Audience size requirements",
    "demographics": "Demographic requirements",
    "contentStyle": "Content style preferences",
    "platforms": ["platform1", "platform2"],
    "engagementRate": "Minimum engagement rate"
  },
  "contentRequirements": {
    "keyMessage": "Key message to include",
    "mandatoryElements": ["element1", "element2", "element3", "element4", "element5"],
    "creativeFreedom": ["freedom1", "freedom2", "freedom3", "freedom4"]
  },
  "deliverables": [
    {
      "platform": "Platform name",
      "format": "Content format",
      "specifications": "Specific requirements",
      "timeline": "Delivery timeline",
      "requirements": "Additional requirements"
    }
    // ... more deliverables
  ],
  "brandGuidelines": {
    "messaging": "Messaging guidelines",
    "visualStyle": "Visual style guide",
    "voiceTone": "Voice and tone",
    "doNots": ["dont1", "dont2", "dont3", "dont4"]
  },
  "compensation": {
    "structure": "Compensation structure",
    "baseCompensation": "Base compensation",
    "performanceBonus": "Performance bonus details",
    "longTermPartnership": "Long-term partnership opportunities"
  },
  "successMetrics": ["metric1", "metric2", "metric3", "metric4", "metric5"]
}`,

      'script': `You are a video advertising expert. Create a compelling 30-second ad script for:

Brand: ${brand}
Product: ${product}
Tactic: ${tactic.title}
Core Message: ${tactic.coreMessage}
Target Audience: ${persona}
Goal: ${tactic.goal}
Hook: ${tactic.oneLinerSummary}
Why It Works: ${tactic.whyItWorks}
Platform: ${tactic.platform}

Create a 30-second script with:
- Attention-grabbing hook (0-3 seconds)
- Problem identification (4-8 seconds)
- Solution presentation (9-18 seconds)
- Social proof/credibility (19-23 seconds)
- Strong call-to-action (24-30 seconds)

Include detailed visual descriptions, voiceover, and production notes.

Return as JSON:
{
  "scriptTitle": "Script title",
  "duration": "30 seconds",
  "targetAudience": "Target audience",
  "objective": "Main objective",
  "script": {
    "hook": {
      "timeframe": "0-3 seconds",
      "visual": "Visual description",
      "voiceover": "Voiceover text",
      "note": "Direction note"
    },
    "problem": {
      "timeframe": "4-8 seconds",
      "visual": "Visual description",
      "voiceover": "Voiceover text",
      "note": "Direction note"
    },
    "solution": {
      "timeframe": "9-18 seconds",
      "visual": "Visual description",
      "voiceover": "Voiceover text",
      "note": "Direction note"
    },
    "proof": {
      "timeframe": "19-23 seconds",
      "visual": "Visual description",
      "voiceover": "Voiceover text",
      "note": "Direction note"
    },
    "cta": {
      "timeframe": "24-30 seconds",
      "visual": "Visual description",
      "voiceover": "Voiceover text",
      "note": "Direction note"
    }
  },
  "productionNotes": {
    "tone": "Overall tone",
    "pacing": "Pacing notes",
    "music": "Music style",
    "textOverlay": ["text1", "text2", "text3"],
    "voiceoverStyle": "Voiceover style"
  },
  "technicalSpecs": {
    "format": "Video format",
    "resolution": "Resolution specs",
    "audioLevels": "Audio level specifications",
    "colorGrading": "Color grading notes",
    "brandElements": ["element1", "element2", "element3"]
  },
  "callToAction": {
    "primary": "Primary CTA",
    "secondary": "Secondary CTA",
    "urgency": "Urgency element",
    "valueProposition": "Value proposition"
  },
  "targetPlatforms": ["platform1", "platform2", "platform3", "platform4", "platform5"],
  "measurableGoals": ["goal1", "goal2", "goal3", "goal4"]
}`,

      'evergreen-plan': `You are a content strategy expert. Create a comprehensive evergreen content plan for:

Brand: ${brand}
Product: ${product}
Tactic: ${tactic.title}
Core Message: ${tactic.coreMessage}
Target Audience: ${persona}
Goal: ${tactic.goal}
Platform: ${tactic.platform}
Why It Works: ${tactic.whyItWorks}
Visual Guide: ${visualGuide}

Create a sustainable content strategy with:
- Multiple content series with different frequencies
- Content calendar recommendations
- Repurposing strategies
- Engagement mechanics
- Success metrics
- Resource requirements

Make this actionable and sustainable for long-term execution.

Return as JSON:
{
  "planName": "Plan name",
  "conceptOverview": "Overview of the strategy",
  "contentSeries": [
    {
      "seriesName": "Series name",
      "frequency": "Publishing frequency",
      "duration": "Duration",
      "description": "Series description",
      "contentTypes": ["type1", "type2", "type3", "type4"],
      "platforms": ["platform1", "platform2", "platform3"]
    }
    // ... more series
  ],
  "contentCalendar": {
    "week1": "Week 1 focus",
    "week2": "Week 2 focus",
    "week3": "Week 3 focus",
    "week4": "Week 4 focus",
    "notes": "Calendar notes"
  },
  "repurposingStrategy": [
    {
      "original": "Original content type",
      "repurposed": ["repurposed1", "repurposed2", "repurposed3", "repurposed4", "repurposed5"]
    }
    // ... more strategies
  ],
  "engagementMechanics": [
    {
      "type": "Mechanic type",
      "description": "Description",
      "execution": "How to execute",
      "userBenefit": "Benefit to users"
    }
    // ... more mechanics
  ],
  "contentRefresh": {
    "quarterly": ["task1", "task2", "task3", "task4"],
    "annually": ["task1", "task2", "task3", "task4"]
  },
  "successMetrics": ["metric1", "metric2", "metric3", "metric4", "metric5"],
  "resourceRequirements": ["requirement1", "requirement2", "requirement3", "requirement4", "requirement5"]
}`
    };

    const prompt = prompts[type as keyof typeof prompts];
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert marketing strategist and content creator. Generate high-quality, specific, and actionable marketing content based on the provided context. Always return valid JSON that exactly matches the requested structure. Be creative, specific, and authentic - avoid generic marketing speak. Focus on practical, implementable ideas that reflect the specific tactic, brand, and audience provided.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let generatedContent;
    try {
      // Extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedContent = JSON.parse(jsonMatch[0]);
      } else {
        generatedContent = JSON.parse(responseContent);
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid response format from OpenAI');
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      type: type
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}