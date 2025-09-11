import { BriefIntake } from "./brief-types";

export const systemPrompt = `You are a world-class Chief Marketing Officer and creative strategist with 20+ years of experience at top agencies and brands. You produce marketing briefs that are:

STRATEGIC EXCELLENCE:
- Rooted in deep human insights and behavioral psychology
- Based on rigorous market analysis and competitive intelligence
- Aligned with business objectives and measurable outcomes
- Grounded in data-driven decision making

CREATIVE CATALYST:
- Clear, compelling big idea that cuts through the noise
- Rich creative territories that inspire breakthrough work
- Emotionally resonant messaging that drives action
- Distinctive brand voice that builds recognition

EXECUTION-READY:
- Detailed channel strategy with platform-specific guidance
- Complete customer journey mapping with touchpoint optimization
- Comprehensive testing framework with clear hypotheses
- Robust KPI framework with leading and lagging indicators

CRITICAL: Your response MUST include ALL the original input data from the user PLUS the generated outputs. Do not omit any of the user's input data.

RULES FOR WORLD-CLASS BRIEFS:
- Be strategically rigorous yet creatively inspiring
- Use the user's input exactly; do not fabricate data
- Output MUST conform to the provided JSON Schema; no extra fields
- Avoid generic platitudes; prefer specific, actionable guidance
- Include the complete structure: project, brand, objective, audience, insight, message, tone_style, channels_formats, AND outputs
- The outputs section should contain: exec_summary, big_idea, creative_territories, journey_map, test_plan, and kpi_dashboard
- Transform the user's input data into the expected output format while preserving all information
- Make every section actionable and inspiring for creative teams
- Ensure the brief could be handed to any agency and executed immediately
`;

export function userPromptFromIntake(intake: BriefIntake) {
  return `Create a world-class marketing brief based on the following inputs. Transform this raw data into a strategic, execution-ready brief that any agency could implement immediately.

[PROJECT CONTEXT]
Name: ${intake.project?.name}
Core idea: ${intake.project?.core_idea}
Business context: ${intake.project?.business_context}
Timeline: ${intake.project?.timeline}

[BRAND FOUNDATION]
Name: ${intake.brand?.name}
Description: ${intake.brand?.description}
Values: ${(intake.brand?.values || []).join(", ")}
Personality: ${intake.brand?.personality}
Positioning: ${intake.brand?.positioning}

[PRODUCT/SERVICE]
Name: ${intake.product?.name}
Description: ${intake.product?.description}
Features: ${(intake.product?.features || []).join(", ")}
Benefits: ${(intake.product?.benefits || []).join(", ")}
USP: ${intake.product?.unique_selling_proposition}

[TARGET AUDIENCE INSIGHTS]
Demographics: ${intake.audience?.primary_demographics}
Psychographics: ${intake.audience?.psychographics}
Pain points: ${(intake.audience?.pain_points || []).join(", ")}
Motivations: ${(intake.audience?.motivations || []).join(", ")}
Behaviors: ${(intake.audience?.behaviors || []).join(", ")}
Media consumption: ${(intake.audience?.media_consumption || []).join(", ")}

[STRATEGIC OBJECTIVES]
Intent: ${intake.objectives?.intent}
SMART targets: ${(intake.objectives?.smart_targets || []).join(", ")}
Success metrics: ${(intake.objectives?.success_metrics || []).join(", ")}
KPIs: ${(intake.objectives?.kpis || []).join(", ")}

[CREATIVE DIRECTION]
Trend connection: ${intake.creative_spine?.trend_connection}
Visual direction: ${intake.creative_spine?.visual_direction}

[CHANNEL STRATEGY]
Platforms: ${(intake.channels_formats?.platforms || []).join(", ")}
Formats: ${(intake.channels_formats?.formats || []).join(", ")}
Creative constraints: ${(intake.channels_formats?.creative_constraints || []).join(", ")}
Technical requirements: ${(intake.channels_formats?.technical_requirements || []).join(", ")}

[BUDGET & GUARDRAILS]
Budget amount: ${intake.budget_guardrails?.budget_amount}
Budget allocation: ${intake.budget_guardrails?.budget_allocation}
Must include: ${(intake.budget_guardrails?.must_include || []).join(", ")}
Restrictions: ${(intake.budget_guardrails?.restrictions || []).join(", ")}
Compliance requirements: ${(intake.budget_guardrails?.compliance_requirements || []).join(", ")}

[GENERATION REQUIREMENTS]
Transform this input into a comprehensive marketing brief that includes:

1. EXECUTIVE SUMMARY: Strategic overview that captures the essence and opportunity
2. BIG IDEA: A single, compelling creative concept that drives all execution
3. STRATEGIC INSIGHT: Deep human insight that unlocks the creative strategy
4. CREATIVE TERRITORIES: 3-5 distinct creative directions with hooks, visual direction, and target emotions
5. CUSTOMER JOURNEY MAP: Complete funnel mapping with stage-specific messaging, assets, touchpoints, and success metrics
6. TEST PLAN: 2-3 testable hypotheses with clear variants, success criteria, and timelines
7. KPI DASHBOARD: Comprehensive measurement framework with targets, timeframes, measurement methods, and baselines
8. COMPETITIVE ANALYSIS: Key competitors, competitive advantage, market positioning, and differentiation strategy
9. CHANNEL STRATEGY: Primary channels, objectives, budget allocation, and success metrics

Make this brief actionable, inspiring, and ready for immediate execution by creative teams. Each section should provide specific, testable guidance that agencies can implement immediately.`;
}
