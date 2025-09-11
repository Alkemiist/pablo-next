// TypeScript interfaces for the new 10-page brief flow
export interface MarketingBrief {
  // Page 1: Project Context
  project: {
    name: string;
    core_idea: string;
    business_context: string;
    timeline: string;
  };
  
  // Page 2: Brand
  brand: {
    name: string;
    description: string;
    values: string[];
    personality: string;
    positioning: string;
  };
  
  // Page 3: Product
  product: {
    name: string;
    description: string;
    features: string[];
    benefits: string[];
    unique_selling_proposition: string;
  };
  
  // Page 4: Target Audience
  audience: {
    primary_demographics: string;
    psychographics: string;
    pain_points: string[];
    motivations: string[];
    behaviors: string[];
    media_consumption: string[];
  };
  
  // Page 5: Objectives & Success
  objectives: {
    intent: string;
    smart_targets: string[];
    success_metrics: string[];
    kpis: string[];
  };
  
  // Page 6: Creative Spine
  creative_spine: {
    trend_connection: string;
    creative_references: File[];
    mood_boards: File[];
    visual_direction: string;
  };
  
  // Page 7: Channels & Formats
  channels_formats: {
    platforms: string[];
    formats: string[];
    creative_constraints: string[];
    technical_requirements: string[];
  };
  
  // Page 8: Budget & Guardrails
  budget_guardrails: {
    budget_amount: string;
    budget_allocation: string;
    must_include: string[];
    restrictions: string[];
    compliance_requirements: string[];
  };
  
  // Generated outputs
  outputs: {
    exec_summary: string;
    big_idea: string;
    strategic_insight: string;
    creative_territories: CreativeTerritory[];
    journey_map: JourneyStage[];
    test_plan?: TestHypothesis[];
    kpi_dashboard?: KPIRow[];
    competitive_analysis?: CompetitiveAnalysis;
    channel_strategy?: ChannelStrategy;
  };
}

export interface CreativeTerritory {
  name: string;
  description: string;
  example_hook?: string;
  visual_direction?: string;
  target_emotion?: string;
}

export interface JourneyStage {
  stage: string;
  message: string;
  asset: string;
  kpi?: string;
  touchpoints?: string[];
  success_metrics?: string[];
}

export interface TestHypothesis {
  hypothesis: string;
  variant_a?: string;
  variant_b?: string;
  metric: string;
  success_criteria?: string;
  timeline?: string;
}

export interface KPIRow {
  kpi: string;
  target: string;
  timeframe?: string;
  measurement_method?: string;
  baseline?: string;
}

export interface CompetitiveAnalysis {
  key_competitors: string[];
  competitive_advantage: string;
  market_positioning: string;
  differentiation_strategy: string;
}

export interface ChannelStrategy {
  primary_channels: string[];
  channel_objectives: string[];
  budget_allocation: string;
  success_metrics: string[];
}

// Input type for the new 10-page brief generation
export interface BriefIntake {
  // Page 1: Project Context
  project?: {
    name?: string;
    core_idea?: string;
    business_context?: string;
    timeline?: string;
  };
  
  // Page 2: Brand
  brand?: {
    name?: string;
    description?: string;
    values?: string[];
    personality?: string;
    positioning?: string;
  };
  
  // Page 3: Product
  product?: {
    name?: string;
    description?: string;
    features?: string[];
    benefits?: string[];
    unique_selling_proposition?: string;
  };
  
  // Page 4: Target Audience
  audience?: {
    primary_demographics?: string;
    psychographics?: string;
    pain_points?: string[];
    motivations?: string[];
    behaviors?: string[];
    media_consumption?: string[];
  };
  
  // Page 5: Objectives & Success
  objectives?: {
    intent?: string;
    smart_targets?: string[];
    success_metrics?: string[];
    kpis?: string[];
  };
  
  // Page 6: Creative Spine
  creative_spine?: {
    trend_connection?: string;
    creative_references?: File[];
    mood_boards?: File[];
    visual_direction?: string;
  };
  
  // Page 7: Channels & Formats
  channels_formats?: {
    platforms?: string[];
    formats?: string[];
    creative_constraints?: string[];
    technical_requirements?: string[];
  };
  
  // Page 8: Budget & Guardrails
  budget_guardrails?: {
    budget_amount?: string;
    budget_allocation?: string;
    must_include?: string[];
    restrictions?: string[];
    compliance_requirements?: string[];
  };
}
