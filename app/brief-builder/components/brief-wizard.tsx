"use client";
import { useState } from "react";
import { BriefIntake } from "@/lib/brief-types";

interface BriefWizardProps {
  onComplete: (data: BriefIntake) => void;
}

const steps = [
  {
    id: "project",
    title: "Project Overview",
    description: "Basic project information and context",
    icon: "🚀"
  },
  {
    id: "objective",
    title: "Objectives & KPIs",
    description: "What you want to achieve and how to measure it",
    icon: "🎯"
  },
  {
    id: "audience",
    title: "Target Audience",
    description: "Who you're targeting and their motivations",
    icon: "👥"
  },
  {
    id: "brand",
    title: "Brand & Positioning",
    description: "Your brand's role and competitive landscape",
    icon: "🏷️"
  },
  {
    id: "message",
    title: "Core Message",
    description: "What you want to communicate and why",
    icon: "💬"
  },
  {
    id: "execution",
    title: "Execution Details",
    description: "Channels, tone, and creative direction",
    icon: "⚡"
  },
  {
    id: "review",
    title: "Review & Generate",
    description: "Review all inputs and generate your brief",
    icon: "✨"
  }
];

export default function BriefWizard({ onComplete }: BriefWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BriefIntake>({
    project: { title: "", launch_window: "", owner: "", business_context: "" },
    objective: { smart: "", primary_kpis: [], targets: "", learning_goal: "" },
    audience: { descriptor: "", pain_tension: "", current_emotion: "", desired_emotion: "", desired_action: "" },
    insight: "",
    brand: { role: "", positioning: "", competitors: [] },
    message: { smp: "", reasons_to_believe: [] },
    tone_style: { tone_tags: [], mood_tags: [], avoid: [] },
    channels_formats: { channels: [], formats: [], constraints: [] },
    culture_creative: { trends_hashtags: [], references: [] },
    budget_legal: { budget_tier: "moderate", must_include: [] }
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
    // Store the raw input value first, then process it when needed
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  // Helper function to get processed array values for display
  const getArrayValue = (section: keyof BriefIntake, field: string): string => {
    const value = (formData[section] as any)?.[field];
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value || "";
  };

  // Helper function to get processed array values for submission
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
      case 0: // Project
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Project Overview</h3>
              <p className="text-slate-400 text-lg">Tell us about your project and business context</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Project Title</label>
                <input
                  type="text"
                  value={formData.project?.title || ""}
                  onChange={(e) => updateFormData("project", "title", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Q4 Launch: Instant Chef"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Launch Window</label>
                <input
                  type="text"
                  value={formData.project?.launch_window || ""}
                  onChange={(e) => updateFormData("project", "launch_window", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Oct–Nov 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Project Owner</label>
                <input
                  type="text"
                  value={formData.project?.owner || ""}
                  onChange={(e) => updateFormData("project", "owner", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Growth Team"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Business Context</label>
                <textarea
                  value={formData.project?.business_context || ""}
                  onChange={(e) => updateFormData("project", "business_context", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  placeholder="Brief description of the business context and challenges"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Objective
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Objectives & KPIs</h3>
              <p className="text-slate-400 text-lg">Define what you want to achieve and how to measure success</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">SMART Objective</label>
                <textarea
                  value={formData.objective?.smart || ""}
                  onChange={(e) => updateFormData("objective", "smart", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  placeholder="Specific, Measurable, Achievable, Relevant, Time-bound objective"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Primary KPIs (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("objective", "primary_kpis")}
                  onChange={(e) => updateArrayField("objective", "primary_kpis", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., signups, CAC, conversion rate"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Targets</label>
                <input
                  type="text"
                  value={formData.objective?.targets || ""}
                  onChange={(e) => updateFormData("objective", "targets", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 5,000 net-new signups"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Learning Goal</label>
                <input
                  type="text"
                  value={formData.objective?.learning_goal || ""}
                  onChange={(e) => updateFormData("objective", "learning_goal", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Test humor vs. authority tone"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Audience
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Target Audience</h3>
              <p className="text-slate-400 text-lg">Understand who you're targeting and what motivates them</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Audience Descriptor</label>
                <input
                  type="text"
                  value={formData.audience?.descriptor || ""}
                  onChange={(e) => updateFormData("audience", "descriptor", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Busy urban parents, 28–40, dual-income"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Pain Point / Tension</label>
                <textarea
                  value={formData.audience?.pain_tension || ""}
                  onChange={(e) => updateFormData("audience", "pain_tension", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  placeholder="What problem or tension does your audience face?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Current Emotion</label>
                <input
                  type="text"
                  value={formData.audience?.current_emotion || ""}
                  onChange={(e) => updateFormData("audience", "current_emotion", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Overwhelmed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Desired Emotion</label>
                <input
                  type="text"
                  value={formData.audience?.desired_emotion || ""}
                  onChange={(e) => updateFormData("audience", "desired_emotion", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Relieved"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Desired Action</label>
                <input
                  type="text"
                  value={formData.audience?.desired_action || ""}
                  onChange={(e) => updateFormData("audience", "desired_action", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Start 2-week trial"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Brand
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Brand & Positioning</h3>
              <p className="text-slate-400 text-lg">Define your brand's role and competitive landscape</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Brand Role</label>
                <input
                  type="text"
                  value={formData.brand?.role || ""}
                  onChange={(e) => updateFormData("brand", "role", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Liberator, Educator, Connector"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Brand Positioning</label>
                <textarea
                  value={formData.brand?.positioning || ""}
                  onChange={(e) => updateFormData("brand", "positioning", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  placeholder="How do you want to be positioned in the market?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Competitors (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("brand", "competitors")}
                  onChange={(e) => updateArrayField("brand", "competitors", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., HelloFresh, Blue Apron"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Message
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Core Message</h3>
              <p className="text-slate-400 text-lg">Define what you want to communicate and why it matters</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Key Insight</label>
                <textarea
                  value={formData.insight || ""}
                  onChange={(e) => updateFormData("insight", "", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  placeholder="What's the key human insight that drives your strategy?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Single-Minded Proposition (SMP)</label>
                <input
                  type="text"
                  value={formData.message?.smp || ""}
                  onChange={(e) => updateFormData("message", "smp", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="The one thing you want people to remember"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Reasons to Believe (comma-separated)</label>
                <input
                  type="text"
                  value={getArrayValue("message", "reasons_to_believe")}
                  onChange={(e) => updateArrayField("message", "reasons_to_believe", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 5-min prep kits, Kid-approved flavors"
                />
              </div>
            </div>
          </div>
        );

      case 5: // Execution
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Execution Details</h3>
              <p className="text-slate-400 text-lg">Define channels, tone, and creative direction</p>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Tone & Style</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tone Tags (comma-separated)"
                    value={getArrayValue("tone_style", "tone_tags")}
                    onChange={(e) => updateArrayField("tone_style", "tone_tags", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Mood Tags (comma-separated)"
                    value={getArrayValue("tone_style", "mood_tags")}
                    onChange={(e) => updateArrayField("tone_style", "mood_tags", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Avoid (comma-separated)"
                    value={getArrayValue("tone_style", "avoid")}
                    onChange={(e) => updateArrayField("tone_style", "avoid", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Channels & Formats</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Channels (comma-separated)"
                    value={getArrayValue("channels_formats", "channels")}
                    onChange={(e) => updateArrayField("channels_formats", "channels", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Formats (comma-separated)"
                    value={getArrayValue("channels_formats", "formats")}
                    onChange={(e) => updateArrayField("channels_formats", "formats", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Constraints (comma-separated)"
                    value={getArrayValue("channels_formats", "constraints")}
                    onChange={(e) => updateArrayField("channels_formats", "constraints", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Culture & Creative</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Trends/Hashtags (comma-separated)"
                    value={getArrayValue("culture_creative", "trends_hashtags")}
                    onChange={(e) => updateArrayField("culture_creative", "trends_hashtags", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="References (comma-separated)"
                    value={getArrayValue("culture_creative", "references")}
                    onChange={(e) => updateArrayField("culture_creative", "references", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Budget & Legal</h4>
                <div className="space-y-4">
                  <select
                    value={formData.budget_legal?.budget_tier || "moderate"}
                    onChange={(e) => updateFormData("budget_legal", "budget_tier", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="lean">Lean</option>
                    <option value="moderate">Moderate</option>
                    <option value="big">Big</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Must Include (comma-separated)"
                    value={getArrayValue("budget_legal", "must_include")}
                    onChange={(e) => updateArrayField("budget_legal", "must_include", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Review
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Review & Generate</h3>
              <p className="text-slate-400 text-lg">Review all your inputs before generating the AI brief</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">Summary of Your Brief</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-blue-400">Project:</strong> 
                  <span className="text-slate-300 ml-2">{formData.project?.title || "Not specified"}</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-green-400">Objective:</strong> 
                  <span className="text-slate-300 ml-2">{formData.objective?.smart ? "SMART goal set" : "Not specified"}</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-purple-400">Audience:</strong> 
                  <span className="text-slate-300 ml-2">{formData.audience?.descriptor || "Not specified"}</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-orange-400">Brand Role:</strong> 
                  <span className="text-slate-300 ml-2">{formData.brand?.role || "Not specified"}</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-pink-400">Message:</strong> 
                  <span className="text-slate-300 ml-2">{formData.message?.smp ? "SMP defined" : "Not specified"}</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <strong className="text-cyan-400">Channels:</strong> 
                  <span className="text-slate-300 ml-2">{formData.channels_formats?.channels?.length || 0} channels specified</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  // Process the form data to convert string inputs to arrays where needed
                  const processedData = {
                    ...formData,
                    objective: {
                      ...formData.objective,
                      primary_kpis: getProcessedArray("objective", "primary_kpis")
                    },
                    brand: {
                      ...formData.brand,
                      competitors: getProcessedArray("brand", "competitors")
                    },
                    message: {
                      ...formData.message,
                      reasons_to_believe: getProcessedArray("message", "reasons_to_believe")
                    },
                    tone_style: {
                      ...formData.tone_style,
                      tone_tags: getProcessedArray("tone_style", "tone_tags"),
                      mood_tags: getProcessedArray("tone_style", "mood_tags"),
                      avoid: getProcessedArray("tone_style", "avoid")
                    },
                    channels_formats: {
                      ...formData.channels_formats,
                      channels: getProcessedArray("channels_formats", "channels"),
                      formats: getProcessedArray("channels_formats", "formats"),
                      constraints: getProcessedArray("channels_formats", "constraints")
                    },
                    culture_creative: {
                      ...formData.culture_creative,
                      trends_hashtags: getProcessedArray("culture_creative", "trends_hashtags"),
                      references: getProcessedArray("culture_creative", "references")
                    },
                    budget_legal: {
                      ...formData.budget_legal,
                      must_include: getProcessedArray("budget_legal", "must_include")
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
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 transition-all duration-300 ${
                  index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{steps[currentStep].title}</h2>
          <p className="text-slate-400 text-lg">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 hover:border-slate-500"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
