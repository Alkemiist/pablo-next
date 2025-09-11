"use client";
import { useState } from "react";
import StreamlinedWizard from "../brief-builder/components/streamlined-wizard";
import BriefDocument from "../brief-builder/components/brief-document";
import { StreamlinedBriefIntake, MarketingBriefDocument } from "@/lib/streamlined-brief-types";

type AppState = "wizard" | "generating" | "document";

export default function StreamlinedBriefPage() {
  const [appState, setAppState] = useState<AppState>("wizard");
  const [intakeData, setIntakeData] = useState<StreamlinedBriefIntake | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState<MarketingBriefDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWizardComplete = (data: StreamlinedBriefIntake) => {
    setIntakeData(data);
    setAppState("generating");
    generateBrief(data);
  };

  const generateBrief = async (intake: StreamlinedBriefIntake) => {
    console.log("🚀 Starting streamlined brief generation with data:", intake);
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡 Making API call to /api/generate-streamlined-brief");
      const response = await fetch("/api/generate-streamlined-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      console.log("📡 API Response status:", response.status);

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

      const parsedBrief = await response.json();
      console.log("✅ Successfully parsed brief:", parsedBrief);
      
      if (!parsedBrief || typeof parsedBrief !== 'object') {
        throw new Error("Generated brief is not a valid object");
      }
      
      console.log("🎉 Setting generated brief and moving to document view");
      setGeneratedBrief(parsedBrief);
      setAppState("document");
      
    } catch (err: any) {
      console.error("💥 Generation error:", err);
      setError(err?.message || "Failed to generate brief. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWizard = () => {
    setAppState("wizard");
    setIntakeData(null);
    setGeneratedBrief(null);
    setError(null);
  };

  const handleDiscardBrief = () => {
    if (window.confirm('Are you sure you want to discard this brief? This action cannot be undone.')) {
      handleBackToWizard();
    }
  };

  const renderContent = () => {
    switch (appState) {
      case "wizard":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <StreamlinedWizard onComplete={handleWizardComplete} />
            </div>
          </div>
        );

      case "generating":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto p-6 text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  🤖 AI is Creating Your Marketing Brief - UPDATED!
                </h1>
                <p className="text-xl text-slate-300">Our AI strategist is analyzing your inputs and generating a comprehensive marketing brief...</p>
              </div>
            
            {isLoading && (
              <div className="space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
                </div>
                
                {/* Progress Steps */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-white mb-6">AI Generation Progress</h3>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-slate-300">Analyzing your strategic inputs</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-slate-300">Inferring audience insights and competitive landscape</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                        <span className="text-white text-sm">⟳</span>
                      </div>
                      <span className="text-slate-300">Developing creative strategy and brand positioning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                      <span className="text-slate-500">Building channel strategy and customer journey</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                      <span className="text-slate-500">Creating measurement framework and implementation plan</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-lg text-slate-300">This usually takes 30-60 seconds...</p>
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

      case "document":
        return generatedBrief ? (
          <div className="h-full overflow-hidden">
            <BriefDocument brief={generatedBrief} onBack={handleBackToWizard} onDiscard={handleDiscardBrief} />
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
