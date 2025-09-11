import { BriefIntake } from "./brief-types";

export const systemPrompt = `You are a world-class Chief Marketing Officer and creative strategist. You produce marketing briefs that are:
- Strategically rigorous (rooted in a sharp human insight)
- Creatively catalytic (clear big idea and rich territories)
- Execution-ready (channels, formats, journey map, KPIs, test plan)

CRITICAL: Your response MUST include ALL the original input data from the user PLUS the generated outputs. Do not omit any of the user's input data.

Rules:
- Be concise but vivid.
- Use the user's input exactly; do not fabricate data.
- Output MUST conform to the provided JSON Schema; no extra fields.
- Avoid generic platitudes; prefer specific, testable guidance.
- Include the complete structure: project, brand, objective, audience, insight, message, tone_style, channels_formats, AND outputs.
- The outputs section should contain: exec_summary, big_idea, creative_territories, journey_map, test_plan, and kpi_dashboard.
- Transform the user's input data into the expected output format while preserving all information.
`;

export function userPromptFromIntake(intake: BriefIntake) {
  // Map your wizard inputs 1:1 to a compact instruction block for the new 10-page flow
  return `\n[PROJECT CONTEXT]\nName: ${intake.project?.name}\nCore idea: ${intake.project?.core_idea}\nBusiness context: ${intake.project?.business_context}\nTimeline: ${intake.project?.timeline}\n\n[BRAND]\nName: ${intake.brand?.name}\nDescription: ${intake.brand?.description}\nValues: ${(intake.brand?.values || []).join(", ")}\nPersonality: ${intake.brand?.personality}\nPositioning: ${intake.brand?.positioning}\n\n[PRODUCT]\nName: ${intake.product?.name}\nDescription: ${intake.product?.description}\nFeatures: ${(intake.product?.features || []).join(", ")}\nBenefits: ${(intake.product?.benefits || []).join(", ")}\nUSP: ${intake.product?.unique_selling_proposition}\n\n[TARGET AUDIENCE]\nDemographics: ${intake.audience?.primary_demographics}\nPsychographics: ${intake.audience?.psychographics}\nPain points: ${(intake.audience?.pain_points || []).join(", ")}\nMotivations: ${(intake.audience?.motivations || []).join(", ")}\nBehaviors: ${(intake.audience?.behaviors || []).join(", ")}\nMedia consumption: ${(intake.audience?.media_consumption || []).join(", ")}\n\n[OBJECTIVES & SUCCESS]\nIntent: ${intake.objectives?.intent}\nSMART targets: ${(intake.objectives?.smart_targets || []).join(", ")}\nSuccess metrics: ${(intake.objectives?.success_metrics || []).join(", ")}\nKPIs: ${(intake.objectives?.kpis || []).join(", ")}\n\n[CREATIVE SPINE]\nTrend connection: ${intake.creative_spine?.trend_connection}\nVisual direction: ${intake.creative_spine?.visual_direction}\n\n[CHANNELS & FORMATS]\nPlatforms: ${(intake.channels_formats?.platforms || []).join(", ")}\nFormats: ${(intake.channels_formats?.formats || []).join(", ")}\nCreative constraints: ${(intake.channels_formats?.creative_constraints || []).join(", ")}\nTechnical requirements: ${(intake.channels_formats?.technical_requirements || []).join(", ")}\n\n[BUDGET & GUARDRAILS]\nBudget amount: ${intake.budget_guardrails?.budget_amount}\nBudget allocation: ${intake.budget_guardrails?.budget_allocation}\nMust include: ${(intake.budget_guardrails?.must_include || []).join(", ")}\nRestrictions: ${(intake.budget_guardrails?.restrictions || []).join(", ")}\nCompliance requirements: ${(intake.budget_guardrails?.compliance_requirements || []).join(", ")}\n\n[DELIVERABLE GUIDANCE]\nGenerate: executive summary; big idea; 3+ creative territories (name, description, hook); journey map across funnel stages; test plan with at least one hypothesis; KPI dashboard rows.\n`;
}
