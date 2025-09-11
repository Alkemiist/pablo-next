"use client";
import { useState } from "react";
import { BriefIntake, MarketingBrief } from "@/lib/brief-types";
import BriefWizard from "./components/brief-wizard";
import BriefReview from "./components/brief-review";

type AppState = "wizard" | "generating" | "review";

export default function BriefBuilder() {
  const [appState, setAppState] = useState<AppState>("wizard");
  const [intakeData, setIntakeData] = useState<BriefIntake | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState<MarketingBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFallbackBrief = (intake: BriefIntake): MarketingBrief => {
    return {
      project: {
        name: intake.project?.name || "Marketing Campaign",
        core_idea: intake.project?.core_idea || "Campaign core idea",
        business_context: intake.project?.business_context || "Campaign launch",
        timeline: intake.project?.timeline || "Q1 2024"
      },
      brand: {
        name: intake.brand?.name || "Brand",
        description: intake.brand?.description || "Brand description",
        values: intake.brand?.values || ["Value 1", "Value 2"],
        personality: intake.brand?.personality || "Professional",
        positioning: intake.brand?.positioning || "Market positioning"
      },
      product: {
        name: intake.product?.name || "Product",
        description: intake.product?.description || "Product description",
        features: intake.product?.features || ["Feature 1", "Feature 2"],
        benefits: intake.product?.benefits || ["Benefit 1", "Benefit 2"],
        unique_selling_proposition: intake.product?.unique_selling_proposition || "Unique value proposition"
      },
      audience: {
        primary_demographics: intake.audience?.primary_demographics || "Target audience",
        psychographics: intake.audience?.psychographics || "Audience psychographics",
        pain_points: intake.audience?.pain_points || ["Pain point 1", "Pain point 2"],
        motivations: intake.audience?.motivations || ["Motivation 1", "Motivation 2"],
        behaviors: intake.audience?.behaviors || ["Behavior 1", "Behavior 2"],
        media_consumption: intake.audience?.media_consumption || ["Social Media", "Web"]
      },
      objectives: {
        intent: intake.objectives?.intent || "Increase brand awareness and engagement",
        smart_targets: intake.objectives?.smart_targets || ["Target 1", "Target 2"],
        success_metrics: intake.objectives?.success_metrics || ["Metric 1", "Metric 2"],
        kpis: intake.objectives?.kpis || ["KPI 1", "KPI 2"]
      },
      creative_spine: {
        trend_connection: intake.creative_spine?.trend_connection || "Trend connection",
        creative_references: intake.creative_spine?.creative_references || [],
        mood_boards: intake.creative_spine?.mood_boards || [],
        visual_direction: intake.creative_spine?.visual_direction || "Visual direction"
      },
      channels_formats: {
        platforms: intake.channels_formats?.platforms || ["Social Media", "Web"],
        formats: intake.channels_formats?.formats || ["Video", "Image"],
        creative_constraints: intake.channels_formats?.creative_constraints || [],
        technical_requirements: intake.channels_formats?.technical_requirements || []
      },
      budget_guardrails: {
        budget_amount: intake.budget_guardrails?.budget_amount || "TBD",
        budget_allocation: intake.budget_guardrails?.budget_allocation || "TBD",
        must_include: intake.budget_guardrails?.must_include || [],
        restrictions: intake.budget_guardrails?.restrictions || [],
        compliance_requirements: intake.budget_guardrails?.compliance_requirements || []
      },
      outputs: {
        exec_summary: `This campaign aims to ${intake.objectives?.intent || "achieve marketing goals"} for ${intake.brand?.name || "our brand"} targeting ${intake.audience?.primary_demographics || "our target audience"}.`,
        big_idea: `The core creative concept: ${intake.product?.unique_selling_proposition || "Highlighting our unique value proposition"}`,
        creative_territories: [
          {
            name: "Territory 1",
            description: "First creative direction based on your inputs",
            example_hook: "Hook example for this territory"
          },
          {
            name: "Territory 2", 
            description: "Second creative direction based on your inputs",
            example_hook: "Hook example for this territory"
          }
        ],
        journey_map: [
          {
            stage: "Awareness",
            message: "Introduce the brand and product",
            asset: "Social media post",
            kpi: "Reach"
          },
          {
            stage: "Consideration",
            message: "Highlight benefits and features",
            asset: "Video ad",
            kpi: "Engagement"
          },
          {
            stage: "Conversion",
            message: "Call to action and offer",
            asset: "Landing page",
            kpi: "Conversion Rate"
          }
        ]
      }
    };
  };

  const handleWizardComplete = (data: BriefIntake) => {
    setIntakeData(data);
    setAppState("generating");
    generateBrief(data);
  };

  const generateBrief = async (intake: BriefIntake) => {
    console.log("🚀 Starting brief generation with data:", intake);
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡 Making API call to /api/generate-brief");
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      console.log("📡 API Response status:", response.status);
      console.log("📡 API Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response directly
      const parsedBrief = await response.json();
      console.log("✅ Successfully parsed brief:", parsedBrief);
      
      // More flexible validation - just check if we got something back
      if (!parsedBrief || typeof parsedBrief !== 'object') {
        throw new Error("Generated brief is not a valid object");
      }
      
      // If it has a project field, great. If not, we'll still show it
      if (parsedBrief.project) {
        console.log("✅ Brief has project field");
      } else {
        console.log("⚠️ Brief missing project field, but continuing...");
      }
      
      console.log("🎉 Setting generated brief and moving to review");
      setGeneratedBrief(parsedBrief);
      setAppState("review");
      
    } catch (err: any) {
      console.error("💥 Generation error:", err);
      console.error("💥 Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause
      });
      
      // Generate a fallback brief so user gets something
      console.log("🔄 Generating fallback brief...");
      const fallbackBrief = generateFallbackBrief(intake);
      console.log("🔄 Fallback brief generated:", fallbackBrief);
      
      setGeneratedBrief(fallbackBrief);
      setAppState("review");
      
      // Show a warning but don't fail
      setError("AI generation failed, but here's a basic brief based on your inputs. You can edit it in the review section.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setAppState("wizard");
    setGeneratedBrief(null);
    setError(null);
  };

  const handleDiscardBrief = () => {
    setAppState("wizard");
    setGeneratedBrief(null);
    setIntakeData(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case "wizard":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto p-6">
                <BriefWizard onComplete={handleWizardComplete} />
              </div>
            </div>
          </div>
        );

      case "generating":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto p-6 text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Generating Your Marketing Brief
                </h1>
                <p className="text-xl text-slate-300">Our AI is crafting a comprehensive brief based on your inputs...</p>
              </div>
            
            {isLoading && (
              <div className="space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-slate-300">Analyzing your inputs and generating strategic insights...</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

              {error && (
                <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">Generation Failed</h3>
                  <p className="text-red-300 mb-6 text-lg">{error}</p>
                  <button
                    onClick={handleBackToWizard}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                  >
                    Back to Wizard
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "review":
        return generatedBrief ? (
          <div className="h-full overflow-hidden">
            <BriefReview brief={generatedBrief} onBack={handleBackToWizard} onDiscard={handleDiscardBrief} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-slate-300">No brief generated yet.</p>
              <button onClick={handleBackToWizard} className="text-blue-400 hover:text-blue-300 underline">
                Back to Wizard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      <div className="h-full flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
}