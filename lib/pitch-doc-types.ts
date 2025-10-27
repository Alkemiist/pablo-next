// TypeScript interfaces for the Pitch Doc creation flow

export interface PitchDocIntake {
  // SECTION 1 — BRAND + PRODUCT CONTEXT
  brand_name: string;
  core_product: string;
  target_audience_archetype: string;
  product_category: string;
  business_outcome: string;
  brand_tone_voice: string;
  creative_guardrails: string;

  // SECTION 2 — OPPORTUNITY INTENT
  core_opportunity: string;
  creative_objective: string;
  strategic_job_to_be_done: string;
  desired_user_action: string;

  // SECTION 3 — AUDIENCE INTELLIGENCE INPUTS
  primary_audience: string;
  secondary_audience?: string;
  audience_optimization_mode: 'strict' | 'adjacent';

  // SECTION 4 — CULTURAL & CONTEXTUAL INPUTS
  cultural_signal?: string;
  timing_context?: string;
  channel_preferences?: string;

  // SECTION 5 — EXPRESSION + CREATIVE DIRECTION INPUTS
  preferred_mediums: string[];
  emotional_tone: string;

  // SECTION 6 — FORECAST + SUCCESS MEASURES
  primary_kpi: string;
  secondary_kpis?: string[];
  historical_data_connected: boolean;

  // SECTION 7 — TACTIC SELECTION
  selected_tactic: string;
  tactic_description: string;
}

export interface GeneratedPitchDoc {
  idea_overview: {
    idea_name: string;
    tagline: string;
    concept_summary: string;
    opus_behavior_overlap_score: number;
    funnel_position: 'Top' | 'Mid' | 'Bottom';
    category_fit: string[];
    brand_target_consumer: string;
    generated_visual_description: string;
    generated_image_url?: string;
  };
  
  audience_intelligence: {
    primary_audience_personas: Array<{
      archetype: string;
      motivations: string[];
      channels: string[];
      psychographic_cluster: string;
      overlap_score: number;
      detailed_description: string;
      pain_points: string[];
      goals: string[];
      media_consumption: string[];
      lifestyle_insights: string[];
    }>;
    behavioral_overlap_visualization: string;
    brand_target_comparison: string;
    data_provenance: {
      sources: string[];
      model_confidence: number;
      audience_size: string;
    };
  };
  
  funnel_position_layer: {
    funnel_stage: 'Top' | 'Mid' | 'Bottom';
    stage_definition: string;
    behavior_triggers: string[];
    recommended_channel_mix: Array<{
      channel: string;
      weight: number;
      rationale: string;
    }>;
    funnel_to_category_fit: string;
  };
  
  cultural_signal_layer: {
    top_cultural_signals: Array<{
      signal: string;
      score: number;
      trajectory: 'Rising' | 'Stable' | 'Declining';
      searchVolume?: number;
      socialMentions?: number;
      trendData?: {
        current: number;
        previous: number;
        change: number;
      };
      keyInsights?: string[];
      sources?: Array<{
        source: string;
        data: string;
        confidence: number;
        timestamp: string;
      }>;
    }>;
    proof_points: string[];
    trend_to_funnel_connection: string;
    narrative_insight: string;
    supporting_news?: Array<{
      title: string;
      url: string;
      source: string;
      publishedDate: string;
      summary: string;
      relevanceScore: number;
      category: string;
    }>;
  };
  
  creative_expression_panel: {
    generated_storyboards: string[];
    suggested_copy_concepts: string[];
    medium_mapping: Array<{
      medium: string;
      funnel_intent: string;
      emotional_arc: string;
      tone: string;
    }>;
    emotional_arc: string;
    stage_fit_tags: string[];
  };
  
  behavior_driven_strategy: {
    behavioral_flow: string;
    motivational_triggers: Array<{
      stage: string;
      triggers: string[];
    }>;
    recommended_channel_weighting: Array<{
      channel: string;
      weight: number;
      reasoning: string;
    }>;
    seasonal_timing: string;
    context_layer: string;
  };
  
  tactic_execution: {
    selected_tactic: string;
    tactic_description: string;
    execution_strategy: string;
    key_components: string[];
    success_metrics: string[];
    timeline: string;
  };
  
  performance_forecast: {
    predicted_lift: {
      reach: string;
      engagement: string;
      conversion: string;
    };
    funnel_specific_forecast: Array<{
      stage: string;
      delta: string;
      confidence: number;
    }>;
    sentiment_prediction: string;
    earned_media_alpha_projection: string;
    confidence_range: {
      min: number;
      max: number;
    };
  };
  
  knowledge_provenance: {
    data_source_cards: Array<{
      source: string;
      type: 'Audience' | 'Category' | 'Cultural' | 'Creative';
      confidence: number;
      last_updated: string;
    }>;
    tribal_knowledge_references: string[];
    timestamp: string;
    model_id: string;
  };
  
  meta: {
    input_summary: string;
    confidence: number;
    notes: string;
    generation_time: string;
  };
}

export interface PitchDocMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generated' | 'published';
  briefId?: string;
}
