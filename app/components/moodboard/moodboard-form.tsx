'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/button/button';
import Input from '@/app/components/ui/input';
import Textarea from '@/app/components/ui/textarea';
import Select from '@/app/components/ui/select';
import Card from '@/app/components/ui/card/card';
import { MoodboardRequest } from '@/lib/types/moodboard';

interface MoodboardFormProps {
  onSubmit: (data: MoodboardRequest) => void;
  isLoading?: boolean;
}

export default function MoodboardForm({ onSubmit, isLoading = false }: MoodboardFormProps) {
  const [formData, setFormData] = useState<MoodboardRequest>({
    name: '',
    description: '',
    palette: {
      primary: '',
      secondary: '',
      accent: ''
    },
    typography: {
      heading: '',
      body: ''
    },
    images: [],
    mood: '',
    style: '',
    briefEssentials: {
      campaignGoal: '',
      targetAudience: '',
      keyMessage: '',
      brandPersonality: '',
      kpis: [],
      channels: []
    },
    motionInteraction: {
      transitions: [],
      pacing: [],
      interactions: [],
      aspectRatios: [],
      platformVariations: []
    },
    accessibilityInclusivity: {
      contrastTargets: [],
      legibilityRules: [],
      inclusiveDesign: [],
      altTextCues: [],
      safeAreaChecks: []
    },
    productionNotes: {
      exportSpecs: [],
      fileNaming: [],
      deliveryRequirements: [],
      handoffLinks: [],
      licensing: [],
      riskFlags: []
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof MoodboardRequest, value: string) => {
    setFormData((prev: MoodboardRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Generate Professional Moodboard</h2>
          <p className="text-slate-400">
            Create a comprehensive marketing campaign moodboard by providing your brand details and campaign objectives.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
              Brand Information
            </h3>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-slate-300 mb-2">
                Brand Name *
              </label>
              <Input
                id="brand"
                type="text"
                placeholder="e.g., Nike, Apple, Coca-Cola"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="product" className="block text-sm font-medium text-slate-300 mb-2">
                Product/Service *
              </label>
              <Input
                id="product"
                type="text"
                placeholder="e.g., Air Max sneakers, iPhone 15, Diet Coke"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <Select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="food-beverage">Food & Beverage</option>
                <option value="automotive">Automotive</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance & Banking</option>
                <option value="entertainment">Entertainment & Media</option>
                <option value="travel">Travel & Tourism</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="education">Education</option>
                <option value="sports">Sports & Fitness</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
              Target Audience
            </h3>
            
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">
                Target Audience *
              </label>
              <Textarea
                id="targetAudience"
                placeholder="Describe your target audience in detail (demographics, psychographics, behaviors, etc.)"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                required
                rows={3}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Campaign Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
              Campaign Details
            </h3>
            
            <div>
              <label htmlFor="campaignGoal" className="block text-sm font-medium text-slate-300 mb-2">
                Campaign Goal
              </label>
              <Textarea
                id="campaignGoal"
                placeholder="What do you want to achieve with this campaign? (awareness, conversions, engagement, etc.)"
                value={formData.campaignGoal}
                onChange={(e) => handleInputChange('campaignGoal', e.target.value)}
                rows={3}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.brand || !formData.product || !formData.targetAudience}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Moodboard...
                </div>
              ) : (
                'Generate Professional Moodboard'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
