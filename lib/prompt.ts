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
- Include the complete structure: project, objective, audience, insight, brand, message, tone_style, channels_formats, culture_creative, budget_legal, AND outputs.
- The outputs section should contain: exec_summary, big_idea, creative_territories, journey_map, test_plan, and kpi_dashboard.
`;

export function userPromptFromIntake(intake: BriefIntake) {
  // Map your wizard inputs 1:1 to a compact instruction block
  return `\n[PROJECT]\nTitle: ${intake.project?.title}\nLaunch window: ${intake.project?.launch_window}\nOwner: ${intake.project?.owner}\nBusiness context: ${intake.project?.business_context}\n\n[OBJECTIVE]\nSMART: ${intake.objective?.smart}\nPrimary KPIs: ${(intake.objective?.primary_kpis || []).join(", ")}\nTargets: ${intake.objective?.targets}\nLearning goal: ${intake.objective?.learning_goal}\n\n[AUDIENCE]\nDescriptor: ${intake.audience?.descriptor}\nTension: ${intake.audience?.pain_tension}\nCurrent emotion: ${intake.audience?.current_emotion}\nDesired emotion: ${intake.audience?.desired_emotion}\nDesired action: ${intake.audience?.desired_action}\n\n[INSIGHT]\n${intake.insight}\n\n[BRAND]\nRole: ${intake.brand?.role}\nPositioning: ${intake.brand?.positioning}\nCompetitors: ${(intake.brand?.competitors || []).join(", ")}\n\n[MESSAGE]\nSMP: ${intake.message?.smp}\nReasons to believe: ${(intake.message?.reasons_to_believe || []).join(" | ")}\n\n[TONE]\n${(intake.tone_style?.tone_tags || []).join(", ")} | Mood: ${(intake.tone_style?.mood_tags || []).join(", ")} | Avoid: ${(intake.tone_style?.avoid || []).join(", ")}\n\n[CHANNELS & FORMATS]\nChannels: ${(intake.channels_formats?.channels || []).join(", ")}\nFormats: ${(intake.channels_formats?.formats || []).join(", ")}\nConstraints: ${(intake.channels_formats?.constraints || []).join(" | ")}\n\n[CULTURE]\nTrends/hashtags: ${(intake.culture_creative?.trends_hashtags || []).join(", ")}\nReferences: ${(intake.culture_creative?.references || []).join(", ")}\n\n[BUDGET/LEGAL]\nTier: ${intake.budget_legal?.budget_tier}\nMust include: ${(intake.budget_legal?.must_include || []).join(" | ")}\n\n[DELIVERABLE GUIDANCE]\nGenerate: executive summary; big idea; 3+ creative territories (name, description, hook); journey map across funnel stages; test plan with at least one hypothesis; KPI dashboard rows.\n`;
}
