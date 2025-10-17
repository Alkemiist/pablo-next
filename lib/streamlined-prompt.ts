import { StreamlinedBriefIntake } from "./streamlined-brief-types";

export const streamlinedSystemPrompt = `You are a world-class Chief Marketing Officer with 25+ years of experience at top-tier agencies (WPP, Publicis, Omnicom) and Fortune 500 companies (Apple, Google, Nike, Coca-Cola). You create comprehensive, CMO-ready marketing briefs that transform minimal inputs into complete strategic documents worthy of boardroom presentation.

Your expertise includes:
- Strategic planning and market analysis with deep industry knowledge
- Brand positioning and creative development with emotional intelligence
- Channel strategy and media planning with attribution modeling
- Customer journey mapping and behavioral science application
- Performance measurement and advanced analytics
- Competitive intelligence and market research with predictive insights
- Regulatory compliance and risk management across global markets
- Cross-functional stakeholder management and executive communication
- Budget optimization and ROI maximization
- Innovation strategy and digital transformation

CRITICAL INSTRUCTIONS:
1. Transform minimal user inputs into a comprehensive, CMO-ready marketing brief
2. Intelligently infer missing information based on industry best practices and market intelligence
3. Create a cohesive document that reads like a professional marketing brief from a top-tier agency
4. Make every section actionable, specific, and backed by strategic rationale
5. Ensure the brief could be handed to any agency for immediate execution
6. Use your expertise to fill gaps with realistic, strategic insights and industry benchmarks
7. Include advanced metrics, competitive intelligence, and predictive analytics
8. Output MUST be valid JSON that matches the expected structure exactly
9. Apply behavioral science principles and customer psychology insights
10. Include risk assessment and mitigation strategies
11. Provide executive-level recommendations with clear business impact

Your response should be a complete marketing brief that includes all sections, even if the user didn't provide specific information for them. Use your expertise to infer and create strategic recommendations based on industry standards, market trends, and best practices.

IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object.`;

export function createStreamlinedPrompt(intake: StreamlinedBriefIntake) {
  const visualDirectionText = intake.visual_direction ? 
    `\nVisual Direction: ${intake.visual_direction.description || "User has uploaded visual references"}
Images: ${intake.visual_direction.images.length} reference images
Videos: ${intake.visual_direction.videos?.length || 0} reference videos` : 
    "\nVisual Direction: None provided";

  const advancedInputs = `
Industry Sector: ${intake.industry_sector || "To be inferred from context"}
Company Size: ${intake.company_size || "To be inferred from context"}
Market Maturity: ${intake.market_maturity || "To be analyzed"}
Competitive Landscape: ${intake.competitive_landscape || "To be researched"}
Regulatory Environment: ${intake.regulatory_environment || "Standard industry regulations"}
Seasonal Factors: ${intake.seasonal_factors || "To be considered"}
Geographic Scope: ${intake.geographic_scope || "To be defined"}
Customer Segments: ${intake.customer_segments || "To be developed"}
Brand Positioning: ${intake.brand_positioning || "To be established"}
Success Metrics: ${intake.success_metrics || "To be defined"}
Risk Tolerance: ${intake.risk_tolerance || "Moderate"}
Innovation Level: ${intake.innovation_level || "To be assessed"}`;

  return `Create a comprehensive, CMO-ready marketing brief based on these strategic inputs. Use your 25+ years of experience at top-tier agencies and Fortune 500 companies to intelligently infer and develop all missing strategic elements with industry-leading sophistication.

[CORE STRATEGIC INPUTS]
Project Name: ${intake.project_name}
Core Strategic Idea: ${intake.core_idea}
Business Challenge: ${intake.business_challenge}
Target Audience: ${intake.target_audience}
Budget Range: ${intake.budget_range}
Brand Name: ${intake.brand_name}
Product/Service: ${intake.product_service}
Key Differentiator: ${intake.key_differentiator}
Primary Goal: ${intake.primary_goal}
Platforms: ${intake.platforms}
Timeline: ${intake.timeline}
Must-Have Elements: ${intake.must_have_elements || "None specified"}${visualDirectionText}

[ADVANCED STRATEGIC CONTEXT]${advancedInputs}

[YOUR MISSION - CREATE A BOARDROOM-READY BRIEF]
Transform these inputs into a comprehensive, CMO-ready marketing brief that includes:

1. DOCUMENT METADATA: Professional versioning, confidentiality levels, approval workflows, review cycles
2. EXECUTIVE SUMMARY: Strategic overview with challenge, opportunity, strategy, expected outcome, detailed ROI projections, business impact metrics, and executive recommendations
3. STRATEGIC FOUNDATION: Comprehensive business context, detailed market analysis, sophisticated audience profiles, competitive intelligence with market positioning, and strategic SWOT analysis
4. BRAND POSITIONING: Brand architecture, positioning strategy, voice & tone guidelines, visual identity framework, and comprehensive brand guidelines
5. CREATIVE STRATEGY: Creative brief, big idea development, strategic insights, creative territories, messaging framework, and content strategy
6. CHANNEL STRATEGY: Advanced media planning, channel mix optimization, attribution modeling, budget optimization, and performance forecasting
7. CUSTOMER JOURNEY: Detailed journey mapping with behavioral triggers, experience design, and conversion optimization
   - MUST include 3-5 distinct journey stages (e.g., Awareness, Consideration, Conversion, Retention, Advocacy)
   - Each stage must have unique audience state, key message, touchpoints, and success metrics
8. MEASUREMENT FRAMEWORK: Advanced KPI dashboard, attribution framework, testing strategy, analytics setup, and reporting framework
9. IMPLEMENTATION: Detailed project timeline, resource allocation, stakeholder management, risk management, and quality assurance
10. COMPLIANCE FRAMEWORK: Regulatory requirements, brand safety guidelines, intellectual property, and approval workflow

[STRATEGIC REQUIREMENTS]
- Create compelling, data-driven personas with behavioral insights
- Develop realistic competitive analysis with market positioning
- Design creative territories with emotional intelligence
- Build channel strategies with attribution modeling
- Establish advanced KPIs with industry benchmarks
- Create realistic timelines with risk assessment
- Include comprehensive compliance frameworks
- Apply behavioral science principles throughout
- Provide executive-level recommendations with clear business impact

Make this brief comprehensive, strategically sophisticated, and immediately actionable for executive teams and agencies. Every section should demonstrate deep industry knowledge and strategic thinking.

[OUTPUT FORMAT]
Return your response as a valid JSON object with this comprehensive structure:
{
  "document_info": {
    "title": "Strategic Marketing Brief: [Project Name]",
    "generated_date": "[Current Date]",
    "project_name": "[Project Name]",
    "brand_name": "[Brand Name]",
    "brief_version": "1.0",
    "confidentiality_level": "Internal Use Only",
    "approval_status": "Draft",
    "next_review_date": "[Date 30 days from now]"
  },
  "executive_summary": {
    "challenge": "[Comprehensive business challenge analysis]",
    "opportunity": "[Detailed market opportunity with quantified potential]",
    "strategy": "[High-level strategic approach with rationale]",
    "expected_outcome": "[Specific, measurable expected results]",
    "roi_projections": {
      "revenue_increase": "X% with confidence interval",
      "cpa_reduction": "Y% based on industry benchmarks",
      "ltv_increase": "Z% with supporting rationale",
      "payback_period": "N months with risk factors"
    },
    "business_impact_metrics": {
      "brand_awareness_lift": "A% with measurement methodology",
      "market_positioning_shift": "Improved by B points with competitive analysis",
      "competitive_advantage_strengthened": "Yes/No with supporting evidence"
    },
    "executive_recommendations": [
      "Strategic recommendation 1 with business impact",
      "Strategic recommendation 2 with implementation timeline",
      "Strategic recommendation 3 with risk mitigation"
    ]
  },
  "strategic_foundation": {
    "business_context": {
      "company_overview": "[Comprehensive company overview with market position]",
      "market_position": "[Detailed market position with competitive analysis]",
      "business_objectives": ["Strategic objective 1 with metrics", "Strategic objective 2 with timeline"],
      "strategic_initiatives": ["Initiative 1 with business impact", "Initiative 2 with resource requirements"],
      "market_conditions": "[Detailed market conditions with trend analysis]",
      "industry_trends": ["Trend 1 with business implications", "Trend 2 with competitive impact"],
      "regulatory_environment": "[Comprehensive regulatory considerations with compliance requirements]"
    },
    "market_analysis": {
      "market_size": "[Quantified market size with growth projections]",
      "market_growth_rate": "[Growth rate with supporting data]",
      "market_segmentation": [
        {
          "segment_name": "[Segment name]",
          "size": "[Segment size]",
          "growth_rate": "[Segment growth rate]",
          "characteristics": "[Segment characteristics]",
          "opportunity_score": "[High/Medium/Low]"
        }
      ],
      "market_dynamics": "[Comprehensive market dynamics analysis]",
      "emerging_opportunities": ["Opportunity 1 with market potential", "Opportunity 2 with competitive advantage"],
      "market_barriers": ["Barrier 1 with mitigation strategy", "Barrier 2 with impact assessment"],
      "competitive_intensity": "[Competitive intensity analysis with market share distribution]"
    },
    "target_audience": {
      "primary_persona": {
        "persona_name": "[Compelling persona name with personality]",
        "persona_description": "[Comprehensive persona description with behavioral insights]",
        "demographics": {
          "age_range": "[Specific age range with generational insights]",
          "gender_distribution": "[Gender breakdown with cultural considerations]",
          "income_level": "[Income range with purchasing power analysis]",
          "education_level": "[Education level with decision-making implications]",
          "geographic_location": "[Geographic focus with regional preferences]",
          "occupation": "[Occupation types with professional insights]",
          "household_composition": "[Household details with decision dynamics]"
        },
        "psychographics": {
          "values": ["Core value 1 with business implications", "Core value 2 with messaging opportunities"],
          "interests": ["Interest 1 with engagement potential", "Interest 2 with content opportunities"],
          "lifestyle": "[Comprehensive lifestyle description with behavioral patterns]",
          "personality_traits": ["Trait 1 with communication implications", "Trait 2 with engagement strategies"],
          "attitudes": ["Attitude 1 with brand perception impact", "Attitude 2 with purchase behavior influence"],
          "beliefs": ["Belief 1 with messaging alignment", "Belief 2 with brand positioning"]
        },
        "pain_points": [
          {
            "pain_point": "[Detailed pain point with emotional impact]",
            "severity": "[High/Medium/Low] with business impact",
            "frequency": "[Frequency] with urgency assessment",
            "impact": "[Impact description] with business implications",
            "current_solutions": ["Current solution 1 with limitations", "Current solution 2 with gaps"]
          }
        ],
        "motivations": [
          {
            "motivation": "[Core motivation with emotional drivers]",
            "importance": "[High/Medium/Low] with priority ranking",
            "frequency": "[Frequency] with behavioral patterns",
            "emotional_driver": "[Emotional driver] with psychological insights"
          }
        ],
        "goals": [
          {
            "goal": "[Specific goal with success metrics]",
            "priority": "[High/Medium/Low] with timeline urgency",
            "timeline": "[Timeline] with milestone expectations",
            "success_criteria": "[Success criteria] with measurable outcomes"
          }
        ],
        "challenges": [
          {
            "challenge": "[Challenge description] with complexity analysis",
            "complexity": "[High/Medium/Low] with resource requirements",
            "resources_needed": "[Resources] with accessibility assessment",
            "potential_solutions": ["Solution 1 with effectiveness", "Solution 2 with limitations"]
          }
        ],
        "media_preferences": [
          {
            "platform": "[Platform name] with usage patterns",
            "usage_frequency": "[Frequency] with engagement levels",
            "content_preferences": ["Preference 1 with engagement metrics", "Preference 2 with sharing behavior"],
            "engagement_patterns": ["Pattern 1 with behavioral insights", "Pattern 2 with conversion potential"]
          }
        ]
      },
      "secondary_personas": [],
      "audience_insights": [
        {
          "insight": "[Strategic insight] with business implications",
          "source": "[Source] with credibility assessment",
          "confidence_level": "[High/Medium/Low] with validation methodology",
          "business_implication": "[Implication] with strategic recommendations"
        }
      ],
      "behavioral_patterns": [
        {
          "pattern": "[Behavioral pattern] with psychological basis",
          "frequency": "[Frequency] with predictive value",
          "triggers": ["Trigger 1 with activation potential", "Trigger 2 with engagement opportunities"],
          "outcomes": ["Outcome 1 with business impact", "Outcome 2 with conversion potential"]
        }
      ],
      "media_consumption": [
        {
          "platform": "[Platform] with usage analytics",
          "time_spent": "[Time spent] with engagement quality",
          "content_types": ["Type 1 with preference ranking", "Type 2 with consumption patterns"],
          "engagement_metrics": ["Metric 1 with benchmark comparison", "Metric 2 with optimization potential"]
        }
      ],
      "decision_making_process": {
        "awareness_stage": "[Awareness description] with touchpoint analysis",
        "consideration_factors": ["Factor 1 with influence weight", "Factor 2 with decision impact"],
        "evaluation_criteria": ["Criteria 1 with importance ranking", "Criteria 2 with comparison methodology"],
        "decision_triggers": ["Trigger 1 with activation potential", "Trigger 2 with urgency factors"],
        "influencers": ["Influencer 1 with credibility assessment", "Influencer 2 with reach analysis"]
      }
    },
    "competitive_intelligence": {
      "competitor_analysis": [
        {
          "competitor_name": "[Competitor name] with market position",
          "market_position": "[Position] with market share analysis",
          "strengths": ["Strength 1 with competitive advantage", "Strength 2 with market impact"],
          "weaknesses": ["Weakness 1 with opportunity assessment", "Weakness 2 with competitive gap"],
          "strategies": ["Strategy 1 with effectiveness analysis", "Strategy 2 with market response"],
          "recent_activities": ["Activity 1 with market impact", "Activity 2 with competitive implications"],
          "threat_level": "[High/Medium/Low] with strategic assessment"
        }
      ],
      "competitive_positioning": {
        "positioning_map": "[Positioning description] with market analysis",
        "differentiation_strategy": "[Differentiation strategy] with competitive advantage",
        "competitive_moat": "[Competitive moat] with sustainability analysis",
        "market_gaps": ["Gap 1 with opportunity assessment", "Gap 2 with competitive advantage"]
      },
      "market_share_analysis": {
        "current_market_share": "[Current share] with trend analysis",
        "target_market_share": "[Target share] with growth strategy",
        "growth_strategy": "[Growth strategy] with competitive positioning",
        "market_expansion_opportunities": ["Opportunity 1 with market potential", "Opportunity 2 with competitive advantage"]
      },
      "competitive_advantages": [
        {
          "advantage": "[Advantage description] with strategic value",
          "sustainability": "[High/Medium/Low] with competitive analysis",
          "replicability": "[High/Medium/Low] with barrier assessment",
          "business_impact": "[Impact description] with market implications"
        }
      ],
      "threat_assessment": {
        "threats": [
          {
            "threat": "[Threat description] with impact analysis",
            "probability": "[High/Medium/Low] with risk assessment",
            "impact": "[High/Medium/Low] with business implications",
            "timeline": "[Timeline] with strategic planning"
          }
        ],
        "mitigation_strategies": ["Strategy 1 with implementation plan", "Strategy 2 with risk reduction"],
        "contingency_plans": ["Plan 1 with response strategy", "Plan 2 with recovery approach"]
      }
    },
    "swot_analysis": {
      "strengths": ["Strength 1 with competitive advantage", "Strength 2 with market opportunity"],
      "weaknesses": ["Weakness 1 with improvement potential", "Weakness 2 with strategic focus"],
      "opportunities": ["Opportunity 1 with market potential", "Opportunity 2 with competitive advantage"],
      "threats": ["Threat 1 with mitigation strategy", "Threat 2 with risk assessment"],
      "strategic_implications": ["Implication 1 with strategic recommendation", "Implication 2 with implementation plan"]
    }
  },
  "brand_positioning": {
    "brand_architecture": {
      "brand_hierarchy": "[Hierarchy description] with portfolio strategy",
      "brand_portfolio": "[Portfolio description] with market positioning",
      "brand_extensions": ["Extension 1 with market potential", "Extension 2 with brand alignment"],
      "brand_consistency": "[Consistency approach] with quality standards"
    },
    "positioning_strategy": {
      "positioning_statement": "[Positioning statement] with market differentiation",
      "value_proposition": "[Value proposition] with customer benefits",
      "differentiation_factors": ["Factor 1 with competitive advantage", "Factor 2 with market uniqueness"],
      "positioning_rationale": "[Rationale] with strategic justification"
    },
    "brand_voice_tone": {
      "voice_characteristics": ["Characteristic 1 with communication strategy", "Characteristic 2 with audience alignment"],
      "tone_guidelines": ["Guideline 1 with application examples", "Guideline 2 with consistency standards"],
      "communication_style": "[Style description] with brand personality",
      "brand_personality": "[Personality description] with emotional connection"
    },
    "visual_identity": {
      "visual_direction": "[Visual direction] with brand expression",
      "color_palette": ["Color 1 with psychological impact", "Color 2 with brand association"],
      "typography": "[Typography description] with readability standards",
      "imagery_style": "[Imagery style] with brand consistency"],
      "design_principles": ["Principle 1 with application guidelines", "Principle 2 with brand standards"]
    },
    "brand_guidelines": {
      "logo_usage": ["Usage rule 1 with brand protection", "Usage rule 2 with consistency standards"],
      "color_usage": ["Color rule 1 with accessibility compliance", "Color rule 2 with brand recognition"],
      "typography_usage": ["Typography rule 1 with readability standards", "Typography rule 2 with brand consistency"],
      "imagery_guidelines": ["Guideline 1 with quality standards", "Guideline 2 with brand alignment"],
      "do_donts": ["Do 1 with brand enhancement", "Don't 1 with brand protection"]
    }
  },
  "visual_direction": {
    "images": [],
    "videos": [],
    "description": "[Visual direction description based on user uploads] with creative strategy"
  },
  "creative_strategy": {
    "creative_brief": {
      "creative_challenge": "[Creative challenge] with strategic objectives",
      "creative_objectives": ["Objective 1 with measurable outcomes", "Objective 2 with brand impact"],
      "creative_constraints": ["Constraint 1 with creative solutions", "Constraint 2 with resource optimization"],
      "creative_requirements": ["Requirement 1 with quality standards", "Requirement 2 with brand compliance"],
      "inspiration_sources": ["Source 1 with creative application", "Source 2 with brand alignment"]
    },
    "big_idea": {
      "core_concept": "[Core creative concept] with strategic foundation",
      "creative_hook": "[Creative hook] with audience engagement",
      "emotional_connection": "[Emotional connection] with psychological impact",
      "differentiation": "[Differentiation] with competitive advantage",
      "scalability": "[Scalability] with multi-channel application"
    },
    "strategic_insights": [
      {
        "insight": "[Strategic insight] with business implications",
        "source": "[Source] with credibility assessment",
        "implication": "[Implication] with strategic recommendations",
        "application": "[Application] with creative execution"
      }
    ],
    "creative_territories": [
      {
        "name": "[Territory name] with creative potential",
        "description": "[Description] with audience resonance",
        "example_hook": "[Example hook] with engagement strategy",
        "visual_direction": "[Visual direction] with brand alignment",
        "target_emotion": "[Target emotion] with psychological impact",
        "audience_resonance": "[Resonance level] with engagement potential",
        "creative_potential": "[Potential] with execution feasibility"
      }
    ],
    "messaging_framework": {
      "primary_message": "[Primary message] with brand positioning",
      "supporting_messages": ["Message 1 with proof points", "Message 2 with emotional appeal"],
      "proof_points": ["Proof point 1 with credibility", "Proof point 2 with differentiation"],
      "emotional_appeals": ["Appeal 1 with psychological impact", "Appeal 2 with brand connection"],
      "rational_benefits": ["Benefit 1 with functional value", "Benefit 2 with competitive advantage"]
    },
    "content_strategy": {
      "content_pillars": [
        {
          "pillar_name": "[Pillar name] with strategic focus",
          "pillar_description": "[Description] with audience alignment",
          "content_examples": ["Example 1 with engagement potential", "Example 2 with brand consistency"],
          "audience_alignment": "[Alignment] with behavioral insights"
        }
      ],
      "content_types": ["Type 1 with platform optimization", "Type 2 with audience engagement"],
      "distribution_strategy": "[Strategy] with channel optimization",
      "content_calendar": "[Calendar] with strategic timing"
    }
  },
  "channel_strategy": {
    "media_planning": {
      "media_objectives": ["Objective 1 with measurable outcomes", "Objective 2 with strategic alignment"],
      "media_strategy": "[Strategy description] with channel optimization",
      "reach_frequency_goals": "[Goals description] with audience targeting",
      "media_mix_optimization": "[Optimization approach] with performance tracking"
    },
    "channel_mix": {
      "primary_channels": [
        {
          "channel": "[Channel name] with audience alignment",
          "objective": "[Objective] with measurable outcomes",
          "budget_percentage": "[X%] with performance justification",
          "key_metrics": ["Metric 1 with benchmark comparison", "Metric 2 with optimization potential"],
          "creative_requirements": ["Requirement 1 with platform optimization", "Requirement 2 with brand compliance"],
          "audience_alignment": "[Alignment] with behavioral insights",
          "performance_expectations": "[Expectations] with industry benchmarks"
        }
      ],
      "secondary_channels": [],
      "channel_synergies": ["Synergy 1 with cross-channel strategy", "Synergy 2 with audience journey"],
      "cross_channel_strategy": "[Strategy] with integrated customer experience"
    },
    "attribution_modeling": {
      "attribution_model": "[Model] with data-driven approach",
      "touchpoint_weights": "[Weights] with conversion analysis",
      "conversion_paths": ["Path 1 with journey mapping", "Path 2 with optimization opportunities"],
      "attribution_rules": ["Rule 1 with measurement methodology", "Rule 2 with performance tracking"]
    },
    "budget_optimization": {
      "budget_allocation": "[Allocation] with performance-based distribution",
      "optimization_strategy": "[Strategy] with continuous improvement",
      "performance_thresholds": ["Threshold 1 with ROI targets", "Threshold 2 with efficiency metrics"],
      "reallocation_triggers": ["Trigger 1 with performance monitoring", "Trigger 2 with opportunity assessment"]
    },
    "performance_forecasting": {
      "performance_projections": [
        {
          "metric": "[Metric name] with business impact",
          "baseline": "[Baseline] with historical analysis",
          "target": "[Target] with growth strategy",
          "confidence_interval": "[Interval] with risk assessment",
          "assumptions": ["Assumption 1 with market conditions", "Assumption 2 with competitive factors"]
        }
      ],
      "scenario_planning": [
        {
          "scenario_name": "[Scenario name] with probability assessment",
          "probability": "[Probability] with risk factors",
          "outcomes": ["Outcome 1 with business impact", "Outcome 2 with strategic implications"],
          "implications": ["Implication 1 with response strategy", "Implication 2 with contingency planning"]
        }
      ],
      "sensitivity_analysis": "[Analysis] with key variable impact"
    }
  },
  "customer_journey": {
    "journey_mapping": {
      "journey_stages": [
        {
          "stage": "[Stage name] with customer state",
          "audience_state": "[State description] with behavioral insights",
          "key_message": "[Message] with brand positioning",
          "touchpoints": ["Touchpoint 1 with engagement strategy", "Touchpoint 2 with conversion optimization"],
          "assets_needed": ["Asset 1 with creative requirements", "Asset 2 with platform optimization"],
          "success_metrics": ["Metric 1 with measurement methodology", "Metric 2 with benchmark comparison"],
          "emotional_state": "[State] with psychological insights",
          "barriers": ["Barrier 1 with mitigation strategy", "Barrier 2 with user experience optimization"],
          "opportunities": ["Opportunity 1 with engagement potential", "Opportunity 2 with conversion optimization"]
        },
        {
          "stage": "[Next stage name] with progression",
          "audience_state": "[Next state description] with behavioral insights",
          "key_message": "[Next message] with brand positioning",
          "touchpoints": ["Touchpoint 1 with engagement strategy", "Touchpoint 2 with conversion optimization"],
          "assets_needed": ["Asset 1 with creative requirements", "Asset 2 with platform optimization"],
          "success_metrics": ["Metric 1 with measurement methodology", "Metric 2 with benchmark comparison"],
          "emotional_state": "[State] with psychological insights",
          "barriers": ["Barrier 1 with mitigation strategy", "Barrier 2 with user experience optimization"],
          "opportunities": ["Opportunity 1 with engagement potential", "Opportunity 2 with conversion optimization"]
        },
        {
          "stage": "[Final stage name] with conversion focus",
          "audience_state": "[Final state description] with behavioral insights",
          "key_message": "[Final message] with brand positioning",
          "touchpoints": ["Touchpoint 1 with engagement strategy", "Touchpoint 2 with conversion optimization"],
          "assets_needed": ["Asset 1 with creative requirements", "Asset 2 with platform optimization"],
          "success_metrics": ["Metric 1 with measurement methodology", "Metric 2 with benchmark comparison"],
          "emotional_state": "[State] with psychological insights",
          "barriers": ["Barrier 1 with mitigation strategy", "Barrier 2 with user experience optimization"],
          "opportunities": ["Opportunity 1 with engagement potential", "Opportunity 2 with conversion optimization"]
        }
      ],
      "journey_insights": ["Insight 1 with behavioral analysis", "Insight 2 with optimization opportunities"],
      "journey_optimization": "[Optimization] with continuous improvement strategy"
    },
    "touchpoint_optimization": {
      "touchpoint_strategy": "[Strategy] with customer experience focus",
      "touchpoint_prioritization": "[Prioritization] with impact assessment",
      "touchpoint_integration": "[Integration] with seamless experience"
    },
    "behavioral_triggers": [
      {
        "trigger": "[Trigger] with psychological principle",
        "psychological_principle": "[Principle] with behavioral science",
        "application": "[Application] with engagement strategy",
        "expected_outcome": "[Outcome] with measurable impact"
      }
    ],
    "experience_design": {
      "experience_principles": ["Principle 1 with user-centric approach", "Principle 2 with brand consistency"],
      "user_experience_goals": ["Goal 1 with usability standards", "Goal 2 with engagement metrics"],
      "experience_metrics": ["Metric 1 with satisfaction measurement", "Metric 2 with behavioral tracking"]
    },
    "conversion_optimization": {
      "conversion_funnel": "[Funnel] with stage-by-stage analysis",
      "optimization_opportunities": ["Opportunity 1 with impact assessment", "Opportunity 2 with implementation strategy"],
      "testing_priorities": ["Priority 1 with hypothesis testing", "Priority 2 with performance optimization"]
    }
  },
  "measurement_framework": {
    "kpi_dashboard": {
      "primary_kpis": [
        {
          "kpi": "[KPI name] with business impact",
          "target": "[Target value] with growth strategy",
          "measurement_method": "[Method] with data sources",
          "timeframe": "[Timeframe] with milestone tracking",
          "baseline": "[Baseline] with historical analysis",
          "benchmark": "[Benchmark] with industry comparison",
          "owner": "[Owner] with accountability framework"
        }
      ],
      "secondary_kpis": [
        {
          "kpi": "[Secondary KPI] with supporting role",
          "target": "[Target] with performance tracking",
          "measurement_method": "[Method] with data collection",
          "timeframe": "[Timeframe] with reporting schedule",
          "baseline": "[Baseline] with trend analysis",
          "benchmark": "[Benchmark] with competitive analysis",
          "owner": "[Owner] with responsibility matrix"
        }
      ],
      "leading_indicators": ["Indicator 1 with predictive value", "Indicator 2 with early warning system"],
      "lagging_indicators": ["Indicator 1 with business impact", "Indicator 2 with strategic outcomes"]
    },
    "attribution_framework": {
      "attribution_model": "[Model] with data-driven approach",
      "data_sources": ["Source 1 with integration strategy", "Source 2 with data quality"],
      "measurement_methodology": "[Methodology] with statistical rigor",
      "reporting_frequency": "[Frequency] with stakeholder needs"
    },
    "testing_strategy": {
      "test_plan": [
        {
          "hypothesis": "[Hypothesis] with business rationale",
          "variant_a": "[Variant A] with control group",
          "variant_b": "[Variant B] with test group",
          "success_metric": "[Metric] with statistical significance",
          "timeline": "[Timeline] with milestone tracking",
          "sample_size": "[Size] with power analysis",
          "confidence_level": "[Level] with risk assessment"
        }
      ],
      "testing_methodology": "[Methodology] with experimental design",
      "statistical_significance": "[Significance] with confidence intervals",
      "testing_timeline": "[Timeline] with continuous optimization"
    },
    "analytics_setup": {
      "tracking_implementation": "[Implementation] with data governance",
      "data_collection": ["Collection 1 with privacy compliance", "Collection 2 with quality standards"],
      "data_quality_standards": ["Standard 1 with validation rules", "Standard 2 with accuracy requirements"],
      "privacy_compliance": "[Compliance] with regulatory requirements"
    },
    "reporting_framework": {
      "reporting_structure": "[Structure] with stakeholder hierarchy",
      "dashboard_requirements": ["Requirement 1 with real-time data", "Requirement 2 with customizable views"],
      "reporting_frequency": "[Frequency] with business cycles",
      "stakeholder_communication": "[Communication] with executive summaries"
    }
  },
  "implementation": {
    "project_timeline": {
      "timeline": "[Timeline] with critical path analysis",
      "key_milestones": [
        {
          "milestone_name": "[Milestone] with deliverable focus",
          "due_date": "[Date] with dependency management",
          "deliverables": ["Deliverable 1 with quality standards", "Deliverable 2 with acceptance criteria"],
          "success_criteria": "[Criteria] with measurable outcomes",
          "owner": "[Owner] with accountability framework"
        }
      ],
      "dependencies": ["Dependency 1 with risk assessment", "Dependency 2 with mitigation strategy"],
      "critical_path": "[Path] with resource optimization"
    },
    "resource_allocation": {
      "team_structure": {
        "roles": [
          {
            "role_name": "[Role] with responsibility matrix",
            "responsibilities": ["Responsibility 1 with deliverables", "Responsibility 2 with outcomes"],
            "required_skills": ["Skill 1 with competency level", "Skill 2 with certification requirements"],
            "time_allocation": "[Allocation] with capacity planning"
          }
        ],
        "responsibilities": ["Responsibility 1 with accountability", "Responsibility 2 with performance metrics"],
        "reporting_structure": "[Structure] with communication protocols"
      },
      "budget_allocation": "[Allocation] with ROI optimization",
      "resource_requirements": ["Requirement 1 with capacity planning", "Requirement 2 with skill development"],
      "capacity_planning": "[Planning] with scalability considerations"
    },
    "stakeholder_management": {
      "stakeholders": [
        {
          "name": "[Stakeholder] with influence assessment",
          "role": "[Role] with decision authority",
          "influence_level": "[Level] with engagement strategy",
          "communication_preferences": ["Preference 1 with frequency", "Preference 2 with format"]
        }
      ],
      "communication_plan": "[Plan] with stakeholder engagement",
      "approval_process": "[Process] with decision framework"
    },
    "risk_management": {
      "risk_assessment": [
        {
          "risk": "[Risk] with impact analysis",
          "probability": "[Probability] with likelihood assessment",
          "impact": "[Impact] with business consequences",
          "mitigation_strategy": "[Strategy] with contingency planning",
          "owner": "[Owner] with accountability framework"
        }
      ],
      "mitigation_strategies": ["Strategy 1 with implementation plan", "Strategy 2 with monitoring protocol"],
      "contingency_plans": ["Plan 1 with response protocol", "Plan 2 with recovery strategy"],
      "risk_monitoring": "[Monitoring] with early warning systems"
    },
    "quality_assurance": {
      "quality_standards": ["Standard 1 with measurement criteria", "Standard 2 with compliance requirements"],
      "review_process": "[Process] with quality gates",
      "approval_criteria": ["Criteria 1 with acceptance standards", "Criteria 2 with performance metrics"],
      "quality_metrics": ["Metric 1 with continuous improvement", "Metric 2 with stakeholder satisfaction"]
    }
  },
  "compliance_framework": {
    "regulatory_requirements": [
      {
        "requirement": "[Requirement] with compliance scope",
        "jurisdiction": "[Jurisdiction] with legal framework",
        "compliance_deadline": "[Deadline] with implementation timeline",
        "responsible_party": "[Party] with accountability framework"
      }
    ],
    "brand_safety_guidelines": [
      {
        "guideline": "[Guideline] with brand protection",
        "rationale": "[Rationale] with risk assessment",
        "implementation": "[Implementation] with monitoring protocol",
        "monitoring": "[Monitoring] with compliance tracking"
      }
    ],
    "data_privacy_compliance": {
      "privacy_regulations": ["Regulation 1 with compliance requirements", "Regulation 2 with data protection"],
      "data_collection_practices": ["Practice 1 with consent management", "Practice 2 with data minimization"],
      "consent_management": "[Management] with user control",
      "data_retention": "[Retention] with lifecycle management"
    },
    "intellectual_property": {
      "ip_considerations": ["Consideration 1 with trademark protection", "Consideration 2 with copyright compliance"],
      "trademark_usage": "[Usage] with brand protection",
      "copyright_compliance": "[Compliance] with content licensing"],
      "licensing_requirements": ["Requirement 1 with music licensing", "Requirement 2 with image licensing"]
    },
    "approval_workflow": {
      "approval_stages": [
        {
          "stage_name": "[Stage] with approval criteria",
          "approvers": ["Approver 1 with decision authority", "Approver 2 with expertise area"],
          "criteria": ["Criteria 1 with quality standards", "Criteria 2 with compliance requirements"],
          "timeline": "[Timeline] with SLA requirements"
        }
      ],
      "approval_criteria": ["Criteria 1 with brand alignment", "Criteria 2 with legal compliance"],
      "escalation_process": "[Process] with decision framework"
    }
  }
}`;
}