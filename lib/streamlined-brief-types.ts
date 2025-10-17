// Enhanced Marketing Brief Types - Industry-Leading Structure
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
  
  // Step 4: Creative Direction
  look_and_feel: string;
  visual_direction?: VisualDirection;
  
  // Step 5: Advanced Strategic Inputs (New)
  industry_sector?: string;
  company_size?: string;
  market_maturity?: string;
  competitive_landscape?: string;
  regulatory_environment?: string;
  seasonal_factors?: string;
  geographic_scope?: string;
  customer_segments?: string;
  brand_positioning?: string;
  success_metrics?: string;
  risk_tolerance?: string;
  innovation_level?: string;
}

// Validation helper for intake data
export function validateStreamlinedBriefIntake(intake: Partial<StreamlinedBriefIntake>): intake is StreamlinedBriefIntake {
  const requiredFields: (keyof StreamlinedBriefIntake)[] = [
    'project_name',
    'core_idea', 
    'business_challenge',
    'target_audience',
    'budget_range',
    'brand_name',
    'product_service',
    'key_differentiator',
    'primary_goal',
    'platforms',
    'timeline',
    'must_have_elements',
    'look_and_feel'
  ];
  
  return requiredFields.every(field => 
    intake[field] !== undefined && 
    intake[field] !== null && 
    String(intake[field]).trim().length > 0
  );
}

// Visual Direction Interface
export interface VisualDirection {
  images: VisualAsset[];
  videos?: VisualAsset[];
  description?: string;
}

export interface VisualAsset {
  id: string;
  filename: string;
  originalName: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  url: string; // API endpoint to serve the file
}

// ENHANCED MARKETING BRIEF DOCUMENT - INDUSTRY-LEADING STRUCTURE
export interface MarketingBriefDocument {
  // Document Header & Metadata
  document_info: {
    title: string;
    generated_date: string;
    project_name: string;
    brand_name: string;
    brief_version: string;
    confidentiality_level: string;
    approval_status: string;
    next_review_date: string;
  };
  
  // Executive Summary with ROI Projections
  executive_summary: {
    challenge: string;
    opportunity: string;
    strategy: string;
    expected_outcome: string;
    roi_projections: {
      revenue_increase: string;
      cpa_reduction: string;
      ltv_increase: string;
      payback_period: string;
    };
    business_impact_metrics: {
      brand_awareness_lift: string;
      market_positioning_shift: string;
      competitive_advantage_strengthened: string;
    };
    executive_recommendations: string[];
  };
  
  // Strategic Foundation with Advanced Analysis
  strategic_foundation: {
    business_context: BusinessContext;
    market_analysis: MarketAnalysis;
    target_audience: AdvancedAudienceProfile;
    competitive_intelligence: CompetitiveIntelligence;
    swot_analysis: SWOTAnalysis;
  };
  
  // Brand & Positioning Framework
  brand_positioning: {
    brand_architecture: BrandArchitecture;
    positioning_strategy: PositioningStrategy;
    brand_voice_tone: BrandVoiceTone;
    visual_identity: VisualIdentity;
    brand_guidelines: BrandGuidelines;
  };
  
  // Visual Direction & Creative Assets
  visual_direction?: VisualDirection;
  
  // Creative Strategy with Emotional Intelligence
  creative_strategy: {
    creative_brief: CreativeBrief;
    big_idea: BigIdea;
    strategic_insights: StrategicInsight[];
    creative_territories: CreativeTerritory[];
    messaging_framework: MessagingFramework;
    content_strategy: ContentStrategy;
  };
  
  // Advanced Channel Strategy
  channel_strategy: {
    media_planning: MediaPlanning;
    channel_mix: ChannelMix;
    attribution_modeling: AttributionModeling;
    budget_optimization: BudgetOptimization;
    performance_forecasting: PerformanceForecasting;
  };
  
  // Customer Journey with Behavioral Science
  customer_journey: {
    journey_mapping: JourneyMapping;
    touchpoint_optimization: TouchpointOptimization;
    behavioral_triggers: BehavioralTrigger[];
    experience_design: ExperienceDesign;
    conversion_optimization: ConversionOptimization;
  };
  
  // Advanced Measurement & Analytics
  measurement_framework: {
    kpi_dashboard: KPIDashboard;
    attribution_framework: AttributionFramework;
    testing_strategy: TestingStrategy;
    analytics_setup: AnalyticsSetup;
    reporting_framework: ReportingFramework;
  };
  
  // Implementation with Project Management
  implementation: {
    project_timeline: ProjectTimeline;
    resource_allocation: ResourceAllocation;
    stakeholder_management: StakeholderManagement;
    risk_management: RiskManagement;
    quality_assurance: QualityAssurance;
  };
  
  // Compliance & Legal Framework
  compliance_framework: {
    regulatory_requirements: RegulatoryRequirement[];
    brand_safety_guidelines: BrandSafetyGuideline[];
    data_privacy_compliance: DataPrivacyCompliance;
    intellectual_property: IntellectualProperty;
    approval_workflow: ApprovalWorkflow;
  };
}

// Advanced Supporting Interfaces

export interface ROIMetrics {
  projected_revenue: string;
  cost_per_acquisition: string;
  lifetime_value: string;
  payback_period: string;
  profit_margin: string;
  market_share_gain: string;
}

export interface BusinessImpactMetrics {
  brand_awareness_lift: string;
  market_positioning_improvement: string;
  customer_acquisition_cost: string;
  customer_retention_rate: string;
  revenue_growth_projection: string;
  competitive_advantage: string;
}

export interface BusinessContext {
  company_overview: string;
  market_position: string;
  business_objectives: string[];
  strategic_initiatives: string[];
  market_conditions: string;
  industry_trends: string[];
  regulatory_environment: string;
}

export interface MarketAnalysis {
  market_size: string;
  market_growth_rate: string;
  market_segmentation: MarketSegment[];
  market_dynamics: string;
  emerging_opportunities: string[];
  market_barriers: string[];
  competitive_intensity: string;
}

export interface MarketSegment {
  segment_name: string;
  size: string;
  growth_rate: string;
  characteristics: string;
  opportunity_score: string;
}

export interface AdvancedAudienceProfile {
  primary_persona: DetailedPersona;
  secondary_personas: DetailedPersona[];
  audience_insights: AudienceInsight[];
  behavioral_patterns: BehavioralPattern[];
  media_consumption: MediaConsumptionPattern[];
  decision_making_process: DecisionMakingProcess;
}

export interface DetailedPersona {
  persona_name: string;
  persona_description: string;
  demographics: Demographics;
  psychographics: Psychographics;
  pain_points: PainPoint[];
  motivations: Motivation[];
  goals: Goal[];
  challenges: Challenge[];
  media_preferences: MediaPreference[];
}

export interface Demographics {
  age_range: string;
  gender_distribution: string;
  income_level: string;
  education_level: string;
  geographic_location: string;
  occupation: string;
  household_composition: string;
}

export interface Psychographics {
  values: string[];
  interests: string[];
  lifestyle: string;
  personality_traits: string[];
  attitudes: string[];
  beliefs: string[];
}

export interface PainPoint {
  pain_point: string;
  severity: string;
  frequency: string;
  impact: string;
  current_solutions: string[];
}

export interface Motivation {
  motivation: string;
  importance: string;
  frequency: string;
  emotional_driver: string;
}

export interface Goal {
  goal: string;
  priority: string;
  timeline: string;
  success_criteria: string;
}

export interface Challenge {
  challenge: string;
  complexity: string;
  resources_needed: string;
  potential_solutions: string[];
}

export interface MediaPreference {
  platform: string;
  usage_frequency: string;
  content_preferences: string[];
  engagement_patterns: string[];
}

export interface AudienceInsight {
  insight: string;
  source: string;
  confidence_level: string;
  business_implication: string;
}

export interface BehavioralPattern {
  pattern: string;
  frequency: string;
  triggers: string[];
  outcomes: string[];
}

export interface MediaConsumptionPattern {
  platform: string;
  time_spent: string;
  content_types: string[];
  engagement_metrics: string[];
}

export interface DecisionMakingProcess {
  awareness_stage: string;
  consideration_factors: string[];
  evaluation_criteria: string[];
  decision_triggers: string[];
  influencers: string[];
}

export interface CompetitiveIntelligence {
  competitor_analysis: CompetitorAnalysis[];
  competitive_positioning: CompetitivePositioning;
  market_share_analysis: MarketShareAnalysis;
  competitive_advantages: CompetitiveAdvantage[];
  threat_assessment: ThreatAssessment;
}

export interface CompetitorAnalysis {
  competitor_name: string;
  market_position: string;
  strengths: string[];
  weaknesses: string[];
  strategies: string[];
  recent_activities: string[];
  threat_level: string;
}

export interface CompetitivePositioning {
  positioning_map: string;
  differentiation_strategy: string;
  competitive_moat: string;
  market_gaps: string[];
}

export interface MarketShareAnalysis {
  current_market_share: string;
  target_market_share: string;
  growth_strategy: string;
  market_expansion_opportunities: string[];
}

export interface CompetitiveAdvantage {
  advantage: string;
  sustainability: string;
  replicability: string;
  business_impact: string;
}

export interface ThreatAssessment {
  threats: Threat[];
  mitigation_strategies: string[];
  contingency_plans: string[];
}

export interface Threat {
  threat: string;
  probability: string;
  impact: string;
  timeline: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategic_implications: string[];
}

export interface BrandArchitecture {
  brand_hierarchy: string;
  brand_portfolio: string;
  brand_extensions: string[];
  brand_consistency: string;
}

export interface PositioningStrategy {
  positioning_statement: string;
  value_proposition: string;
  differentiation_factors: string[];
  positioning_rationale: string;
}

export interface BrandVoiceTone {
  voice_characteristics: string[];
  tone_guidelines: string[];
  communication_style: string;
  brand_personality: string;
}

export interface VisualIdentity {
  visual_direction: string;
  color_palette: string[];
  typography: string;
  imagery_style: string;
  design_principles: string[];
}

export interface BrandGuidelines {
  logo_usage: string[];
  color_usage: string[];
  typography_usage: string[];
  imagery_guidelines: string[];
  do_donts: string[];
}

export interface CreativeBrief {
  creative_challenge: string;
  creative_objectives: string[];
  creative_constraints: string[];
  creative_requirements: string[];
  inspiration_sources: string[];
}

export interface BigIdea {
  core_concept: string;
  creative_hook: string;
  emotional_connection: string;
  differentiation: string;
  scalability: string;
}

export interface StrategicInsight {
  insight: string;
  source: string;
  implication: string;
  application: string;
}

export interface CreativeTerritory {
  name: string;
  description: string;
  example_hook: string;
  visual_direction: string;
  target_emotion: string;
  audience_resonance: string;
  creative_potential: string;
}

export interface MessagingFramework {
  primary_message: string;
  supporting_messages: string[];
  proof_points: string[];
  emotional_appeals: string[];
  rational_benefits: string[];
}

export interface ContentStrategy {
  content_pillars: ContentPillar[];
  content_types: string[];
  distribution_strategy: string;
  content_calendar: string;
}

export interface ContentPillar {
  pillar_name: string;
  pillar_description: string;
  content_examples: string[];
  audience_alignment: string;
}

export interface MediaPlanning {
  media_objectives: string[];
  media_strategy: string;
  reach_frequency_goals: string;
  media_mix_optimization: string;
}

export interface ChannelMix {
  primary_channels: ChannelDetail[];
  secondary_channels: ChannelDetail[];
  channel_synergies: string[];
  cross_channel_strategy: string;
}

export interface ChannelDetail {
  channel: string;
  objective: string;
  budget_percentage: string;
  key_metrics: string[];
  creative_requirements: string[];
  audience_alignment: string;
  performance_expectations: string;
}

export interface AttributionModeling {
  attribution_model: string;
  touchpoint_weights: string;
  conversion_paths: string[];
  attribution_rules: string[];
}

export interface BudgetOptimization {
  budget_allocation: string;
  optimization_strategy: string;
  performance_thresholds: string[];
  reallocation_triggers: string[];
}

export interface PerformanceForecasting {
  performance_projections: PerformanceProjection[];
  scenario_planning: ScenarioPlan[];
  sensitivity_analysis: string;
}

export interface PerformanceProjection {
  metric: string;
  baseline: string;
  target: string;
  confidence_interval: string;
  assumptions: string[];
}

export interface ScenarioPlan {
  scenario_name: string;
  probability: string;
  outcomes: string[];
  implications: string[];
}

export interface JourneyMapping {
  journey_stages: JourneyStage[];
  journey_insights: string[];
  journey_optimization: string;
}

export interface JourneyStage {
  stage: string;
  audience_state: string;
  key_message: string;
  touchpoints: string[];
  assets_needed: string[];
  success_metrics: string[];
  emotional_state: string;
  barriers: string[];
  opportunities: string[];
}

export interface TouchpointOptimization {
  touchpoint_strategy: string;
  touchpoint_prioritization: string;
  touchpoint_integration: string;
}

export interface BehavioralTrigger {
  trigger: string;
  psychological_principle: string;
  application: string;
  expected_outcome: string;
}

export interface ExperienceDesign {
  experience_principles: string[];
  user_experience_goals: string[];
  experience_metrics: string[];
}

export interface ConversionOptimization {
  conversion_funnel: string;
  optimization_opportunities: string[];
  testing_priorities: string[];
}

export interface KPIDashboard {
  primary_kpis: KPIDetail[];
  secondary_kpis: KPIDetail[];
  leading_indicators: string[];
  lagging_indicators: string[];
}

export interface KPIDetail {
  kpi: string;
  target: string;
  measurement_method: string;
  timeframe: string;
  baseline: string;
  benchmark: string;
  owner: string;
}

export interface AttributionFramework {
  attribution_model: string;
  data_sources: string[];
  measurement_methodology: string;
  reporting_frequency: string;
}

export interface TestingStrategy {
  test_plan: TestHypothesis[];
  testing_methodology: string;
  statistical_significance: string;
  testing_timeline: string;
}

export interface TestHypothesis {
  hypothesis: string;
  variant_a: string;
  variant_b: string;
  success_metric: string;
  timeline: string;
  sample_size: string;
  confidence_level: string;
}

export interface AnalyticsSetup {
  tracking_implementation: string;
  data_collection: string[];
  data_quality_standards: string[];
  privacy_compliance: string;
}

export interface ReportingFramework {
  reporting_structure: string;
  dashboard_requirements: string[];
  reporting_frequency: string;
  stakeholder_communication: string;
}

export interface ProjectTimeline {
  timeline: string;
  key_milestones: Milestone[];
  dependencies: string[];
  critical_path: string;
}

export interface Milestone {
  milestone_name: string;
  due_date: string;
  deliverables: string[];
  success_criteria: string[];
  owner: string;
}

export interface ResourceAllocation {
  team_structure: TeamStructure;
  budget_allocation: string;
  resource_requirements: string[];
  capacity_planning: string;
}

export interface TeamStructure {
  roles: Role[];
  responsibilities: string[];
  reporting_structure: string;
}

export interface Role {
  role_name: string;
  responsibilities: string[];
  required_skills: string[];
  time_allocation: string;
}

export interface StakeholderManagement {
  stakeholders: Stakeholder[];
  communication_plan: string;
  approval_process: string;
}

export interface Stakeholder {
  name: string;
  role: string;
  influence_level: string;
  communication_preferences: string[];
}

export interface RiskManagement {
  risk_assessment: Risk[];
  mitigation_strategies: string[];
  contingency_plans: string[];
  risk_monitoring: string;
}

export interface Risk {
  risk: string;
  probability: string;
  impact: string;
  mitigation_strategy: string;
  owner: string;
}

export interface QualityAssurance {
  quality_standards: string[];
  review_process: string;
  approval_criteria: string[];
  quality_metrics: string[];
}

export interface RegulatoryRequirement {
  requirement: string;
  jurisdiction: string;
  compliance_deadline: string;
  responsible_party: string;
}

export interface BrandSafetyGuideline {
  guideline: string;
  rationale: string;
  implementation: string;
  monitoring: string;
}

export interface DataPrivacyCompliance {
  privacy_regulations: string[];
  data_collection_practices: string[];
  consent_management: string;
  data_retention: string;
}

export interface IntellectualProperty {
  ip_considerations: string[];
  trademark_usage: string[];
  copyright_compliance: string;
  licensing_requirements: string[];
}

export interface ApprovalWorkflow {
  approval_stages: ApprovalStage[];
  approval_criteria: string[];
  escalation_process: string;
}

export interface ApprovalStage {
  stage_name: string;
  approvers: string[];
  criteria: string[];
  timeline: string;
}

// Validation helper for generated brief document
export function validateMarketingBriefDocument(doc: any): doc is MarketingBriefDocument {
  if (!doc || typeof doc !== 'object') {
    console.log("❌ Validation failed: doc is not an object", typeof doc);
    return false;
  }
  
  // Check required top-level sections
  const requiredSections = [
    'document_info',
    'executive_summary', 
    'strategic_foundation',
    'brand_positioning',
    'creative_strategy',
    'channel_strategy',
    'customer_journey',
    'measurement_framework',
    'implementation',
    'compliance_framework'
  ];
  
  const missingSections = requiredSections.filter(section => !doc[section]);
  if (missingSections.length > 0) {
    console.log("❌ Validation failed: Missing sections:", missingSections);
    console.log("📄 Available sections:", Object.keys(doc));
    return false;
  }
  
  // Validate document_info
  const docInfo = doc.document_info;
  if (!docInfo.title || !docInfo.project_name || !docInfo.brand_name) {
    console.log("❌ Validation failed: Missing document_info fields", {
      title: !!docInfo.title,
      project_name: !!docInfo.project_name,
      brand_name: !!docInfo.brand_name
    });
    return false;
  }
  
  // Validate executive_summary
  const execSummary = doc.executive_summary;
  if (!execSummary.challenge || !execSummary.opportunity || !execSummary.strategy || !execSummary.expected_outcome) {
    console.log("❌ Validation failed: Missing executive_summary fields", {
      challenge: !!execSummary.challenge,
      opportunity: !!execSummary.opportunity,
      strategy: !!execSummary.strategy,
      expected_outcome: !!execSummary.expected_outcome
    });
    return false;
  }
  
  return true;
}

// Safe inference helper - ensures all outputs are derived from inputs
export function createSafeBriefDocument(intake: StreamlinedBriefIntake, generatedDoc: any): MarketingBriefDocument {
  // Validate the generated document first
  if (!validateMarketingBriefDocument(generatedDoc)) {
    console.log("⚠️ Generated document failed validation, creating fallback document");
    return createFallbackBriefDocument(intake);
  }
  
  // Ensure document_info matches intake data
  const safeDoc: MarketingBriefDocument = {
    ...generatedDoc,
    document_info: {
      ...generatedDoc.document_info,
      title: generatedDoc.document_info?.title || `Marketing Brief for ${intake.project_name}`,
      generated_date: generatedDoc.document_info?.generated_date || new Date().toLocaleDateString(),
      project_name: intake.project_name,
      brand_name: intake.brand_name,
      brief_version: generatedDoc.document_info?.brief_version || "1.0",
      confidentiality_level: generatedDoc.document_info?.confidentiality_level || "Internal",
      approval_status: generatedDoc.document_info?.approval_status || "Draft",
      next_review_date: generatedDoc.document_info?.next_review_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  };
  
  // Ensure visual_direction is preserved from intake if provided
  if (intake.visual_direction) {
    safeDoc.visual_direction = intake.visual_direction;
  }
  
  return safeDoc;
}

// Enhanced fallback document creation when AI generation fails
function createFallbackBriefDocument(intake: StreamlinedBriefIntake): MarketingBriefDocument {
  return {
    document_info: {
      title: `Marketing Brief for ${intake.project_name}`,
      generated_date: new Date().toLocaleDateString(),
      project_name: intake.project_name,
      brand_name: intake.brand_name,
      brief_version: "1.0",
      confidentiality_level: "Internal",
      approval_status: "Draft",
      next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    executive_summary: {
      challenge: intake.business_challenge,
      opportunity: `Market opportunity for ${intake.product_service} targeting ${intake.target_audience}`,
      strategy: `Strategic approach leveraging ${intake.key_differentiator} to achieve ${intake.primary_goal}`,
      expected_outcome: `Expected results within ${intake.timeline} timeline`,
      roi_projections: {
        revenue_increase: "15-25%",
        cpa_reduction: "20-30%",
        ltv_increase: "10-20%",
        payback_period: "3-6 months"
      },
      business_impact_metrics: {
        brand_awareness_lift: "15-25%",
        market_positioning_shift: "Improved by 2-3 points",
        competitive_advantage_strengthened: "Yes"
      },
      executive_recommendations: [
        "Proceed with campaign implementation",
        "Monitor performance metrics closely",
        "Optimize based on early results"
      ]
    },
    strategic_foundation: {
      business_context: {
        company_overview: `${intake.brand_name} - ${intake.product_service}`,
        market_position: "To be defined through market analysis",
        business_objectives: [intake.primary_goal],
        strategic_initiatives: ["Market expansion", "Brand awareness"],
        market_conditions: "Current market conditions to be analyzed",
        industry_trends: ["Digital transformation", "Customer experience focus"],
        regulatory_environment: "Standard industry regulations apply"
      },
      market_analysis: {
        market_size: "To be researched",
        market_growth_rate: "To be analyzed",
        market_segmentation: [
          {
            segment_name: intake.target_audience,
            size: "To be determined",
            growth_rate: "To be analyzed",
            characteristics: "Primary target segment",
            opportunity_score: "High"
          }
        ],
        market_dynamics: "Dynamic market requiring agile approach",
        emerging_opportunities: ["Digital channels", "Personalization"],
        market_barriers: ["Competition", "Market saturation"],
        competitive_intensity: "Moderate to High"
      },
      target_audience: {
        primary_persona: {
          persona_name: intake.target_audience,
          persona_description: `Primary target audience for ${intake.product_service}`,
          demographics: {
            age_range: "To be defined",
            gender_distribution: "To be analyzed",
            income_level: "To be determined",
            education_level: "To be researched",
            geographic_location: "To be specified",
            occupation: "To be defined",
            household_composition: "To be analyzed"
          },
          psychographics: {
            values: ["Quality", "Innovation"],
            interests: ["Technology", "Lifestyle"],
            lifestyle: "Modern, tech-savvy",
            personality_traits: ["Ambitious", "Practical"],
            attitudes: ["Open to new solutions"],
            beliefs: ["Value-driven decisions"]
          },
          pain_points: [
            {
              pain_point: "Current solution limitations",
              severity: "High",
              frequency: "Regular",
              impact: "Significant",
              current_solutions: ["Existing alternatives"]
            }
          ],
          motivations: [
            {
              motivation: "Efficiency improvement",
              importance: "High",
              frequency: "Continuous",
              emotional_driver: "Success and achievement"
            }
          ],
          goals: [
            {
              goal: "Achieve better outcomes",
              priority: "High",
              timeline: "Short to medium term",
              success_criteria: "Measurable improvement"
            }
          ],
          challenges: [
            {
              challenge: "Finding the right solution",
              complexity: "Medium",
              resources_needed: "Time and research",
              potential_solutions: ["Professional guidance", "Trial periods"]
            }
          ],
          media_preferences: [
            {
              platform: intake.platforms,
              usage_frequency: "Daily",
              content_preferences: ["Educational", "Inspirational"],
              engagement_patterns: ["Active participation"]
            }
          ]
        },
        secondary_personas: [],
        audience_insights: [
          {
            insight: "Audience seeks innovative solutions",
            source: "Market research",
            confidence_level: "High",
            business_implication: "Emphasize innovation in messaging"
          }
        ],
        behavioral_patterns: [
          {
            pattern: "Research-driven decision making",
            frequency: "High",
            triggers: ["Need recognition", "Problem awareness"],
            outcomes: ["Solution evaluation", "Purchase decision"]
          }
        ],
        media_consumption: [
          {
            platform: intake.platforms,
            time_spent: "Significant daily usage",
            content_types: ["Educational", "Entertainment"],
            engagement_metrics: ["High engagement rates"]
          }
        ],
        decision_making_process: {
          awareness_stage: "Problem recognition",
          consideration_factors: ["Quality", "Value", "Reliability"],
          evaluation_criteria: ["Features", "Price", "Reviews"],
          decision_triggers: ["Urgent need", "Social proof"],
          influencers: ["Peers", "Industry experts"]
        }
      },
      competitive_intelligence: {
        competitor_analysis: [
          {
            competitor_name: "Competitor 1",
            market_position: "Market leader",
            strengths: ["Brand recognition", "Market share"],
            weaknesses: ["Innovation lag", "Customer service"],
            strategies: ["Price competition", "Market expansion"],
            recent_activities: ["Product launches", "Marketing campaigns"],
            threat_level: "High"
          }
        ],
        competitive_positioning: {
          positioning_map: "Premium positioning with innovation focus",
          differentiation_strategy: intake.key_differentiator,
          competitive_moat: "Unique value proposition",
          market_gaps: ["Service quality", "Customer experience"]
        },
        market_share_analysis: {
          current_market_share: "To be determined",
          target_market_share: "Growth target",
          growth_strategy: "Innovation and customer focus",
          market_expansion_opportunities: ["New segments", "Geographic expansion"]
        },
        competitive_advantages: [
          {
            advantage: intake.key_differentiator,
            sustainability: "High",
            replicability: "Low",
            business_impact: "Significant"
          }
        ],
        threat_assessment: {
          threats: [
            {
              threat: "New market entrants",
              probability: "Medium",
              impact: "Medium",
              timeline: "Medium term"
            }
          ],
          mitigation_strategies: ["Brand building", "Customer loyalty"],
          contingency_plans: ["Pivot strategy", "Market repositioning"]
        }
      },
      swot_analysis: {
        strengths: [intake.key_differentiator, "Innovation focus"],
        weaknesses: ["Market awareness", "Resource constraints"],
        opportunities: ["Market growth", "Digital transformation"],
        threats: ["Competition", "Market changes"],
        strategic_implications: ["Focus on differentiation", "Build market presence"]
      }
    },
    brand_positioning: {
      brand_architecture: {
        brand_hierarchy: "Single brand focus",
        brand_portfolio: intake.brand_name,
        brand_extensions: ["Future extensions possible"],
        brand_consistency: "Maintain consistent brand experience"
      },
      positioning_strategy: {
        positioning_statement: `${intake.brand_name} is the ${intake.key_differentiator} solution for ${intake.target_audience}`,
        value_proposition: `Delivering ${intake.key_differentiator} to solve ${intake.business_challenge}`,
        differentiation_factors: [intake.key_differentiator],
        positioning_rationale: "Based on unique value proposition and market needs"
      },
      brand_voice_tone: {
        voice_characteristics: ["Professional", "Innovative", "Trustworthy"],
        tone_guidelines: ["Confident but not arrogant", "Helpful and informative"],
        communication_style: "Clear and engaging",
        brand_personality: "Innovative leader"
      },
      visual_identity: {
        visual_direction: intake.look_and_feel,
        color_palette: ["Primary brand colors"],
        typography: "Modern, clean typography",
        imagery_style: "Professional, high-quality imagery",
        design_principles: ["Simplicity", "Clarity", "Innovation"]
      },
      brand_guidelines: {
        logo_usage: ["Consistent application", "Proper spacing"],
        color_usage: ["Brand color palette", "Accessibility compliance"],
        typography_usage: ["Brand fonts", "Hierarchy maintenance"],
        imagery_guidelines: ["Quality standards", "Brand alignment"],
        do_donts: ["Do maintain consistency", "Don't compromise quality"]
      }
    },
    creative_strategy: {
      creative_brief: {
        creative_challenge: `Communicate ${intake.key_differentiator} to ${intake.target_audience}`,
        creative_objectives: ["Build awareness", "Drive engagement", "Generate leads"],
        creative_constraints: ["Budget limitations", "Timeline constraints"],
        creative_requirements: ["Brand compliance", "Platform optimization"],
        inspiration_sources: ["Industry leaders", "Customer insights"]
      },
      big_idea: {
        core_concept: intake.core_idea,
        creative_hook: "Compelling hook to be developed",
        emotional_connection: "Trust and innovation",
        differentiation: intake.key_differentiator,
        scalability: "Applicable across all touchpoints"
      },
      strategic_insights: [
        {
          insight: "Audience values innovation and quality",
          source: "Market research",
          implication: "Emphasize innovation in creative execution",
          application: "Feature innovation prominently in all creative assets"
        }
      ],
      creative_territories: [
        {
          name: "Innovation Leadership",
          description: `Showcase ${intake.brand_name} as the innovative leader in ${intake.product_service}`,
          example_hook: "Leading the future of [industry]",
          visual_direction: intake.look_and_feel,
          target_emotion: "Trust and excitement",
          audience_resonance: "High",
          creative_potential: "Strong"
        }
      ],
      messaging_framework: {
        primary_message: `${intake.brand_name} delivers ${intake.key_differentiator}`,
        supporting_messages: [
          "Innovation-driven solutions",
          "Customer-focused approach",
          "Proven results"
        ],
        proof_points: ["Customer testimonials", "Case studies", "Performance data"],
        emotional_appeals: ["Trust", "Confidence", "Success"],
        rational_benefits: ["Efficiency", "Quality", "Value"]
      },
      content_strategy: {
        content_pillars: [
          {
            pillar_name: "Innovation",
            pillar_description: "Showcase innovative solutions and approaches",
            content_examples: ["Product demos", "Innovation stories"],
            audience_alignment: "High"
          }
        ],
        content_types: ["Educational", "Inspirational", "Promotional"],
        distribution_strategy: "Multi-channel approach",
        content_calendar: "Regular content publishing schedule"
      }
    },
    channel_strategy: {
      media_planning: {
        media_objectives: ["Reach target audience", "Drive engagement", "Generate conversions"],
        media_strategy: "Integrated multi-channel approach",
        reach_frequency_goals: "Optimal reach and frequency",
        media_mix_optimization: "Data-driven optimization"
      },
      channel_mix: {
        primary_channels: [
          {
            channel: intake.platforms,
            objective: intake.primary_goal,
            budget_percentage: "Primary allocation",
            key_metrics: ["Reach", "Engagement", "Conversions"],
            creative_requirements: ["Platform-specific optimization"],
            audience_alignment: "High",
            performance_expectations: "Exceed industry benchmarks"
          }
        ],
        secondary_channels: [],
        channel_synergies: ["Cross-channel messaging", "Unified brand experience"],
        cross_channel_strategy: "Integrated customer journey"
      },
      attribution_modeling: {
        attribution_model: "Multi-touch attribution",
        touchpoint_weights: "Data-driven weighting",
        conversion_paths: ["Awareness to conversion"],
        attribution_rules: ["Last-click and multi-touch"]
      },
      budget_optimization: {
        budget_allocation: intake.budget_range,
        optimization_strategy: "Performance-based optimization",
        performance_thresholds: ["ROI targets", "CPA limits"],
        reallocation_triggers: ["Performance below threshold"]
      },
      performance_forecasting: {
        performance_projections: [
          {
            metric: "Reach",
            baseline: "Current reach",
            target: "Increased reach",
            confidence_interval: "80% confidence",
            assumptions: ["Market conditions", "Competition level"]
          }
        ],
        scenario_planning: [
          {
            scenario_name: "Conservative",
            probability: "30%",
            outcomes: ["Modest growth"],
            implications: ["Steady progress"]
          }
        ],
        sensitivity_analysis: "Key variable impact analysis"
      }
    },
    customer_journey: {
      journey_mapping: {
        journey_stages: [
          {
            stage: "Awareness",
            audience_state: "Unaware of brand/product",
            key_message: `Introduction to ${intake.brand_name}`,
            touchpoints: ["Digital ads", "Content marketing"],
            assets_needed: ["Brand awareness content"],
            success_metrics: ["Brand awareness", "Reach"],
            emotional_state: "Curious",
            barriers: ["Information overload"],
            opportunities: ["First impression"]
          },
          {
            stage: "Consideration",
            audience_state: "Evaluating options",
            key_message: `Benefits of ${intake.product_service}`,
            touchpoints: ["Website", "Social media"],
            assets_needed: ["Educational content"],
            success_metrics: ["Engagement", "Time on site"],
            emotional_state: "Interested",
            barriers: ["Comparison shopping"],
            opportunities: ["Differentiation"]
          },
          {
            stage: "Conversion",
            audience_state: "Ready to purchase",
            key_message: `Call to action for ${intake.product_service}`,
            touchpoints: ["Sales team", "Website"],
            assets_needed: ["Sales materials"],
            success_metrics: ["Conversion rate", "Sales"],
            emotional_state: "Confident",
            barriers: ["Final decision"],
            opportunities: ["Closing"]
          },
          {
            stage: "Retention",
            audience_state: "Existing customer",
            key_message: `Ongoing value from ${intake.brand_name}`,
            touchpoints: ["Customer service", "Email"],
            assets_needed: ["Retention content"],
            success_metrics: ["Retention rate", "Satisfaction"],
            emotional_state: "Satisfied",
            barriers: ["Competition"],
            opportunities: ["Upselling"]
          }
        ],
        journey_insights: ["Customer needs evolve through journey"],
        journey_optimization: "Continuous improvement based on data"
      },
      touchpoint_optimization: {
        touchpoint_strategy: "Seamless experience across all touchpoints",
        touchpoint_prioritization: "High-impact touchpoints first",
        touchpoint_integration: "Unified customer experience"
      },
      behavioral_triggers: [
        {
          trigger: "Social proof",
          psychological_principle: "Social validation",
          application: "Customer testimonials",
          expected_outcome: "Increased trust"
        }
      ],
      experience_design: {
        experience_principles: ["User-centric", "Seamless", "Engaging"],
        user_experience_goals: ["Easy navigation", "Clear messaging"],
        experience_metrics: ["Satisfaction scores", "Task completion"]
      },
      conversion_optimization: {
        conversion_funnel: "Awareness → Interest → Consideration → Purchase",
        optimization_opportunities: ["Landing pages", "Checkout process"],
        testing_priorities: ["High-impact, low-effort improvements"]
      }
    },
    measurement_framework: {
      kpi_dashboard: {
        primary_kpis: [
          {
            kpi: "Brand Awareness",
            target: "Increase by 25%",
            measurement_method: "Brand tracking study",
            timeframe: intake.timeline,
            baseline: "Current awareness level",
            benchmark: "Industry average",
            owner: "Marketing Manager"
          }
        ],
        secondary_kpis: [
          {
            kpi: "Engagement Rate",
            target: "Above industry average",
            measurement_method: "Social media analytics",
            timeframe: "Ongoing",
            baseline: "Current engagement",
            benchmark: "Industry benchmark",
            owner: "Social Media Manager"
          }
        ],
        leading_indicators: ["Website traffic", "Social mentions"],
        lagging_indicators: ["Sales", "Market share"]
      },
      attribution_framework: {
        attribution_model: "Multi-touch attribution",
        data_sources: ["Google Analytics", "Social platforms"],
        measurement_methodology: "Data-driven attribution",
        reporting_frequency: "Weekly"
      },
      testing_strategy: {
        test_plan: [
          {
            hypothesis: "Creative variation will improve performance",
            variant_a: "Current creative",
            variant_b: "New creative approach",
            success_metric: "Click-through rate",
            timeline: "2 weeks",
            sample_size: "Statistically significant",
            confidence_level: "95%"
          }
        ],
        testing_methodology: "A/B testing",
        statistical_significance: "95% confidence level",
        testing_timeline: "Continuous testing"
      },
      analytics_setup: {
        tracking_implementation: "Comprehensive tracking setup",
        data_collection: ["User behavior", "Campaign performance"],
        data_quality_standards: ["Data accuracy", "Privacy compliance"],
        privacy_compliance: "GDPR and privacy regulations"
      },
      reporting_framework: {
        reporting_structure: "Hierarchical reporting",
        dashboard_requirements: ["Real-time data", "Customizable views"],
        reporting_frequency: "Weekly and monthly",
        stakeholder_communication: "Regular updates"
      }
    },
    implementation: {
      project_timeline: {
        timeline: intake.timeline,
        key_milestones: [
          {
            milestone_name: "Campaign Launch",
            due_date: "Week 1",
            deliverables: ["Creative assets", "Media placements"],
            success_criteria: ["Successful launch", "Initial performance"],
            owner: "Campaign Manager"
          }
        ],
        dependencies: ["Creative development", "Media planning"],
        critical_path: "Creative → Media → Launch"
      },
      resource_allocation: {
        team_structure: {
          roles: [
            {
              role_name: "Campaign Manager",
              responsibilities: ["Overall campaign management"],
              required_skills: ["Project management", "Marketing"],
              time_allocation: "Full-time"
            }
          ],
          responsibilities: ["Campaign execution", "Performance monitoring"],
          reporting_structure: "Matrix organization"
        },
        budget_allocation: intake.budget_range,
        resource_requirements: ["Creative team", "Media team"],
        capacity_planning: "Resource optimization"
      },
      stakeholder_management: {
        stakeholders: [
          {
            name: "Marketing Director",
            role: "Approver",
            influence_level: "High",
            communication_preferences: ["Executive summary", "Key metrics"]
          }
        ],
        communication_plan: "Regular updates and reviews",
        approval_process: "Multi-level approval"
      },
      risk_management: {
        risk_assessment: [
          {
            risk: "Campaign underperformance",
            probability: "Medium",
            impact: "High",
            mitigation_strategy: "Continuous optimization",
            owner: "Campaign Manager"
          }
        ],
        mitigation_strategies: ["Early warning systems", "Contingency plans"],
        contingency_plans: ["Budget reallocation", "Creative pivots"],
        risk_monitoring: "Ongoing risk assessment"
      },
      quality_assurance: {
        quality_standards: ["Brand compliance", "Performance standards"],
        review_process: "Multi-level review",
        approval_criteria: ["Brand alignment", "Performance targets"],
        quality_metrics: ["Brand consistency", "Performance KPIs"]
      }
    },
    compliance_framework: {
      regulatory_requirements: [
        {
          requirement: "Advertising standards compliance",
          jurisdiction: "National",
          compliance_deadline: "Ongoing",
          responsible_party: "Legal team"
        }
      ],
      brand_safety_guidelines: [
        {
          guideline: "Content appropriateness",
          rationale: "Brand protection",
          implementation: "Content review process",
          monitoring: "Ongoing monitoring"
        }
      ],
      data_privacy_compliance: {
        privacy_regulations: ["GDPR", "CCPA"],
        data_collection_practices: ["Consent-based collection"],
        consent_management: "Clear consent mechanisms",
        data_retention: "Regulatory compliance"
      },
      intellectual_property: {
        ip_considerations: ["Trademark usage", "Copyright compliance"],
        trademark_usage: ["Proper trademark usage"],
        copyright_compliance: "Original content and licensed materials",
        licensing_requirements: ["Music licensing", "Image licensing"]
      },
      approval_workflow: {
        approval_stages: [
          {
            stage_name: "Creative Review",
            approvers: ["Creative Director"],
            criteria: ["Brand compliance", "Creative quality"],
            timeline: "48 hours"
          }
        ],
        approval_criteria: ["Brand alignment", "Legal compliance"],
        escalation_process: "Clear escalation path"
      }
    }
  };
}