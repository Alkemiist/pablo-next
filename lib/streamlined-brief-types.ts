// Streamlined Brief Types - Only Essential Inputs
export interface StreamlinedBriefIntake {
  // Step 1: Strategic Foundation
  project_name: string;
  core_idea: string;
  business_challenge: string;
  target_audience: string;
  budget_range: string;
  
  // Step 2: Brand & Product
  brand_name: string;
  product_service: string;
  key_differentiator: string;
  
  // Step 3: Success & Constraints
  primary_goal: string;
  platforms: string;
  timeline: string;
  must_have_elements: string;
}

// Enhanced Marketing Brief Output - Cohesive Document
export interface MarketingBriefDocument {
  // Document Header
  document_info: {
    title: string;
    generated_date: string;
    project_name: string;
    brand_name: string;
  };
  
  // Executive Summary
  executive_summary: {
    challenge: string;
    opportunity: string;
    strategy: string;
    expected_outcome: string;
  };
  
  // Strategic Foundation
  strategic_foundation: {
    business_context: string;
    target_audience: {
      persona_name: string;
      persona_description: string;
      primary_demographics: string;
      psychographics: string;
      pain_points: string[];
      motivations: string[];
      media_consumption: string[];
    };
    competitive_landscape: {
      key_competitors: string[];
      competitive_advantage: string;
      market_positioning: string;
    };
  };
  
  // Brand & Positioning
  brand_positioning: {
    brand_personality: string;
    brand_values: string[];
    unique_selling_proposition: string;
    brand_voice: string;
    visual_direction: string;
  };
  
  // Creative Strategy
  creative_strategy: {
    big_idea: string;
    strategic_insight: string;
    creative_territories: CreativeTerritory[];
    key_messages: string[];
    tone_and_style: string[];
  };
  
  // Channel Strategy
  channel_strategy: {
    primary_channels: ChannelDetail[];
    budget_allocation: string;
    channel_objectives: string[];
  };
  
  // Customer Journey
  customer_journey: {
    awareness: JourneyStage;
    consideration: JourneyStage;
    conversion: JourneyStage;
    retention: JourneyStage;
  };
  
  // Measurement & Testing
  measurement_framework: {
    primary_kpis: KPIDetail[];
    test_plan: TestHypothesis[];
    success_metrics: string[];
  };
  
  // Implementation
  implementation: {
    timeline: string;
    key_milestones: string[];
    resource_requirements: string[];
    risk_mitigation: string[];
  };
}

export interface CreativeTerritory {
  name: string;
  description: string;
  example_hook: string;
  visual_direction: string;
  target_emotion: string;
}

export interface ChannelDetail {
  channel: string;
  objective: string;
  budget_percentage: string;
  key_metrics: string[];
  creative_requirements: string[];
}

export interface JourneyStage {
  stage: string;
  audience_state: string;
  key_message: string;
  touchpoints: string[];
  assets_needed: string[];
  success_metrics: string[];
}

export interface KPIDetail {
  kpi: string;
  target: string;
  measurement_method: string;
  timeframe: string;
  baseline: string;
}

export interface TestHypothesis {
  hypothesis: string;
  variant_a: string;
  variant_b: string;
  success_metric: string;
  timeline: string;
}
