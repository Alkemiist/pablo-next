'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Upload, Image as ImageIcon } from 'lucide-react';
import { StreamlinedBriefIntake } from '@/lib/streamlined-brief-types';

interface StreamlinedWizardProps {
  onComplete: (data: StreamlinedBriefIntake) => void;
  onClose: () => void;
  initialData?: StreamlinedBriefIntake;
}

export default function StreamlinedWizard({ onComplete, onClose, initialData }: StreamlinedWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<StreamlinedBriefIntake>({
    project_name: initialData?.project_name || '',
    core_idea: initialData?.core_idea || '',
    business_challenge: initialData?.business_challenge || '',
    target_audience: initialData?.target_audience || '',
    budget_range: initialData?.budget_range || '',
    brand_name: initialData?.brand_name || '',
    product_service: initialData?.product_service || '',
    key_differentiator: initialData?.key_differentiator || '',
    primary_goal: initialData?.primary_goal || '',
    platforms: initialData?.platforms || '',
    timeline: initialData?.timeline || '',
    must_have_elements: initialData?.must_have_elements || '',
    visual_direction: initialData?.visual_direction || undefined,
    look_and_feel: initialData?.look_and_feel || '',
    // Advanced strategic inputs
    industry_sector: initialData?.industry_sector || '',
    company_size: initialData?.company_size || '',
    market_maturity: initialData?.market_maturity || '',
    competitive_landscape: initialData?.competitive_landscape || '',
    regulatory_environment: initialData?.regulatory_environment || '',
    seasonal_factors: initialData?.seasonal_factors || '',
    geographic_scope: initialData?.geographic_scope || '',
    customer_segments: initialData?.customer_segments || '',
    brand_positioning: initialData?.brand_positioning || '',
    success_metrics: initialData?.success_metrics || '',
    risk_tolerance: initialData?.risk_tolerance || '',
    innovation_level: initialData?.innovation_level || ''
  });

  const steps = [
    {
      title: 'Strategic Foundation',
      subtitle: 'Define your core business strategy and market context',
      fields: [
        { 
          key: 'project_name', 
          label: 'Project Name', 
          type: 'text', 
          required: true,
          placeholder: 'e.g., "Summer 2024 Product Launch"',
          guidance: 'Choose a clear, descriptive name that captures the essence of your campaign or initiative.'
        },
        { 
          key: 'core_idea', 
          label: 'Core Strategic Idea', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Revolutionize home cooking with AI-powered meal planning that adapts to dietary preferences and reduces food waste"',
          guidance: 'Describe the central concept or value proposition in 1-2 sentences. Focus on the unique benefit you provide.'
        },
        { 
          key: 'business_challenge', 
          label: 'Business Challenge', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Low brand awareness among millennials, declining market share to competitors, need to establish premium positioning"',
          guidance: 'Identify the specific business problems you need to solve. Be concrete about market challenges, competitive threats, or internal obstacles.'
        },
        { 
          key: 'target_audience', 
          label: 'Target Audience', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Tech-savvy millennials (25-35) who value convenience, sustainability, and health. Urban professionals with disposable income $50K+, busy lifestyles"',
          guidance: 'Define your ideal customer with demographics, psychographics, and behaviors. Include age, income, interests, and pain points.'
        },
        { 
          key: 'budget_range', 
          label: 'Budget Range', 
          type: 'select', 
          options: ['Under $10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K+'], 
          required: true,
          guidance: 'Select the budget range that best fits your total marketing investment for this project.'
        }
      ]
    },
    {
      title: 'Brand & Product',
      subtitle: 'Establish your brand identity and product positioning',
      fields: [
        { 
          key: 'brand_name', 
          label: 'Brand Name', 
          type: 'text', 
          required: true,
          placeholder: 'e.g., "FreshAI"',
          guidance: 'Enter your company or brand name as it should appear in marketing materials.'
        },
        { 
          key: 'product_service', 
          label: 'Product/Service', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "AI-powered meal planning app with grocery delivery integration, personalized recipes, and nutrition tracking"',
          guidance: 'Describe what you\'re selling in detail. Include key features, benefits, and how it works.'
        },
        { 
          key: 'key_differentiator', 
          label: 'Key Differentiator', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Only platform that combines AI meal planning with zero-waste grocery delivery and real-time nutrition optimization"',
          guidance: 'What makes you unique? Highlight your competitive advantage, unique features, or superior value proposition.'
        },
        { 
          key: 'brand_positioning', 
          label: 'Brand Positioning', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Premium AI-powered lifestyle brand that makes healthy eating effortless and sustainable"',
          guidance: 'How do you want to be perceived in the market? Define your brand\'s position relative to competitors.'
        }
      ]
    },
    {
      title: 'Market Context',
      subtitle: 'Understand your competitive landscape and market dynamics',
      fields: [
        { 
          key: 'industry_sector', 
          label: 'Industry Sector', 
          type: 'select', 
          options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Food & Beverage', 'Automotive', 'Travel', 'Education', 'Real Estate', 'Other'], 
          required: false,
          guidance: 'Select the primary industry sector your business operates in.'
        },
        { 
          key: 'company_size', 
          label: 'Company Size', 
          type: 'select', 
          options: ['Startup (1-10 employees)', 'Small (11-50 employees)', 'Medium (51-200 employees)', 'Large (201-1000 employees)', 'Enterprise (1000+ employees)'], 
          required: false,
          guidance: 'Select the size category that best describes your organization.'
        },
        { 
          key: 'market_maturity', 
          label: 'Market Maturity', 
          type: 'select', 
          options: ['Emerging', 'Growing', 'Mature', 'Declining'], 
          required: false,
          guidance: 'How would you describe the maturity of your target market?'
        },
        { 
          key: 'competitive_landscape', 
          label: 'Competitive Landscape', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Highly competitive with 3 major players dominating 70% market share. New entrants focusing on AI differentiation."',
          guidance: 'Describe your competitive environment, key competitors, and market dynamics.'
        },
        { 
          key: 'geographic_scope', 
          label: 'Geographic Scope', 
          type: 'select', 
          options: ['Local', 'Regional', 'National', 'International', 'Global'], 
          required: false,
          guidance: 'What is the geographic scope of your marketing efforts?'
        }
      ]
    },
    {
      title: 'Success & Constraints',
      subtitle: 'Define your objectives and operational parameters',
      fields: [
        { 
          key: 'primary_goal', 
          label: 'Primary Goal', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Increase app downloads by 40% and achieve 10,000 active users within 6 months"',
          guidance: 'Define your main objective with specific, measurable targets. Include metrics like sales, leads, awareness, or engagement.'
        },
        { 
          key: 'success_metrics', 
          label: 'Success Metrics', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Brand awareness lift 25%, cost per acquisition <$50, customer lifetime value >$200, net promoter score >70"',
          guidance: 'List the specific metrics you\'ll use to measure success. Include both leading and lagging indicators.'
        },
        { 
          key: 'platforms', 
          label: 'Marketing Platforms', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Instagram, TikTok, Google Ads, Email Marketing, Influencer partnerships"',
          guidance: 'List the marketing channels where you want to focus your efforts. Be specific about platforms and tactics.'
        },
        { 
          key: 'timeline', 
          label: 'Project Timeline', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "3-month campaign starting March 1st, with weekly content releases and monthly performance reviews"',
          guidance: 'Specify your project timeline including start date, duration, and key milestones or deadlines.'
        },
        { 
          key: 'must_have_elements', 
          label: 'Must-Have Elements', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Include sustainability messaging, feature user testimonials, maintain premium brand voice, comply with FDA nutrition guidelines"',
          guidance: 'List any mandatory requirements, brand guidelines, legal constraints, or specific elements that must be included.'
        }
      ]
    },
    {
      title: 'Strategic Considerations',
      subtitle: 'Address risk, innovation, and environmental factors',
      fields: [
        { 
          key: 'risk_tolerance', 
          label: 'Risk Tolerance', 
          type: 'select', 
          options: ['Conservative', 'Moderate', 'Aggressive'], 
          required: false,
          guidance: 'How much risk are you willing to take with this marketing initiative?'
        },
        { 
          key: 'innovation_level', 
          label: 'Innovation Level', 
          type: 'select', 
          options: ['Traditional', 'Progressive', 'Cutting-edge'], 
          required: false,
          guidance: 'How innovative do you want your marketing approach to be?'
        },
        { 
          key: 'seasonal_factors', 
          label: 'Seasonal Factors', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Q4 holiday season boost, summer slowdown, back-to-school peak"',
          guidance: 'Describe any seasonal patterns, trends, or timing considerations that affect your business.'
        },
        { 
          key: 'regulatory_environment', 
          label: 'Regulatory Environment', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "FDA compliance for health claims, GDPR for data privacy, FTC advertising guidelines"',
          guidance: 'List any regulatory requirements, compliance considerations, or legal constraints that affect your marketing.'
        },
        { 
          key: 'customer_segments', 
          label: 'Customer Segments', 
          type: 'textarea', 
          required: false,
          placeholder: 'e.g., "Primary: Health-conscious millennials, Secondary: Busy parents, Tertiary: Fitness enthusiasts"',
          guidance: 'Define your customer segments beyond the primary target audience. Include secondary and tertiary segments.'
        }
      ]
    },
    {
      title: 'Creative Direction',
      subtitle: 'Establish visual identity and creative guidelines',
      fields: [
        { 
          key: 'visual_direction', 
          label: 'Visual Inspiration', 
          type: 'image-upload', 
          required: false,
          placeholder: 'Upload images that represent your desired look and feel',
          guidance: 'Upload 1-3 images that capture the aesthetic, mood, or style you want for your campaign. This helps establish visual direction.'
        },
        { 
          key: 'look_and_feel', 
          label: 'Desired Look & Feel', 
          type: 'textarea', 
          required: true,
          placeholder: 'e.g., "Modern minimalist with warm earth tones, clean typography, lifestyle photography with natural lighting, premium but approachable"',
          guidance: 'Describe the visual style, mood, colors, typography, and overall aesthetic you want to achieve. Be specific about tone and atmosphere.'
        }
      ]
    }
  ];

  const handleInputChange = (key: keyof StreamlinedBriefIntake, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files].slice(0, 3)); // Limit to 3 images
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Convert uploaded images to visual direction format
      const visualDirection = uploadedImages.length > 0 ? {
        images: uploadedImages.map((file, index) => ({
          id: `img_${index}`,
          filename: file.name,
          originalName: file.name,
          type: 'image' as const,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          url: URL.createObjectURL(file)
        })),
        videos: []
      } : undefined;

      onComplete({
        ...formData,
        visual_direction: visualDirection
      });
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
        const value = formData[field.key as keyof StreamlinedBriefIntake];
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
              <h2 className="text-lg font-semibold text-white">{currentStepData.title}</h2>
              <p className="text-xs text-neutral-400">{currentStepData.subtitle}</p>
            </div>
            <div className="h-6 w-px bg-neutral-700" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="w-32 bg-neutral-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? 'Generate Brief' : 'Continue'}
              <ArrowRight className="size-4" />
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
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="max-w-4xl w-full px-8">
          <div className="space-y-6">
            {currentStepData.fields.map((field) => (
              <div key={field.key} className="group">
                <label className="block text-sm font-semibold text-white mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  {field.guidance}
                </p>
                
                {field.type === 'image-upload' ? (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full px-4 py-6 bg-neutral-900/40 border-2 border-dashed border-neutral-600 rounded-xl text-neutral-400 hover:text-white hover:border-blue-500/70 hover:bg-neutral-900/60 transition-all duration-200 cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="size-6" />
                      <span className="text-sm font-medium">Click to upload images</span>
                      <span className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB each</span>
                    </button>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-neutral-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="size-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg">
                              {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key as keyof StreamlinedBriefIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof StreamlinedBriefIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-blue-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none backdrop-blur-sm"
                    rows={3}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key as keyof StreamlinedBriefIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof StreamlinedBriefIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white focus:border-blue-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[field.key as keyof StreamlinedBriefIntake] as string || ''}
                    onChange={(e) => handleInputChange(field.key as keyof StreamlinedBriefIntake, e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-blue-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
                    placeholder={field.placeholder}
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
