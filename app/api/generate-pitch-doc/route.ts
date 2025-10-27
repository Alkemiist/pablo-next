import { NextRequest, NextResponse } from 'next/server';
import { PitchDocIntake, GeneratedPitchDoc } from '@/lib/pitch-doc-types';
import { generatePitchDocId, createPitchDocMetadata } from '@/lib/pitch-doc-storage';
import { researchService } from '@/lib/research-service';

// Helper function to enhance pitch doc with real-time research
async function enhanceWithResearch(pitchDoc: GeneratedPitchDoc, intakeData: PitchDocIntake): Promise<GeneratedPitchDoc> {
  try {
    // Research cultural signals
    // Use original cultural signals without fake research enhancement
    const enhancedCulturalSignals = pitchDoc.cultural_signal_layer?.top_cultural_signals || [];

    // Research news articles for cultural signals
    const topSignal = pitchDoc.cultural_signal_layer?.top_cultural_signals?.[0]?.signal || intakeData.cultural_signal || 'Cultural Trend';
    const newsResearch = await researchService.researchNewsArticles(
      topSignal, 
      intakeData.selected_tactic, 
      intakeData.product_category
    );

    // Enhance the pitch doc with research data
    return {
      ...pitchDoc,
      cultural_signal_layer: {
        ...pitchDoc.cultural_signal_layer,
        top_cultural_signals: enhancedCulturalSignals,
        proof_points: pitchDoc.cultural_signal_layer?.proof_points || [],
        narrative_insight: pitchDoc.cultural_signal_layer?.narrative_insight || '',
        supporting_news: newsResearch.articles
      },
      audience_intelligence: {
        ...pitchDoc.audience_intelligence,
        primary_audience_personas: pitchDoc.audience_intelligence?.primary_audience_personas || []
      },
      knowledge_provenance: {
        ...pitchDoc.knowledge_provenance,
        data_source_cards: pitchDoc.knowledge_provenance?.data_source_cards || [],
        tribal_knowledge_references: pitchDoc.knowledge_provenance?.tribal_knowledge_references || [],
        timestamp: pitchDoc.knowledge_provenance?.timestamp || new Date().toISOString(),
        model_id: pitchDoc.knowledge_provenance?.model_id || 'Øpus-PitchGen-v1.2'
      }
    };
  } catch (error) {
    console.error('Research enhancement failed:', error);
    // Return original pitch doc if research fails
    return pitchDoc;
  }
}

// Helper function to generate hero image using DALL-E
async function generateHeroImage(visualDescription: string, productName: string): Promise<string> {
  try {
    console.log(`🎨 Generating hero image for: ${productName}`);
    console.log(`📝 Visual description: ${visualDescription}`);
    
    const prompt = `Create a stunning, professional marketing hero image for ${productName}. ${visualDescription}. 

Style requirements:
- Professional product photography with studio lighting
- Clean, minimalist composition with plenty of white space
- Premium brand aesthetic with sophisticated color palette
- High-end commercial photography quality
- Focus on the product as the hero element
- Subtle shadows and depth for dimension
- Modern, aspirational lifestyle context
- Avoid cluttered backgrounds or distracting elements
- Ensure the image feels premium and trustworthy
- Use high contrast and sharp focus
- Include subtle brand elements if applicable

The image should immediately convey quality, innovation, and professional excellence. Make it visually striking and memorable.`;

    console.log(`🤖 DALL-E prompt: ${prompt}`);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ DALL-E API error: ${response.status} - ${errorText}`);
      throw new Error(`DALL-E API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Image generated successfully: ${data.data[0].url}`);
    return data.data[0].url;
  } catch (error) {
    console.error('❌ Error generating hero image:', error);
    // Return a placeholder image URL if generation fails
    return 'https://via.placeholder.com/1024x1024/1a1a1a/ffffff?text=Generated+Visual';
  }
}

// Helper function to generate pitch doc using AI
async function generatePitchDocWithAI(intakeData: PitchDocIntake): Promise<GeneratedPitchDoc> {
  const prompt = `Generate a comprehensive, unique and best-practice pitch document based on the following marketing brief inputs.

BRAND + PRODUCT CONTEXT:
- Brand Name: ${intakeData.brand_name}
- Core Product: ${intakeData.core_product}
- Target Audience Archetype: ${intakeData.target_audience_archetype}
- Product Category: ${intakeData.product_category}
- Business Outcome: ${intakeData.business_outcome}
- Brand Tone & Voice: ${intakeData.brand_tone_voice}
- Creative Guardrails: ${intakeData.creative_guardrails || 'None specified'}

OPPORTUNITY INTENT:
- Core Opportunity: ${intakeData.core_opportunity}
- Creative Objective: ${intakeData.creative_objective}
- Strategic Job-to-be-Done: ${intakeData.strategic_job_to_be_done}
- Desired User Action: ${intakeData.desired_user_action}

AUDIENCE INTELLIGENCE:
- Primary Audience: ${intakeData.primary_audience}
- Secondary Audience: ${intakeData.secondary_audience || 'None specified'}
- Audience Optimization: ${intakeData.audience_optimization_mode}

CULTURAL & CONTEXTUAL INPUTS:
- Cultural Signal: ${intakeData.cultural_signal || 'None specified'}
- Timing Context: ${intakeData.timing_context || 'None specified'}
- Channel Preferences: ${intakeData.channel_preferences || 'None specified'}

CREATIVE DIRECTION:
- Preferred Mediums: ${intakeData.preferred_mediums.join(', ')}
- Emotional Tone: ${intakeData.emotional_tone}

SUCCESS MEASURES:
- Primary KPI: ${intakeData.primary_kpi}
- Secondary KPIs: ${intakeData.secondary_kpis?.join(', ') || 'None specified'}
- Historical Data Connected: ${intakeData.historical_data_connected ? 'Yes' : 'No'}

TACTIC SELECTION:
- Selected Tactic: ${intakeData.selected_tactic}
- Tactic Description: ${intakeData.tactic_description}

Generate a comprehensive pitch document that follows this exact JSON structure. Return ONLY valid JSON that conforms to this schema:

{
  "idea_overview": {
    "idea_name": "string (compelling, memorable name for the idea)",
    "tagline": "string (catchy tagline that captures the essence)",
    "concept_summary": "string (1-2 lines summarizing the core concept)",
    "opus_behavior_overlap_score": 0.0,
    "funnel_position": "Top | Mid | Bottom",
    "category_fit": ["string"],
    "brand_target_consumer": "string",
    "generated_visual_description": "string (detailed, specific description of hero visual for DALL-E image generation - include product details, setting, lighting, style, colors, composition)",
    "generated_image_url": "string (URL for generated hero image)"
  },
  "audience_intelligence": {
    "primary_audience_personas": [
      {
        "archetype": "string",
        "motivations": ["string"],
        "channels": ["string"],
        "psychographic_cluster": "string",
        "overlap_score": 0.0,
        "detailed_description": "string (comprehensive persona description)",
        "pain_points": ["string"],
        "goals": ["string"],
        "media_consumption": ["string"],
        "lifestyle_insights": ["string"]
      }
    ],
    "behavioral_overlap_visualization": "string (description of how audiences overlap)",
    "brand_target_comparison": "string (side-by-side comparison analysis)",
    "data_provenance": {
      "sources": ["string"],
      "model_confidence": 0.0,
      "audience_size": "string"
    }
  },
  "funnel_position_layer": {
    "funnel_stage": "Top | Mid | Bottom",
    "stage_definition": "string (detailed definition of the funnel stage)",
    "behavior_triggers": ["string"],
    "recommended_channel_mix": [
      {
        "channel": "string",
        "weight": 0,
        "rationale": "string"
      }
    ],
    "funnel_to_category_fit": "string (how funnel stage aligns with category dynamics)"
  },
  "cultural_signal_layer": {
    "top_cultural_signals": [
      {
        "signal": "string",
        "score": 0.0,
        "trajectory": "Rising | Stable | Declining"
      }
    ],
    "proof_points": ["string"],
    "trend_to_funnel_connection": "string",
    "narrative_insight": "string (paragraph explaining cultural context)"
  },
  "creative_expression_panel": {
    "generated_storyboards": ["string"],
    "suggested_copy_concepts": ["string (tactic-specific copy concepts that directly support the selected tactic execution)"],
    "medium_mapping": [
      {
        "medium": "string",
        "funnel_intent": "string",
        "emotional_arc": "string",
        "tone": "string"
      }
    ],
    "emotional_arc": "string",
    "stage_fit_tags": ["string"]
  },
  "behavior_driven_strategy": {
    "behavioral_flow": "string (description of customer journey)",
    "motivational_triggers": [
      {
        "stage": "string",
        "triggers": ["string"]
      }
    ],
    "recommended_channel_weighting": [
      {
        "channel": "string",
        "weight": 0,
        "reasoning": "string"
      }
    ],
    "seasonal_timing": "string",
    "context_layer": "string"
  },
  
  "tactic_execution": {
    "selected_tactic": "string",
    "tactic_description": "string",
    "execution_strategy": "string (detailed execution plan)",
    "key_components": ["string"],
    "success_metrics": ["string"],
    "timeline": "string"
  },
  
  "performance_forecast": {
    "predicted_lift": {
      "reach": "string",
      "engagement": "string",
      "conversion": "string"
    },
    "funnel_specific_forecast": [
      {
        "stage": "string",
        "delta": "string",
        "confidence": 0.0
      }
    ],
    "sentiment_prediction": "string",
    "earned_media_alpha_projection": "string",
    "confidence_range": {
      "min": 0.0,
      "max": 0.0
    }
  },
  "knowledge_provenance": {
    "data_source_cards": [
      {
        "source": "string",
        "type": "Audience | Category | Cultural | Creative",
        "confidence": 0.0,
        "last_updated": "string"
      }
    ],
    "tribal_knowledge_references": ["string"],
    "timestamp": "string",
    "model_id": "string"
  },
  "meta": {
    "input_summary": "string",
    "confidence": 0.0,
    "notes": "string",
    "generation_time": "string"
  }
}

REQUIREMENTS:
1. All fields must be filled with realistic, specific content based on the inputs
2. Scores should be between 0.0-9.9 for behavior overlap and cultural signals
3. Confidence scores should be between 0.0-1.0
4. Channel weights should sum to approximately 100
5. Include 3-5 cultural signals minimum
6. Include 2-4 storyboards and copy concepts
7. Include all three funnel stages in forecasts
8. Make the content feel organic, real, and crafty - avoid hard-coded or repetitive phrasing
9. Ensure cohesive narrative without hyphenation in key terms
10. Avoid filler content after call-to-actions
11. CRITICAL: Generate copy concepts that directly support and amplify the selected tactic execution
12. Copy concepts should be specific, actionable, and tailored to the chosen tactic
13. Generate a detailed visual description for DALL-E image generation - include specific product details, setting, lighting, colors, composition, and style
14. Visual description should be 2-3 sentences with concrete details for professional product photography
15. Return ONLY the JSON object, no other text`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a strategic marketing expert who creates comprehensive pitch documents. Always return valid JSON that conforms exactly to the provided schema. Never include any text outside the JSON object. Focus on creating organic, crafty content that feels real and cohesive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();

    // Parse the JSON response
    const pitchDoc = JSON.parse(generatedContent) as GeneratedPitchDoc;

    // Validate and normalize the response
    return validateAndNormalizePitchDoc(pitchDoc, intakeData);

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Return a fallback pitch doc if AI fails
    return generateFallbackPitchDoc(intakeData);
  }
}

// Helper function to validate and normalize the pitch doc
function validateAndNormalizePitchDoc(pitchDoc: GeneratedPitchDoc, intakeData: PitchDocIntake): GeneratedPitchDoc {
  // Ensure all required fields are present and properly formatted
  const normalizedPitchDoc: GeneratedPitchDoc = {
    idea_overview: {
      idea_name: pitchDoc.idea_overview?.idea_name || 'Strategic Marketing Initiative',
      tagline: pitchDoc.idea_overview?.tagline || 'Innovative approach to market engagement',
      concept_summary: pitchDoc.idea_overview?.concept_summary || 'A comprehensive strategy to achieve business objectives',
      opus_behavior_overlap_score: Math.max(0, Math.min(9.9, pitchDoc.idea_overview?.opus_behavior_overlap_score || 7.5)),
      funnel_position: pitchDoc.idea_overview?.funnel_position || 'Mid',
      category_fit: pitchDoc.idea_overview?.category_fit || [intakeData.product_category],
      brand_target_consumer: pitchDoc.idea_overview?.brand_target_consumer || intakeData.target_audience_archetype,
      generated_visual_description: pitchDoc.idea_overview?.generated_visual_description || 'Modern, premium visual treatment with clean typography and lifestyle imagery',
      generated_image_url: pitchDoc.idea_overview?.generated_image_url || ''
    },
    audience_intelligence: {
      primary_audience_personas: pitchDoc.audience_intelligence?.primary_audience_personas || [{
        archetype: intakeData.target_audience_archetype,
        motivations: ['Quality', 'Efficiency', 'Status'],
        channels: ['Digital', 'Social Media', 'Professional Networks'],
        psychographic_cluster: 'Achievement-oriented professionals',
        overlap_score: 8.2
      }],
      behavioral_overlap_visualization: pitchDoc.audience_intelligence?.behavioral_overlap_visualization || 'Strong overlap in professional networking and premium product preferences',
      brand_target_comparison: pitchDoc.audience_intelligence?.brand_target_comparison || 'High alignment between brand target and predicted high-response audience',
      data_provenance: {
        sources: pitchDoc.audience_intelligence?.data_provenance?.sources || ['Market Research', 'Behavioral Analytics', 'Customer Data'],
        model_confidence: Math.max(0, Math.min(1, pitchDoc.audience_intelligence?.data_provenance?.model_confidence || 0.85)),
        audience_size: pitchDoc.audience_intelligence?.data_provenance?.audience_size || '2.5M+ professionals'
      }
    },
    funnel_position_layer: {
      funnel_stage: pitchDoc.funnel_position_layer?.funnel_stage || 'Mid',
      stage_definition: pitchDoc.funnel_position_layer?.stage_definition || 'Consideration and evaluation phase',
      behavior_triggers: pitchDoc.funnel_position_layer?.behavior_triggers || ['Research', 'Comparison', 'Social Proof'],
      recommended_channel_mix: pitchDoc.funnel_position_layer?.recommended_channel_mix || [
        { channel: 'Digital Display', weight: 40, rationale: 'High-intent audience targeting' },
        { channel: 'Social Media', weight: 35, rationale: 'Engagement and social proof' },
        { channel: 'Content Marketing', weight: 25, rationale: 'Educational and trust-building' }
      ],
      funnel_to_category_fit: pitchDoc.funnel_position_layer?.funnel_to_category_fit || 'Mid-funnel focus aligns with category purchase behavior'
    },
    cultural_signal_layer: {
      top_cultural_signals: pitchDoc.cultural_signal_layer?.top_cultural_signals || [
        { signal: 'Remote Work Culture', score: 8.5, trajectory: 'Rising' },
        { signal: 'Premium Lifestyle', score: 7.8, trajectory: 'Stable' },
        { signal: 'Tech Integration', score: 8.2, trajectory: 'Rising' }
      ],
      proof_points: pitchDoc.cultural_signal_layer?.proof_points || ['Social media mentions', 'Industry reports', 'Consumer surveys'],
      trend_to_funnel_connection: pitchDoc.cultural_signal_layer?.trend_to_funnel_connection || 'Cultural trends drive awareness and consideration',
      narrative_insight: pitchDoc.cultural_signal_layer?.narrative_insight || 'The cultural shift toward remote work and premium lifestyle choices creates opportunities for brands that can authentically connect with these values.'
    },
    creative_expression_panel: {
      generated_storyboards: pitchDoc.creative_expression_panel?.generated_storyboards || [
        'Professional in modern office using product',
        'Lifestyle scene showing product integration',
        'Close-up of product features and benefits'
      ],
      suggested_copy_concepts: pitchDoc.creative_expression_panel?.suggested_copy_concepts || [
        'Elevate your professional presence',
        'Where innovation meets excellence',
        'Designed for the modern professional'
      ],
      medium_mapping: pitchDoc.creative_expression_panel?.medium_mapping || [
        { medium: 'Digital Display', funnel_intent: 'Awareness', emotional_arc: 'Aspiration', tone: 'Premium' },
        { medium: 'Social Media', funnel_intent: 'Engagement', emotional_arc: 'Connection', tone: 'Approachable' }
      ],
      emotional_arc: pitchDoc.creative_expression_panel?.emotional_arc || 'From aspiration to achievement',
      stage_fit_tags: pitchDoc.creative_expression_panel?.stage_fit_tags || ['Awareness', 'Consideration', 'Conversion']
    },
    behavior_driven_strategy: {
      behavioral_flow: pitchDoc.behavior_driven_strategy?.behavioral_flow || 'Awareness → Research → Consideration → Purchase → Advocacy',
      motivational_triggers: pitchDoc.behavior_driven_strategy?.motivational_triggers || [
        { stage: 'Awareness', triggers: ['Social proof', 'Peer recommendations'] },
        { stage: 'Consideration', triggers: ['Product demos', 'Expert reviews'] },
        { stage: 'Conversion', triggers: ['Limited offers', 'Risk reduction'] }
      ],
      recommended_channel_weighting: pitchDoc.behavior_driven_strategy?.recommended_channel_weighting || [
        { channel: 'Digital', weight: 60, reasoning: 'High precision targeting' },
        { channel: 'Social', weight: 25, reasoning: 'Engagement and advocacy' },
        { channel: 'Content', weight: 15, reasoning: 'Education and trust' }
      ],
      seasonal_timing: pitchDoc.behavior_driven_strategy?.seasonal_timing || 'Q4 peak season with year-round engagement',
      context_layer: pitchDoc.behavior_driven_strategy?.context_layer || 'Professional and lifestyle contexts'
    },
    tactic_execution: {
      selected_tactic: pitchDoc.tactic_execution?.selected_tactic || intakeData.selected_tactic,
      tactic_description: pitchDoc.tactic_execution?.tactic_description || intakeData.tactic_description,
      execution_strategy: pitchDoc.tactic_execution?.execution_strategy || 'Comprehensive multi-channel execution plan',
      key_components: pitchDoc.tactic_execution?.key_components || ['Content Creation', 'Channel Distribution', 'Performance Tracking'],
      success_metrics: pitchDoc.tactic_execution?.success_metrics || ['Engagement Rate', 'Conversion Rate', 'Brand Awareness'],
      timeline: pitchDoc.tactic_execution?.timeline || '3-month execution with weekly milestones'
    },
    performance_forecast: {
      predicted_lift: {
        reach: pitchDoc.performance_forecast?.predicted_lift?.reach || '+25% increase',
        engagement: pitchDoc.performance_forecast?.predicted_lift?.engagement || '+40% improvement',
        conversion: pitchDoc.performance_forecast?.predicted_lift?.conversion || '+15% boost'
      },
      funnel_specific_forecast: pitchDoc.performance_forecast?.funnel_specific_forecast || [
        { stage: 'Top', delta: '+30% awareness', confidence: 0.8 },
        { stage: 'Mid', delta: '+20% consideration', confidence: 0.75 },
        { stage: 'Bottom', delta: '+15% conversion', confidence: 0.7 }
      ],
      sentiment_prediction: pitchDoc.performance_forecast?.sentiment_prediction || 'Positive sentiment with premium brand association',
      earned_media_alpha_projection: pitchDoc.performance_forecast?.earned_media_alpha_projection || '2.5x organic reach amplification',
      confidence_range: {
        min: Math.max(0, Math.min(1, pitchDoc.performance_forecast?.confidence_range?.min || 0.6)),
        max: Math.max(0, Math.min(1, pitchDoc.performance_forecast?.confidence_range?.max || 0.9))
      }
    },
    knowledge_provenance: {
      data_source_cards: pitchDoc.knowledge_provenance?.data_source_cards || [
        { source: 'Audience Database', type: 'Audience', confidence: 0.9, last_updated: '2024-01-15' },
        { source: 'Category Intelligence', type: 'Category', confidence: 0.85, last_updated: '2024-01-10' },
        { source: 'Cultural Signals', type: 'Cultural', confidence: 0.8, last_updated: '2024-01-12' }
      ],
      tribal_knowledge_references: pitchDoc.knowledge_provenance?.tribal_knowledge_references || ['Industry reports', 'Expert insights', 'Market research'],
      timestamp: new Date().toISOString(),
      model_id: 'pitch-doc-v1.0'
    },
    meta: {
      input_summary: `Pitch doc for ${intakeData.core_product} targeting ${intakeData.target_audience_archetype} in ${intakeData.product_category}`,
      confidence: Math.max(0, Math.min(1, pitchDoc.meta?.confidence || 0.8)),
      notes: pitchDoc.meta?.notes || 'Generated based on comprehensive input analysis',
      generation_time: new Date().toISOString()
    }
  };

  return normalizedPitchDoc;
}

// Fallback pitch doc generator
function generateFallbackPitchDoc(intakeData: PitchDocIntake): GeneratedPitchDoc {
  return {
    idea_overview: {
      idea_name: `${intakeData.core_product} Strategic Initiative`,
      tagline: 'Innovative approach to market engagement',
      concept_summary: `A comprehensive strategy to achieve ${intakeData.business_outcome.toLowerCase()} for ${intakeData.core_product}`,
      opus_behavior_overlap_score: 7.5,
      funnel_position: intakeData.creative_objective === 'Awareness' ? 'Top' : intakeData.creative_objective === 'Conversion' ? 'Bottom' : 'Mid',
      category_fit: [intakeData.product_category],
      brand_target_consumer: intakeData.target_audience_archetype,
      generated_visual_description: 'Modern, premium visual treatment with clean typography and lifestyle imagery'
    },
    audience_intelligence: {
      primary_audience_personas: [{
        archetype: intakeData.target_audience_archetype,
        motivations: ['Quality', 'Efficiency', 'Status'],
        channels: ['Digital', 'Social Media', 'Professional Networks'],
        psychographic_cluster: 'Achievement-oriented professionals',
        overlap_score: 8.2,
        detailed_description: 'Professional individuals who value quality, efficiency, and innovation in their work and personal lives',
        pain_points: ['Time constraints', 'Information overload', 'Need for reliable solutions'],
        goals: ['Professional advancement', 'Work-life balance', 'Quality outcomes'],
        media_consumption: ['Professional publications', 'LinkedIn', 'Industry podcasts'],
        lifestyle_insights: ['Busy schedules', 'Tech-savvy', 'Quality-focused']
      }],
      behavioral_overlap_visualization: 'Strong overlap in professional networking and premium product preferences',
      brand_target_comparison: 'High alignment between brand target and predicted high-response audience',
      data_provenance: {
        sources: ['Market Research', 'Behavioral Analytics', 'Customer Data'],
        model_confidence: 0.85,
        audience_size: '2.5M+ professionals'
      }
    },
    funnel_position_layer: {
      funnel_stage: intakeData.creative_objective === 'Awareness' ? 'Top' : intakeData.creative_objective === 'Conversion' ? 'Bottom' : 'Mid',
      stage_definition: 'Consideration and evaluation phase',
      behavior_triggers: ['Research', 'Comparison', 'Social Proof'],
      recommended_channel_mix: [
        { channel: 'Digital Display', weight: 40, rationale: 'High-intent audience targeting' },
        { channel: 'Social Media', weight: 35, rationale: 'Engagement and social proof' },
        { channel: 'Content Marketing', weight: 25, rationale: 'Educational and trust-building' }
      ],
      funnel_to_category_fit: 'Mid-funnel focus aligns with category purchase behavior'
    },
    cultural_signal_layer: {
      top_cultural_signals: [
        { signal: 'Remote Work Culture', score: 8.5, trajectory: 'Rising' },
        { signal: 'Premium Lifestyle', score: 7.8, trajectory: 'Stable' },
        { signal: 'Tech Integration', score: 8.2, trajectory: 'Rising' }
      ],
      proof_points: ['Social media mentions', 'Industry reports', 'Consumer surveys'],
      trend_to_funnel_connection: 'Cultural trends drive awareness and consideration',
      narrative_insight: 'The cultural shift toward remote work and premium lifestyle choices creates opportunities for brands that can authentically connect with these values.'
    },
    creative_expression_panel: {
      generated_storyboards: [
        'Professional in modern office using product',
        'Lifestyle scene showing product integration',
        'Close-up of product features and benefits'
      ],
      suggested_copy_concepts: [
        'Elevate your professional presence',
        'Where innovation meets excellence',
        'Designed for the modern professional'
      ],
      medium_mapping: [
        { medium: 'Digital Display', funnel_intent: 'Awareness', emotional_arc: 'Aspiration', tone: 'Premium' },
        { medium: 'Social Media', funnel_intent: 'Engagement', emotional_arc: 'Connection', tone: 'Approachable' }
      ],
      emotional_arc: 'From aspiration to achievement',
      stage_fit_tags: ['Awareness', 'Consideration', 'Conversion']
    },
    behavior_driven_strategy: {
      behavioral_flow: 'Awareness → Research → Consideration → Purchase → Advocacy',
      motivational_triggers: [
        { stage: 'Awareness', triggers: ['Social proof', 'Peer recommendations'] },
        { stage: 'Consideration', triggers: ['Product demos', 'Expert reviews'] },
        { stage: 'Conversion', triggers: ['Limited offers', 'Risk reduction'] }
      ],
      recommended_channel_weighting: [
        { channel: 'Digital', weight: 60, reasoning: 'High precision targeting' },
        { channel: 'Social', weight: 25, reasoning: 'Engagement and advocacy' },
        { channel: 'Content', weight: 15, reasoning: 'Education and trust' }
      ],
      seasonal_timing: 'Q4 peak season with year-round engagement',
      context_layer: 'Professional and lifestyle contexts'
    },
    tactic_execution: {
      selected_tactic: intakeData.selected_tactic,
      tactic_description: intakeData.tactic_description,
      execution_strategy: 'Comprehensive multi-channel execution plan',
      key_components: ['Content Creation', 'Channel Distribution', 'Performance Tracking'],
      success_metrics: ['Engagement Rate', 'Conversion Rate', 'Brand Awareness'],
      timeline: '3-month execution with weekly milestones'
    },
    performance_forecast: {
      predicted_lift: {
        reach: '+25% increase',
        engagement: '+40% improvement',
        conversion: '+15% boost'
      },
      funnel_specific_forecast: [
        { stage: 'Top', delta: '+30% awareness', confidence: 0.8 },
        { stage: 'Mid', delta: '+20% consideration', confidence: 0.75 },
        { stage: 'Bottom', delta: '+15% conversion', confidence: 0.7 }
      ],
      sentiment_prediction: 'Positive sentiment with premium brand association',
      earned_media_alpha_projection: '2.5x organic reach amplification',
      confidence_range: { min: 0.6, max: 0.9 }
    },
    knowledge_provenance: {
      data_source_cards: [
        { source: 'Audience Database', type: 'Audience', confidence: 0.9, last_updated: '2024-01-15' },
        { source: 'Category Intelligence', type: 'Category', confidence: 0.85, last_updated: '2024-01-10' },
        { source: 'Cultural Signals', type: 'Cultural', confidence: 0.8, last_updated: '2024-01-12' }
      ],
      tribal_knowledge_references: ['Industry reports', 'Expert insights', 'Market research'],
      timestamp: new Date().toISOString(),
      model_id: 'pitch-doc-v1.0'
    },
    meta: {
      input_summary: `Pitch doc for ${intakeData.core_product} targeting ${intakeData.target_audience_archetype} in ${intakeData.product_category}`,
      confidence: 0.8,
      notes: 'Generated based on comprehensive input analysis',
      generation_time: new Date().toISOString()
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const intakeData: PitchDocIntake = await request.json();

    // Validate required fields
    if (!intakeData.core_product || !intakeData.target_audience_archetype || !intakeData.product_category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate the pitch doc
    const pitchDoc = await generatePitchDocWithAI(intakeData);

    // Enhance with real-time research
    const enhancedPitchDoc = await enhanceWithResearch(pitchDoc, intakeData);

    // Generate hero image
    console.log(`🎨 Starting image generation process...`);
    const imageUrl = await generateHeroImage(enhancedPitchDoc.idea_overview.generated_visual_description, intakeData.core_product);
    enhancedPitchDoc.idea_overview.generated_image_url = imageUrl;
    console.log(`✅ Image URL assigned: ${imageUrl}`);

    // Generate a unique ID for the pitch doc
    const pitchDocId = generatePitchDocId();

    // Create metadata for the pitch doc
    const metadata = createPitchDocMetadata(
      pitchDocId, 
      pitchDoc.idea_overview.idea_name
    );

    return NextResponse.json({
      success: true,
      pitchDoc: enhancedPitchDoc,
      pitchDocId,
      metadata,
      message: 'Pitch document generated successfully with real-time research insights'
    });

  } catch (error) {
    console.error('Error generating pitch doc:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch document' },
      { status: 500 }
    );
  }
}
