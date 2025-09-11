"use client";
import { useState } from "react";
import { BriefIntake } from "@/lib/brief-types";

interface BriefWizardProps {
  onComplete: (data: BriefIntake) => void;
}

const steps = [
  {
    id: "project-context",
    title: "Project Context",
    description: "Project name, core idea, business context, and timeline",
    icon: "🚀"
  },
  {
    id: "brand",
    title: "What is your brand?",
    description: "Define your brand identity and positioning",
    icon: "🏷️"
  },
  {
    id: "product",
    title: "What product do you want to use?",
    description: "Describe your product and its unique value",
    icon: "📦"
  },
  {
    id: "audience",
    title: "What is the target audience?",
    description: "Define who you're targeting and their characteristics",
    icon: "👥"
  },
  {
    id: "objectives",
    title: "Objectives & Success",
    description: "Define intent and SMART targets",
    icon: "🎯"
  },
  {
    id: "creative-spine",
    title: "Creative Spine",
    description: "Campaign trends and creative references",
    icon: "🎨"
  },
  {
    id: "channels-formats",
    title: "Channels & Formats",
    description: "Platform, format, and creative constraints",
    icon: "📱"
  },
  {
    id: "budget-guardrails",
    title: "Budget & Guardrails",
    description: "Budget allocation and requirements",
    icon: "💰"
  },
  {
    id: "review",
    title: "Review Answers",
    description: "Review all your inputs before generating",
    icon: "📋"
  }
];

export default function BriefWizard({ onComplete }: BriefWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BriefIntake>({
    project: { name: "", core_idea: "", business_context: "", timeline: "" },
    brand: { name: "", description: "", values: [], personality: "", positioning: "" },
    product: { name: "", description: "", features: [], benefits: [], unique_selling_proposition: "" },
    audience: { primary_demographics: "", psychographics: "", pain_points: [], motivations: [], behaviors: [], media_consumption: [] },
    objectives: { intent: "", smart_targets: [], success_metrics: [], kpis: [] },
    creative_spine: { trend_connection: "", creative_references: [], mood_boards: [], visual_direction: "" },
    channels_formats: { platforms: [], formats: [], creative_constraints: [], technical_requirements: [] },
    budget_guardrails: { budget_amount: "", budget_allocation: "", must_include: [], restrictions: [], compliance_requirements: [] }
  });

  const updateFormData = (section: keyof BriefIntake, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateArrayField = (section: keyof BriefIntake, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const getArrayValue = (section: keyof BriefIntake, field: string): string => {
    const value = (formData[section] as any)?.[field];
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value || "";
  };

  const getProcessedArray = (section: keyof BriefIntake, field: string): string[] => {
    const value = (formData[section] as any)?.[field];
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Project Context
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Project Context</h3>
              <p className="text-slate-400">Tell us about your project and business context</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.project?.name || ""}
                  onChange={(e) => updateFormData("project", "name", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Q4 Product Launch Campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Core Idea</label>
                <textarea
                  value={formData.project?.core_idea || ""}
                  onChange={(e) => updateFormData("project", "core_idea", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="What's the core concept or idea behind this campaign?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Business Context</label>
                <textarea
                  value={formData.project?.business_context || ""}
                  onChange={(e) => updateFormData("project", "business_context", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Describe the business context, challenges, and opportunities"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Timeline</label>
                <input
                  type="text"
                  value={formData.project?.timeline || ""}
                  onChange={(e) => updateFormData("project", "timeline", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., 3 months (Oct-Dec 2024)"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Brand
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">What is your brand?</h3>
              <p className="text-slate-400">Define your brand identity and positioning</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={formData.brand?.name || ""}
                  onChange={(e) => updateFormData("brand", "name", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., TechFlow Solutions"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Description</label>
                <textarea
                  value={formData.brand?.description || ""}
                  onChange={(e) => updateFormData("brand", "description", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Describe what your brand does and stands for"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Values (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("brand", "values")}
                  onChange={(e) => updateArrayField("brand", "values", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Innovation, Trust, Sustainability"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Personality</label>
                <input
                  type="text"
                  value={formData.brand?.personality || ""}
                  onChange={(e) => updateFormData("brand", "personality", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Professional yet approachable, Innovative, Reliable"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Brand Positioning</label>
                <textarea
                  value={formData.brand?.positioning || ""}
                  onChange={(e) => updateFormData("brand", "positioning", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="How do you want to be positioned in the market relative to competitors?"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Product
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">What product do you want to use?</h3>
              <p className="text-slate-400">Describe your product and its unique value</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.product?.name || ""}
                  onChange={(e) => updateFormData("product", "name", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., SmartFlow Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Product Description</label>
                <textarea
                  value={formData.product?.description || ""}
                  onChange={(e) => updateFormData("product", "description", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Describe what your product does and how it works"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("product", "features")}
                  onChange={(e) => updateArrayField("product", "features", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Real-time analytics, Cloud sync, Mobile app"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Key Benefits (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("product", "benefits")}
                  onChange={(e) => updateArrayField("product", "benefits", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Saves time, Increases productivity, Reduces errors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Unique Selling Proposition</label>
                <textarea
                  value={formData.product?.unique_selling_proposition || ""}
                  onChange={(e) => updateFormData("product", "unique_selling_proposition", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="What makes your product unique and different from competitors?"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Target Audience
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">What is the target audience?</h3>
              <p className="text-slate-400">Define who you're targeting and their characteristics</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Primary Demographics</label>
                <input
                  type="text"
                  value={formData.audience?.primary_demographics || ""}
                  onChange={(e) => updateFormData("audience", "primary_demographics", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Ages 25-45, Urban professionals, $50k+ income"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Psychographics</label>
                <textarea
                  value={formData.audience?.psychographics || ""}
                  onChange={(e) => updateFormData("audience", "psychographics", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Describe their attitudes, values, interests, and lifestyle"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Pain Points (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("audience", "pain_points")}
                  onChange={(e) => updateArrayField("audience", "pain_points", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Time constraints, Complex processes, High costs"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Motivations (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("audience", "motivations")}
                  onChange={(e) => updateArrayField("audience", "motivations", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Career advancement, Work-life balance, Efficiency"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Behaviors (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("audience", "behaviors")}
                  onChange={(e) => updateArrayField("audience", "behaviors", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Early adopters, Research-heavy buyers, Social media active"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Media Consumption (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("audience", "media_consumption")}
                  onChange={(e) => updateArrayField("audience", "media_consumption", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., LinkedIn, Industry blogs, Podcasts, YouTube"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Objectives & Success
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Objectives & Success</h3>
              <p className="text-slate-400">Define intent and SMART targets</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Campaign Intent</label>
                <textarea
                  value={formData.objectives?.intent || ""}
                  onChange={(e) => updateFormData("objectives", "intent", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="What is the primary intent of this campaign?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">SMART Targets (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("objectives", "smart_targets")}
                  onChange={(e) => updateArrayField("objectives", "smart_targets", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Increase signups by 25% in Q4, Generate 1000 qualified leads"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Success Metrics (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("objectives", "success_metrics")}
                  onChange={(e) => updateArrayField("objectives", "success_metrics", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Conversion rate, Engagement rate, Brand awareness"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Key Performance Indicators (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("objectives", "kpis")}
                  onChange={(e) => updateArrayField("objectives", "kpis", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., CTR, CPC, ROAS, LTV"
                />
              </div>
            </div>
          </div>
        );

      case 5: // Creative Spine
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Creative Spine</h3>
              <p className="text-slate-400">Campaign trends and creative references</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Trend Connection</label>
                <textarea
                  value={formData.creative_spine?.trend_connection || ""}
                  onChange={(e) => updateFormData("creative_spine", "trend_connection", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Is this campaign tied to any current trends? Describe the connection."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Creative References</label>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p>Upload creative reference images</p>
                    <p className="text-sm">Drag and drop files here, or click to browse</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="creative-references"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      updateFormData("creative_spine", "creative_references", files);
                    }}
                  />
                  <label
                    htmlFor="creative-references"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    Choose Files
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Visual Direction</label>
                <textarea
                  value={formData.creative_spine?.visual_direction || ""}
                  onChange={(e) => updateFormData("creative_spine", "visual_direction", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="Describe the visual direction, mood, and aesthetic for the campaign"
                />
              </div>
            </div>
          </div>
        );

      case 6: // Channels & Formats
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Channels & Formats</h3>
              <p className="text-slate-400">Platform, format, and creative constraints</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Platforms (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("channels_formats", "platforms")}
                  onChange={(e) => updateArrayField("channels_formats", "platforms", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Facebook, Instagram, LinkedIn, Google Ads"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Formats (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("channels_formats", "formats")}
                  onChange={(e) => updateArrayField("channels_formats", "formats", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Video ads, Carousel posts, Static images, Stories"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Creative Constraints (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("channels_formats", "creative_constraints")}
                  onChange={(e) => updateArrayField("channels_formats", "creative_constraints", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., 15-second max, Square format, No text overlay"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Technical Requirements (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("channels_formats", "technical_requirements")}
                  onChange={(e) => updateArrayField("channels_formats", "technical_requirements", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., 1080x1080px, MP4 format, 30fps"
                />
              </div>
            </div>
          </div>
        );

      case 7: // Budget & Guardrails
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Budget & Guardrails</h3>
              <p className="text-slate-400">Budget allocation and requirements</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Budget Amount</label>
                <input
                  type="text"
                  value={formData.budget_guardrails?.budget_amount || ""}
                  onChange={(e) => updateFormData("budget_guardrails", "budget_amount", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., $50,000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Budget Allocation</label>
                <textarea
                  value={formData.budget_guardrails?.budget_allocation || ""}
                  onChange={(e) => updateFormData("budget_guardrails", "budget_allocation", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                  placeholder="How do you want to allocate the budget across channels and activities?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Must Include (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("budget_guardrails", "must_include")}
                  onChange={(e) => updateArrayField("budget_guardrails", "must_include", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., Brand logo, Legal disclaimer, Contact information"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Restrictions (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("budget_guardrails", "restrictions")}
                  onChange={(e) => updateArrayField("budget_guardrails", "restrictions", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., No competitor mentions, No political content"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Compliance Requirements (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("budget_guardrails", "compliance_requirements")}
                  onChange={(e) => updateArrayField("budget_guardrails", "compliance_requirements", e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                  placeholder="e.g., GDPR compliance, Industry regulations, Accessibility standards"
                />
              </div>
            </div>
          </div>
        );

      case 8: // Review
        return (
            <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Review Answers</h3>
              <p className="text-slate-400">Review all your inputs before generating the brief</p>
            </div>
            <div className="p-8">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">Summary of Your Brief</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-blue-400">Project:</strong> 
                  <span className="text-slate-300 ml-2">{formData.project?.name || "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-green-400">Brand:</strong> 
                  <span className="text-slate-300 ml-2">{formData.brand?.name || "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-purple-400">Product:</strong> 
                  <span className="text-slate-300 ml-2">{formData.product?.name || "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-orange-400">Audience:</strong> 
                  <span className="text-slate-300 ml-2">{formData.audience?.primary_demographics || "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-pink-400">Intent:</strong> 
                  <span className="text-slate-300 ml-2">{formData.objectives?.intent ? "Defined" : "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-cyan-400">Platforms:</strong> 
                  <span className="text-slate-300 ml-2">{formData.channels_formats?.platforms?.length || 0} platforms specified</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-yellow-400">Budget:</strong> 
                  <span className="text-slate-300 ml-2">{formData.budget_guardrails?.budget_amount || "Not specified"}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl">
                  <strong className="text-red-400">Timeline:</strong> 
                  <span className="text-slate-300 ml-2">{formData.project?.timeline || "Not specified"}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  // Process the form data to convert string inputs to arrays where needed
                  const processedData = {
                    ...formData,
                    brand: {
                      ...formData.brand,
                      values: getProcessedArray("brand", "values")
                    },
                    product: {
                      ...formData.product,
                      features: getProcessedArray("product", "features"),
                      benefits: getProcessedArray("product", "benefits")
                    },
                    audience: {
                      ...formData.audience,
                      pain_points: getProcessedArray("audience", "pain_points"),
                      motivations: getProcessedArray("audience", "motivations"),
                      behaviors: getProcessedArray("audience", "behaviors"),
                      media_consumption: getProcessedArray("audience", "media_consumption")
                    },
                    objectives: {
                      ...formData.objectives,
                      smart_targets: getProcessedArray("objectives", "smart_targets"),
                      success_metrics: getProcessedArray("objectives", "success_metrics"),
                      kpis: getProcessedArray("objectives", "kpis")
                    },
                    channels_formats: {
                      ...formData.channels_formats,
                      platforms: getProcessedArray("channels_formats", "platforms"),
                      formats: getProcessedArray("channels_formats", "formats"),
                      creative_constraints: getProcessedArray("channels_formats", "creative_constraints"),
                      technical_requirements: getProcessedArray("channels_formats", "technical_requirements")
                    },
                    budget_guardrails: {
                      ...formData.budget_guardrails,
                      must_include: getProcessedArray("budget_guardrails", "must_include"),
                      restrictions: getProcessedArray("budget_guardrails", "restrictions"),
                      compliance_requirements: getProcessedArray("budget_guardrails", "compliance_requirements")
                    }
                  };
                  onComplete(processedData);
                }}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Generate Marketing Brief
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-3 transition-all duration-300 ${
                  index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-2">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 flex-shrink-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 border border-slate-700 hover:border-slate-600"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}