"use client";
import { useState } from "react";
import { StreamlinedBriefIntake } from "@/lib/streamlined-brief-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StreamlinedWizardProps {
  onComplete: (data: StreamlinedBriefIntake) => void;
  initialData?: StreamlinedBriefIntake;
}

const steps = [
  {
    id: "foundation",
    title: "Strategic Foundation",
    description: "Tell us about your business challenge and who you're targeting",
    icon: "🎯"
  },
  {
    id: "brand-product",
    title: "Brand & Product",
    description: "What are you selling and what makes you unique?",
    icon: "🏷️"
  },
  {
    id: "success-constraints",
    title: "Success & Constraints",
    description: "What do you want to achieve and what are your constraints?",
    icon: "🚀"
  }
];

export default function StreamlinedWizard({ onComplete, initialData }: StreamlinedWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StreamlinedBriefIntake>(initialData || {
    project_name: "",
    core_idea: "",
    business_challenge: "",
    target_audience: "",
    budget_range: "",
    brand_name: "",
    product_service: "",
    key_differentiator: "",
    primary_goal: "",
    platforms: "",
    timeline: "",
    must_have_elements: ""
  });

  const updateFormData = (field: keyof StreamlinedBriefIntake, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.project_name && formData.core_idea && formData.business_challenge && formData.target_audience && formData.budget_range;
      case 1:
        return formData.brand_name && formData.product_service && formData.key_differentiator;
      case 2:
        return formData.primary_goal && formData.platforms && formData.timeline;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Strategic Foundation</h3>
              <p className="text-neutral-400">Tell us about your project and business challenge</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => updateFormData("project_name", e.target.value)}
                  placeholder="e.g., Remote Work SaaS Launch"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Core Idea *</label>
                <textarea
                  value={formData.core_idea}
                  onChange={(e) => updateFormData("core_idea", e.target.value)}
                  placeholder="e.g., 'Work from anywhere, achieve everywhere' - remote work as the ultimate productivity solution"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Business Challenge *</label>
                <textarea
                  value={formData.business_challenge}
                  onChange={(e) => updateFormData("business_challenge", e.target.value)}
                  placeholder="e.g., Losing top talent to competitors with outdated office policies. Need to position as forward-thinking company."
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Target Audience *</label>
                <textarea
                  value={formData.target_audience}
                  onChange={(e) => updateFormData("target_audience", e.target.value)}
                  placeholder="e.g., Tech-savvy mid-level managers (28-35) frustrated with rigid work policies. Value flexibility and cutting-edge tools."
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Budget Range *</label>
                <Select value={formData.budget_range} onValueChange={(value) => updateFormData("budget_range", value)}>
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="Under $10K">Under $10K</SelectItem>
                    <SelectItem value="$10K - $50K">$10K - $50K</SelectItem>
                    <SelectItem value="$50K - $100K">$50K - $100K</SelectItem>
                    <SelectItem value="$100K - $500K">$100K - $500K</SelectItem>
                    <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                    <SelectItem value="Over $1M">Over $1M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Brand & Product</h3>
              <p className="text-neutral-400">Tell us about your brand and what you're selling</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Brand Name *</label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => updateFormData("brand_name", e.target.value)}
                  placeholder="e.g., FlexFlow"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Product/Service *</label>
                <textarea
                  value={formData.product_service}
                  onChange={(e) => updateFormData("product_service", e.target.value)}
                  placeholder="e.g., All-in-one remote work platform combining project management, team collaboration, and performance analytics"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Key Differentiator *</label>
                <textarea
                  value={formData.key_differentiator}
                  onChange={(e) => updateFormData("key_differentiator", e.target.value)}
                  placeholder="e.g., Built specifically for remote teams with AI-powered insights that predict collaboration bottlenecks before they happen"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Success & Execution</h3>
              <p className="text-neutral-400">Define what success looks like and where to execute</p>
            </div>
            <div className="space-y-3 p-1">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Primary Goal *</label>
                <Select value={formData.primary_goal} onValueChange={(value) => updateFormData("primary_goal", value)}>
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1">
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                    <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                    <SelectItem value="Sales/Revenue">Sales/Revenue</SelectItem>
                    <SelectItem value="Customer Engagement">Customer Engagement</SelectItem>
                    <SelectItem value="Product Launch">Product Launch</SelectItem>
                    <SelectItem value="Market Expansion">Market Expansion</SelectItem>
                    <SelectItem value="Customer Retention">Customer Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Platforms *</label>
                <textarea
                  value={formData.platforms}
                  onChange={(e) => updateFormData("platforms", e.target.value)}
                  placeholder="e.g., LinkedIn, Google Ads, YouTube, Twitter, and targeted HR/management podcasts"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Timeline *</label>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData("timeline", value)}>
                  <SelectTrigger className="w-full bg-neutral-900 border-neutral-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 m-1">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">Must-Have Elements</label>
                <textarea
                  value={formData.must_have_elements}
                  onChange={(e) => updateFormData("must_have_elements", e.target.value)}
                  placeholder="e.g., SOC 2 compliance messaging, Slack/Teams integration, Fortune 500 testimonials, professional yet approachable tone"
                  className="w-full p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24 m-1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Progress Bar with Navigation - Sticky Full Width */}
      <div className="sticky top-0 z-50 w-full bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700">
        <div className="w-full px-6">
          <div className="flex items-center justify-between py-4 w-full">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              currentStep === 0
                ? 'text-neutral-500 cursor-not-allowed bg-neutral-800'
                : 'text-white bg-neutral-700 hover:bg-neutral-600'
            }`}
            >
              Back
            </button>

            {/* Progress Steps */}
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-neutral-700'
                  }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
            className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isStepValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
            >
              {currentStep === steps.length - 1 ? 'Generate Brief' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* Step Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
