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

  const handleWizardComplete = (data: BriefIntake) => {
    setIntakeData(data);
    setAppState("generating");
    generateBrief(data);
  };

  const generateBrief = async (intake: BriefIntake) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response directly
      const parsedBrief = await response.json();
      
      // Validate that the brief has the required structure
      if (!parsedBrief || !parsedBrief.project || !parsedBrief.project.title) {
        throw new Error("Generated brief is missing required fields");
      }
      
      setGeneratedBrief(parsedBrief);
      setAppState("review");
      
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate brief");
      setAppState("wizard");
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