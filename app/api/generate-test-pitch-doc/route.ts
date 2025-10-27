import { NextRequest, NextResponse } from 'next/server';
import { PitchDocIntake } from '@/lib/pitch-doc-types';

export async function POST(request: NextRequest) {
  try {
    const { intakeData, selectedVariables } = await request.json();

    if (!intakeData) {
      return NextResponse.json(
        { error: 'Intake data is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the pitch doc
    const pitchDocId = `test_pitch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the pitch document content
    const pitchDoc = {
      id: pitchDocId,
      title: `${intakeData.brand_name || 'Unknown Brand'} - ${intakeData.core_product || 'Unknown Product'} Pitch`,
      description: `Strategic pitch for ${intakeData.brand_name || 'Unknown Brand'} focusing on ${intakeData.core_opportunity || 'strategic opportunity'}`,
      brand: intakeData.brand_name || 'Unknown Brand',
      product: intakeData.core_product || 'Unknown Product',
      status: 'saved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        executiveSummary: `This pitch document outlines a strategic approach for ${intakeData.brand_name || 'Unknown Brand'} to capitalize on the opportunity: ${intakeData.core_opportunity || 'strategic opportunity'}. The strategy leverages ${intakeData.selected_tactic || 'selected tactic'} to achieve ${intakeData.business_outcome || 'business outcome'} among our ${intakeData.target_audience_archetype || 'target audience'} audience.`,
        
        brandContext: {
          brandName: intakeData.brand_name || 'Unknown Brand',
          toneOfVoice: intakeData.brand_tone_voice || 'Not specified',
          creativeGuardrails: intakeData.creative_guardrails || 'None specified',
          selectedVariables: selectedVariables ? {
            brand: selectedVariables.brand?.name || 'Not selected',
            product: selectedVariables.product?.name || 'Not selected',
            persona: selectedVariables.persona?.name || 'Not selected'
          } : null
        },

        productContext: {
          coreProduct: intakeData.core_product || 'Unknown Product',
          productCategory: intakeData.product_category || 'Not specified',
          strategicJobToBeDone: intakeData.strategic_job_to_be_done || 'Not specified',
          selectedVariables: selectedVariables ? {
            product: selectedVariables.product?.name || 'Not selected'
          } : null
        },

        opportunityAnalysis: {
          coreOpportunity: intakeData.core_opportunity || 'Not specified',
          creativeObjective: intakeData.creative_objective || 'Not specified',
          desiredUserAction: intakeData.desired_user_action || 'Not specified',
          businessOutcome: intakeData.business_outcome || 'Not specified'
        },

        audienceIntelligence: {
          primaryAudience: intakeData.primary_audience || 'Not specified',
          secondaryAudience: intakeData.secondary_audience || 'Not specified',
          targetAudienceArchetype: intakeData.target_audience_archetype || 'Not specified',
          audienceOptimizationMode: intakeData.audience_optimization_mode || 'strict',
          selectedVariables: selectedVariables ? {
            persona: selectedVariables.persona?.name || 'Not selected'
          } : null
        },

        culturalContext: {
          culturalSignal: intakeData.cultural_signal || 'Not specified',
          timingContext: intakeData.timing_context || 'Not specified',
          channelPreferences: intakeData.channel_preferences || 'Not specified'
        },

        creativeDirection: {
          preferredMediums: intakeData.preferred_mediums || [],
          emotionalTone: intakeData.emotional_tone || 'Not specified'
        },

        successMeasures: {
          primaryKpi: intakeData.primary_kpi || 'Not specified',
          secondaryKpis: intakeData.secondary_kpis || [],
          historicalDataConnected: intakeData.historical_data_connected || false
        },

        tacticExecution: {
          selectedTactic: intakeData.selected_tactic || 'Not specified',
          tacticDescription: intakeData.tactic_description || 'Not specified'
        },

        strategicRecommendations: [
          `Focus on ${(intakeData.emotional_tone || 'confident').toLowerCase()} emotional tone to connect with ${intakeData.target_audience_archetype || 'target audience'}`,
          `Leverage ${(intakeData.preferred_mediums || ['Social']).join(', ')} to maximize reach and engagement`,
          `Optimize for ${intakeData.primary_kpi || 'Reach'} as the primary success metric`,
          `Implement ${intakeData.selected_tactic || 'selected tactic'} to drive ${intakeData.desired_user_action || 'desired action'}`
        ],

        performanceForecast: {
          confidence: 'High',
          expectedReach: '500K-1M',
          engagementRate: '3-5%',
          conversionRate: '2-4%',
          notes: 'Forecast based on similar campaigns and audience behavior patterns'
        }
      }
    };

    // Create metadata for the pitch doc
    const metadata = {
      id: pitchDocId,
      title: pitchDoc.title,
      description: pitchDoc.description,
      brand: intakeData.brand_name || 'Unknown Brand',
      product: intakeData.core_product || 'Unknown Product',
      status: 'saved' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'test-pitch'
    };

    return NextResponse.json({
      success: true,
      pitchDocId,
      pitchDoc,
      metadata
    });

  } catch (error) {
    console.error('Error generating test pitch doc:', error);
    return NextResponse.json(
      { error: 'Failed to generate test pitch document' },
      { status: 500 }
    );
  }
}
