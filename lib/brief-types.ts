// TypeScript interfaces matching the BriefJsonSchema
export interface MarketingBrief {
  project: {
    title: string;
    launch_window: string;
    owner: string;
    business_context: string;
  };
  objective: {
    smart: string;
    primary_kpis: string[];
    targets?: string;
    learning_goal?: string;
  };
  audience: {
    descriptor: string;
    pain_tension: string;
    current_emotion?: string;
    desired_emotion?: string;
    desired_action: string;
  };
  insight: string;
  brand: {
    role: string;
    positioning?: string;
    competitors?: string[];
  };
  message: {
    smp: string;
    reasons_to_believe: string[];
  };
  tone_style: {
    tone_tags: string[];
    mood_tags?: string[];
    avoid?: string[];
  };
  channels_formats: {
    channels: string[];
    formats: string[];
    constraints?: string[];
  };
  culture_creative?: {
    trends_hashtags?: string[];
    references?: string[];
  };
  budget_legal: {
    budget_tier: "lean" | "moderate" | "big";
    must_include?: string[];
  };
  outputs: {
    exec_summary: string;
    big_idea: string;
    creative_territories: CreativeTerritory[];
    journey_map: JourneyStage[];
    test_plan?: TestHypothesis[];
    kpi_dashboard?: KPIRow[];
  };
}

export interface CreativeTerritory {
  name: string;
  description: string;
  example_hook?: string;
}

export interface JourneyStage {
  stage: string;
  message: string;
  asset: string;
  kpi?: string;
}

export interface TestHypothesis {
  hypothesis: string;
  variant_a?: string;
  variant_b?: string;
  metric: string;
}

export interface KPIRow {
  kpi: string;
  target: string;
  timeframe?: string;
}

// Input type for the brief generation
export interface BriefIntake {
  project?: {
    title?: string;
    launch_window?: string;
    owner?: string;
    business_context?: string;
  };
  objective?: {
    smart?: string;
    primary_kpis?: string[];
    targets?: string;
    learning_goal?: string;
  };
  audience?: {
    descriptor?: string;
    pain_tension?: string;
    current_emotion?: string;
    desired_emotion?: string;
    desired_action?: string;
  };
  insight?: string;
  brand?: {
    role?: string;
    positioning?: string;
    competitors?: string[];
  };
  message?: {
    smp?: string;
    reasons_to_believe?: string[];
  };
  tone_style?: {
    tone_tags?: string[];
    mood_tags?: string[];
    avoid?: string[];
  };
  channels_formats?: {
    channels?: string[];
    formats?: string[];
    constraints?: string[];
  };
  culture_creative?: {
    trends_hashtags?: string[];
    references?: string[];
  };
  budget_legal?: {
    budget_tier?: "lean" | "moderate" | "big";
    must_include?: string[];
  };
}
