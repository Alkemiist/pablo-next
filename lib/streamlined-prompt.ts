import { StreamlinedBriefIntake } from "./streamlined-brief-types";

export const streamlinedSystemPrompt = `You are a world-class Chief Marketing Officer with 20+ years of experience at top agencies and Fortune 500 companies. You create comprehensive, execution-ready marketing briefs that transform minimal inputs into complete strategic documents.

Your expertise includes:
- Strategic planning and market analysis
- Brand positioning and creative development
- Channel strategy and media planning
- Customer journey mapping and experience design
- Performance measurement and optimization
- Competitive intelligence and market research

CRITICAL INSTRUCTIONS:
1. Transform the minimal user inputs into a comprehensive marketing brief
2. Intelligently infer missing information based on industry best practices
3. Create a cohesive document that reads like a professional marketing brief
4. Make every section actionable and specific
5. Ensure the brief could be handed to any agency for immediate execution
6. Use your expertise to fill gaps with realistic, strategic insights
7. Output MUST be valid JSON that matches the expected structure exactly

Your response should be a complete marketing brief that includes all sections, even if the user didn't provide specific information for them. Use your expertise to infer and create strategic recommendations.

IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object.`;

export function createStreamlinedPrompt(intake: StreamlinedBriefIntake) {
  return `Create a comprehensive marketing brief based on these minimal inputs. Use your expertise as a CMO to intelligently infer and develop all missing strategic elements.

[USER INPUTS]
Project Name: ${intake.project_name}
Core Idea: ${intake.core_idea}
Business Challenge: ${intake.business_challenge}
Target Audience: ${intake.target_audience}
Budget Range: ${intake.budget_range}
Brand Name: ${intake.brand_name}
Product/Service: ${intake.product_service}
Key Differentiator: ${intake.key_differentiator}
Primary Goal: ${intake.primary_goal}
Platforms: ${intake.platforms}
Timeline: ${intake.timeline}
Must-Have Elements: ${intake.must_have_elements || "None specified"}

[YOUR TASK]
Transform these inputs into a complete marketing brief document that includes:

1. EXECUTIVE SUMMARY: Strategic overview with challenge, opportunity, strategy, and expected outcome
2. STRATEGIC FOUNDATION: Business context, detailed audience analysis, and competitive landscape
3. BRAND POSITIONING: Brand personality, values, USP, voice, and visual direction
4. CREATIVE STRATEGY: Big idea, strategic insight, creative territories, and key messages
5. CHANNEL STRATEGY: Primary channels with objectives, budget allocation, and requirements
6. CUSTOMER JOURNEY: Complete journey mapping across awareness, consideration, conversion, and retention
7. MEASUREMENT FRAMEWORK: KPIs, test plan, and success metrics
8. IMPLEMENTATION: Timeline, milestones, resources, and risk mitigation

Use your expertise to:
- Create a compelling persona name and detailed description that brings the target audience to life
- Infer detailed demographics and psychographics from the audience description
- Identify 3-4 realistic competitors and market positioning
- Develop creative territories that align with the brand and audience
- Create channel strategies appropriate for the budget and timeline
- Design KPIs that match the primary goal
- Build a realistic timeline with key milestones
- Identify potential risks and mitigation strategies

Make this brief comprehensive, strategic, and immediately actionable for any marketing team.

[OUTPUT FORMAT]
Return your response as a valid JSON object with this structure:
{
  "document_info": {
    "title": "Marketing Brief for [Project Name]",
    "project_name": "[Project Name]",
    "brand_name": "[Brand Name]"
  },
  "executive_summary": {
    "challenge": "[Business challenge description]",
    "opportunity": "[Market opportunity identified]",
    "strategy": "[High-level strategy approach]",
    "expected_outcome": "[Expected results]"
  },
  "strategic_foundation": {
    "business_context": "[Detailed business context]",
    "target_audience": {
      "persona_name": "[Creative persona name like 'Tech-Savvy Millennials' or 'Urban Professionals']",
      "persona_description": "[Detailed, engaging persona description that brings the audience to life]",
      "primary_demographics": "[Demographics]",
      "psychographics": "[Psychographics]",
      "pain_points": ["Pain point 1", "Pain point 2"],
      "motivations": ["Motivation 1", "Motivation 2"],
      "media_consumption": ["Platform 1", "Platform 2"]
    },
    "competitive_landscape": {
      "key_competitors": ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4"],
      "competitive_advantage": "[Your advantage]",
      "market_positioning": "[Positioning statement]"
    }
  },
  "brand_positioning": {
    "brand_personality": "[Personality traits]",
    "brand_values": ["Value 1", "Value 2"],
    "unique_selling_proposition": "[USP]",
    "brand_voice": "[Voice description]",
    "visual_direction": "[Visual direction]"
  },
  "creative_strategy": {
    "big_idea": "[Core creative idea]",
    "strategic_insight": "[Key insight]",
    "creative_territories": [
      {
        "name": "Territory 1",
        "description": "Description",
        "example_hook": "Example hook",
        "visual_direction": "Visual direction",
        "target_emotion": "Target emotion"
      }
    ],
    "key_messages": ["Message 1", "Message 2"]
  },
  "channel_strategy": {
    "primary_channels": [
      {
        "channel": "Channel name",
        "objective": "Objective",
        "budget_percentage": "X%",
        "key_metrics": ["Metric 1", "Metric 2"],
        "creative_requirements": ["Requirement 1", "Requirement 2"]
      }
    ],
    "budget_allocation": "Budget breakdown",
    "channel_objectives": ["Objective 1", "Objective 2"]
  },
  "customer_journey": {
    "awareness": {
      "stage": "Awareness",
      "audience_state": "State description",
      "key_message": "Message",
      "touchpoints": ["Touchpoint 1", "Touchpoint 2"],
      "assets_needed": ["Asset 1", "Asset 2"],
      "success_metrics": ["Metric 1", "Metric 2"]
    },
    "consideration": {
      "stage": "Consideration",
      "audience_state": "State description",
      "key_message": "Message",
      "touchpoints": ["Touchpoint 1", "Touchpoint 2"],
      "assets_needed": ["Asset 1", "Asset 2"],
      "success_metrics": ["Metric 1", "Metric 2"]
    },
    "conversion": {
      "stage": "Conversion",
      "audience_state": "State description",
      "key_message": "Message",
      "touchpoints": ["Touchpoint 1", "Touchpoint 2"],
      "assets_needed": ["Asset 1", "Asset 2"],
      "success_metrics": ["Metric 1", "Metric 2"]
    },
    "retention": {
      "stage": "Retention",
      "audience_state": "State description",
      "key_message": "Message",
      "touchpoints": ["Touchpoint 1", "Touchpoint 2"],
      "assets_needed": ["Asset 1", "Asset 2"],
      "success_metrics": ["Metric 1", "Metric 2"]
    }
  },
  "measurement_framework": {
    "primary_kpis": [
      {
        "kpi": "KPI name",
        "target": "Target value",
        "measurement_method": "How to measure",
        "timeframe": "Timeframe",
        "baseline": "Current baseline"
      }
    ],
    "test_plan": [
      {
        "hypothesis": "Test hypothesis",
        "variant_a": "Variant A description",
        "variant_b": "Variant B description",
        "success_metric": "Success metric",
        "timeline": "Test timeline"
      }
    ],
    "success_metrics": ["Metric 1", "Metric 2"]
  },
  "implementation": {
    "timeline": "Implementation timeline",
    "key_milestones": ["Milestone 1", "Milestone 2"],
    "resource_requirements": ["Resource 1", "Resource 2"],
    "risk_mitigation": ["Risk 1", "Risk 2"]
  }
}`;
}
