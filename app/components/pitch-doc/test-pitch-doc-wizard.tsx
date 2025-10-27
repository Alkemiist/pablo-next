'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Upload, Image as ImageIcon, CheckCircle, Sparkles } from 'lucide-react';
import { PitchDocIntake } from '@/lib/pitch-doc-types';
import { Brand, Product, Persona } from '@/lib/variables-types';

interface TestPitchDocWizardProps {
  onComplete: (data: PitchDocIntake) => void;
  onClose: () => void;
  initialData?: PitchDocIntake;
  selectedVariables?: {
    brand: Brand | null;
    product: Product | null;
    persona: Persona | null;
  };
}

export default function TestPitchDocWizard({ onComplete, onClose, initialData, selectedVariables }: TestPitchDocWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Pre-fill form data with selected variables
  const getInitialFormData = (): PitchDocIntake => {
    const baseData = {
      brand_name: initialData?.brand_name || '',
      core_product: initialData?.core_product || '',
      target_audience_archetype: initialData?.target_audience_archetype || '',
      product_category: initialData?.product_category || '',
      business_outcome: initialData?.business_outcome || '',
      brand_tone_voice: initialData?.brand_tone_voice || '',
      creative_guardrails: initialData?.creative_guardrails || '',
      core_opportunity: initialData?.core_opportunity || '',
      creative_objective: initialData?.creative_objective || '',
      strategic_job_to_be_done: initialData?.strategic_job_to_be_done || '',
      desired_user_action: initialData?.desired_user_action || '',
      primary_audience: initialData?.primary_audience || '',
      secondary_audience: initialData?.secondary_audience || '',
      audience_optimization_mode: initialData?.audience_optimization_mode || 'strict',
      cultural_signal: initialData?.cultural_signal || '',
      timing_context: initialData?.timing_context || '',
      channel_preferences: initialData?.channel_preferences || '',
      preferred_mediums: initialData?.preferred_mediums || [],
      emotional_tone: initialData?.emotional_tone || '',
      primary_kpi: initialData?.primary_kpi || '',
      secondary_kpis: initialData?.secondary_kpis || [],
      historical_data_connected: initialData?.historical_data_connected || false,
      selected_tactic: initialData?.selected_tactic || '',
      tactic_description: initialData?.tactic_description || '',
    };

    // Override with selected variables if available
    if (selectedVariables) {
      if (selectedVariables.brand) {
        baseData.brand_name = selectedVariables.brand.name;
        baseData.brand_tone_voice = selectedVariables.brand.toneOfVoice;
        baseData.creative_guardrails = selectedVariables.brand.dosAndDonts;
      }
      
      if (selectedVariables.product) {
        baseData.core_product = `${selectedVariables.product.name}: ${selectedVariables.product.problemSolved}. Key features: ${selectedVariables.product.keyFeatures.join(', ')}. Emotional benefit: ${selectedVariables.product.emotionalBenefit}`;
        baseData.product_category = selectedVariables.product.category;
        baseData.strategic_job_to_be_done = selectedVariables.product.positioning;
      }
      
      if (selectedVariables.persona) {
        baseData.target_audience_archetype = selectedVariables.persona.name;
        baseData.primary_audience = `${selectedVariables.persona.demographics}. ${selectedVariables.persona.psychographics}. Pain points: ${selectedVariables.persona.painPoints}. Desired transformation: ${selectedVariables.persona.desiredTransformation}`;
      }
    }

    return baseData;
  };

  const [formData, setFormData] = useState<PitchDocIntake>(getInitialFormData());

  // Filter out fields that are already answered by variables
  const getFilteredSteps = () => {
    const allSteps = [
      {
        title: 'Brand + Product Context',
        subtitle: 'Establish your brand foundation and product positioning',
        icon: '🏢',
        fields: [
          { 
            key: 'brand_name', 
            label: 'Brand Name', 
            type: 'text', 
            required: true,
            placeholder: 'e.g., "Sony", "Apple", "Bose"',
            guidance: 'Enter your brand name. This helps us gather contextual insights and competitive intelligence.',
            answeredByVariable: selectedVariables?.brand ? 'brand' : null
          },
          { 
            key: 'core_product', 
            label: 'Core Product', 
            type: 'textarea', 
            required: true,
            placeholder: 'e.g., "Premium wireless headphones with active noise cancellation and AI-powered sound optimization"',
            guidance: 'Describe the specific product or service this opportunity relates to. Be detailed about features and benefits.',
            answeredByVariable: selectedVariables?.product ? 'product' : null
          },
          { 
            key: 'target_audience_archetype', 
            label: 'Target Audience Archetype', 
            type: 'select', 
            options: ['Modern Explorer', 'Conscious Optimizer', 'Street Aestheticist', 'Tech Pioneer', 'Wellness Seeker', 'Creative Professional', 'Urban Achiever', 'Family Guardian', 'Luxury Enthusiast', 'Value Seeker'], 
            required: true,
            guidance: 'Select the primary audience archetype that best represents your target consumer based on your brand\'s audience research.',
            answeredByVariable: selectedVariables?.persona ? 'persona' : null
          },
          { 
            key: 'product_category', 
            label: 'Product Category', 
            type: 'select', 
            options: ['Auto', 'Beauty', 'Sportswear', 'Finance', 'CPG', 'Entertainment', 'Technology', 'Healthcare', 'Food & Beverage', 'Travel', 'Fashion', 'Home & Garden'], 
            required: true,
            guidance: 'Select the primary category your product operates in. This helps with category-specific insights and recommendations.',
            answeredByVariable: selectedVariables?.product ? 'product' : null
          },
          { 
            key: 'business_outcome', 
            label: 'Desired Business Outcome', 
            type: 'select', 
            options: ['Awareness', 'Preference', 'Conversion', 'Retention', 'Advocacy'], 
            required: true,
            guidance: 'What is the primary business outcome you want to achieve? This determines the strategic focus of your pitch.'
          },
          { 
            key: 'brand_tone_voice', 
            label: 'Brand Tone & Voice', 
            type: 'textarea', 
            required: true,
            placeholder: 'e.g., "Bold and premium, yet approachable. Confident without being arrogant. Innovative but grounded in real benefits."',
            guidance: 'Describe your brand\'s personality, tone, and voice. How should your brand communicate and be perceived?',
            answeredByVariable: selectedVariables?.brand ? 'brand' : null
          },
          { 
            key: 'creative_guardrails', 
            label: 'Creative Guardrails & Restrictions', 
            type: 'textarea', 
            required: false,
            placeholder: 'e.g., "No humor, avoid politics, no competitor references, maintain premium positioning, comply with FDA guidelines"',
            guidance: 'List any creative restrictions, brand guidelines, legal constraints, or elements to avoid in your marketing.',
            answeredByVariable: selectedVariables?.brand ? 'brand' : null
          }
        ]
      },
    {
      title: 'Opportunity Intent',
      subtitle: 'Define the core problem and strategic opportunity',
      icon: '🎯',
      fields: [
        { 
          key: 'core_opportunity', 
          label: 'Core Opportunity', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Break through the noise in a saturated headphone market by positioning as the premium choice for professionals who demand both quality and style"',
          guidance: 'What is the core opportunity this idea aims to unlock? Describe the market gap, competitive advantage, or strategic moment you\'re capitalizing on.'
        },
        { 
          key: 'creative_objective', 
          label: 'Creative Objective',
          type: 'select', 
          options: ['Awareness', 'Education', 'Engagement', 'Social Proof', 'Conversion', 'Loyalty'], 
          required: true,
          guidance: 'What is the primary creative objective? This determines the funnel position and strategic approach.'
        },
          { 
            key: 'strategic_job_to_be_done', 
            label: 'Strategic Job-to-be-Done', 
            type: 'textarea', 
            required: true,
            placeholder: 'e.g., "Help busy professionals find focus and productivity through superior audio quality and seamless connectivity"',
            guidance: 'In one sentence, describe the fundamental job your product does for customers. Focus on the core value delivered.',
            answeredByVariable: selectedVariables?.product ? 'product' : null
          },
        { 
          key: 'desired_user_action', 
          label: 'Desired User Action', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Visit our website, request a demo, download our app, or make a purchase within 30 days"',
          guidance: 'What specific action do you want people to take after engaging with this idea? Be specific about the next step in their journey.'
        }
      ]
    },
    {
      title: 'Audience Intelligence',
      subtitle: 'Define your target audience and optimization strategy',
      icon: '👥',
      fields: [
        { 
          key: 'primary_audience', 
          label: 'Primary Audience', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Tech-savvy professionals (28-45) who value quality, efficiency, and style. Urban professionals with disposable income $75K+, who work in open offices or travel frequently"',
          guidance: 'Define your primary target audience with demographics, psychographics, behaviors, and specific characteristics.',
          answeredByVariable: selectedVariables?.persona ? 'persona' : null
        },
        { 
          key: 'secondary_audience', 
          label: 'Secondary Audience (Optional)', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Audiophiles and music enthusiasts who appreciate premium sound quality and are willing to invest in high-end audio equipment"',
          guidance: 'If applicable, define a secondary audience that might also respond well to this idea.'
        },
        { 
          key: 'audience_optimization_mode', 
          label: 'Audience Optimization Strategy', 
          type: 'select', 
          options: [
            { value: 'strict', label: 'Strictly optimize for brand audience only' },
            { value: 'adjacent', label: 'Allow high-performing adjacent audiences' }
          ], 
          required: true,
          guidance: 'Should we strictly focus on your defined brand audience, or allow the system to identify and optimize for high-performing adjacent audiences?'
        }
      ]
    },
    {
      title: 'Cultural & Contextual Inputs',
      subtitle: 'Connect your idea to cultural moments and timing',
      icon: '🌍',
      fields: [
        { 
          key: 'cultural_signal', 
          label: 'Cultural Signal or Trend', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "The rise of remote work and focus on work-life balance, increased demand for premium home office equipment"',
          guidance: 'Is there a cultural signal, trend, or moment this opportunity is tied to? This helps create culturally relevant and timely ideas.'
        },
        { 
          key: 'timing_context', 
          label: 'Timing Context', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Q4 holiday season, back-to-school period, or product launch window in March"',
          guidance: 'Are there specific timing considerations, seasons, holidays, or launch windows that affect this opportunity?'
        },
        { 
          key: 'channel_preferences', 
          label: 'Channel Preferences', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Prioritize LinkedIn and professional podcasts, avoid TikTok, focus on B2B publications"',
          guidance: 'Are there specific channels or contexts the brand wants to prioritize or avoid? This helps tailor the channel strategy.'
        }
      ]
    },
    {
      title: 'Creative Direction',
      subtitle: 'Define your creative expression and emotional approach',
      icon: '🎨',
      fields: [
        { 
          key: 'preferred_mediums', 
          label: 'Preferred Creative Mediums', 
          type: 'multiselect', 
          options: ['Film', 'OOH', 'Influencer', 'UGC', 'AR', 'Experiential', 'Music', 'Social', 'CRM', 'Podcast', 'Print', 'Digital Display'], 
          required: true,
          guidance: 'Select the creative mediums you want to prioritize. This drives storyboard tone, copy direction, and channel mappings.'
        },
        { 
          key: 'emotional_tone', 
          label: 'Emotional Tone', 
          type: 'select', 
          options: ['Hopeful', 'Rebellious', 'Intimate', 'Funny', 'Premium', 'Inspiring', 'Confident', 'Playful', 'Serious', 'Aspirational', 'Relatable', 'Authoritative'], 
          required: true,
          guidance: 'What emotional tone should the idea evoke? This influences the creative direction and messaging approach.'
        }
      ]
    },
    {
      title: 'Success Measures',
      subtitle: 'Define your KPIs and measurement approach',
      icon: '📊',
      fields: [
        { 
          key: 'primary_kpi', 
          label: 'Primary KPI', 
          type: 'select', 
          options: ['Reach', 'Engagement', 'CTR', 'Conversion', 'Lift', 'EMV', 'Brand Awareness', 'Purchase Intent', 'Share of Voice', 'Customer Acquisition Cost'], 
          required: true,
          guidance: 'What is the primary metric you want to optimize for? This drives the performance forecast and success measurement.'
        },
        { 
          key: 'secondary_kpis', 
          label: 'Secondary KPIs (Optional)', 
          type: 'multiselect', 
          options: ['Reach', 'Engagement', 'CTR', 'Conversion', 'Lift', 'EMV', 'Brand Awareness', 'Purchase Intent', 'Share of Voice', 'Customer Acquisition Cost'], 
          required: false,
          guidance: 'Select additional metrics you want to track and optimize for alongside your primary KPI.'
        },
        { 
          key: 'historical_data_connected', 
          label: 'Historical Data Connected', 
          type: 'boolean', 
          required: true,
          guidance: 'Does the brand have historical campaign data connected to the system? This helps improve forecast accuracy.'
        }
      ]
    },
    {
      title: 'Tactic Selection',
      subtitle: 'Choose your executable marketing tactic',
      icon: '🎯',
      fields: [
        { 
          key: 'selected_tactic', 
          label: 'Selected Tactic', 
          type: 'select', 
          options: [
            'Social media brand campaign (paid + organic)',
            'Influencer or creator partnership campaign',
            'PR launch / press release distribution',
            'UGC (user-generated content) challenge or hashtag campaign',
            'Interactive polls / quizzes / contests on social or web',
            'Branded live events (virtual or physical)',
            'Paid search (Google Ads / SEM) campaigns',
            'Paid social conversion campaigns (Meta, TikTok, LinkedIn, etc.)',
            'Lead magnet campaign (e.g., downloadable guide, quiz, early access)',
            'Email drip or nurture sequence',
            'Retargeting / remarketing ads',
            'Loyalty program rollout (points, tiers, VIP perks)',
            'Hero video or manifesto film',
            'Branded documentary or mini-series',
            'SEO content campaign (pillar pages + supporting blogs)',
            'Out-of-home advertising (billboards, transit, street posters)',
            'Brand stunt / experiential pop-up',
            'Strategic co-branding partnership',
            'A/B or multivariate creative testing',
            'Social listening & sentiment analysis'
          ], 
          required: true,
          guidance: 'Select the primary marketing tactic that will drive your campaign execution. This becomes the core executable element of your pitch.'
        },
        { 
          key: 'tactic_description', 
          label: 'Tactic Description', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "A comprehensive influencer partnership campaign targeting tech professionals on LinkedIn and Twitter, featuring authentic product demonstrations and behind-the-scenes content creation"',
          guidance: 'Provide a detailed description of how you envision executing this tactic. Include specific elements, platforms, and approaches.'
        }
      ]
    }
  ];

  // Filter out fields that are already answered by variables
  const filteredSteps = allSteps.map(step => ({
    ...step,
    fields: step.fields.filter(field => !field.answeredByVariable)
  })).filter(step => step.fields.length > 0); // Remove steps with no fields

  return filteredSteps;
  };

  const steps = getFilteredSteps();

  const handleInputChange = (key: keyof PitchDocIntake, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const currentStepFields = steps[currentStep].fields;
    return currentStepFields.every(field => {
      if (field.required) {
        const value = formData[field.key as keyof PitchDocIntake];
        if (field.type === 'multiselect') {
          return Array.isArray(value) && value.length > 0;
        }
        if (field.type === 'boolean') {
          return typeof value === 'boolean';
        }
        return typeof value === 'string' && value.trim() !== '';
      }
      return true;
    });
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back Button */}
          <div className="flex items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-600 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          </div>
          
          {/* Center: Title and Progress */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentStepData.icon}</span>
                <h2 className="text-lg font-semibold text-white">{currentStepData.title}</h2>
              </div>
              <p className="text-xs text-neutral-400">{currentStepData.subtitle}</p>
            </div>
            <div className="h-6 w-px bg-neutral-700" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="w-32 bg-neutral-800 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Right: Close and Continue */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="size-4" />
                  Generate Pitch Doc
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800 hover:border-neutral-500 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl w-full px-8 py-8 mx-auto">
          
          {/* Variable Summary */}
          {selectedVariables && (selectedVariables.brand || selectedVariables.product || selectedVariables.persona) && (
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Using Your Selected Variables</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedVariables.brand && (
                  <div className="bg-neutral-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">Brand: {selectedVariables.brand.name}</h4>
                    <p className="text-sm text-neutral-300">{selectedVariables.brand.mission}</p>
                  </div>
                )}
                {selectedVariables.product && (
                  <div className="bg-neutral-800 rounded-lg p-4">
                    <h4 className="font-medium text-green-400 mb-2">Product: {selectedVariables.product.name}</h4>
                    <p className="text-sm text-neutral-300">{selectedVariables.product.problemSolved}</p>
                  </div>
                )}
                {selectedVariables.persona && (
                  <div className="bg-neutral-800 rounded-lg p-4">
                    <h4 className="font-medium text-purple-400 mb-2">Persona: {selectedVariables.persona.name}</h4>
                    <p className="text-sm text-neutral-300">{selectedVariables.persona.demographics}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {currentStepData.fields.map((field) => (
              <div key={field.key} className="group">
                <label className="block text-sm font-semibold text-white mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                  {(field as any).preFilled && <span className="text-green-400 ml-2 text-xs">(Pre-filled from variable)</span>}
                </label>
                
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  {field.guidance}
                </p>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key as keyof PitchDocIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof PitchDocIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none backdrop-blur-sm"
                    rows={3}
                    placeholder={(field as any).placeholder || ''}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key as keyof PitchDocIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof PitchDocIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
                        {typeof option === 'string' ? option : option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'multiselect' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {field.options?.map((option) => {
                        const optionValue = typeof option === 'string' ? option : option.value;
                        const optionLabel = typeof option === 'string' ? option : option.label;
                        const isSelected = (formData[field.key as keyof PitchDocIntake] as string[] || []).includes(optionValue);
                        return (
                          <button
                            key={optionValue}
                            type="button"
                            onClick={() => {
                              const currentValues = formData[field.key as keyof PitchDocIntake] as string[] || [];
                              const newValues = isSelected 
                                ? currentValues.filter(v => v !== optionValue)
                                : [...currentValues, optionValue];
                              handleInputChange(field.key as keyof PitchDocIntake, newValues);
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'bg-green-600 text-white border border-green-500'
                                : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
                            }`}
                          >
                            {optionLabel}
                          </button>
                        );
                      })}
                    </div>
                    {(formData[field.key as keyof PitchDocIntake] as string[] || []).length > 0 && (
                      <div className="text-xs text-neutral-400">
                        Selected: {(formData[field.key as keyof PitchDocIntake] as string[] || []).join(', ')}
                      </div>
                    )}
                  </div>
                ) : field.type === 'boolean' ? (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.key as keyof PitchDocIntake, true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData[field.key as keyof PitchDocIntake] === true
                          ? 'bg-green-600 text-white border border-green-500'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.key as keyof PitchDocIntake, false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData[field.key as keyof PitchDocIntake] === false
                          ? 'bg-green-600 text-white border border-green-500'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData[field.key as keyof PitchDocIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof PitchDocIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm"
                    placeholder={(field as any).placeholder || ''}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
