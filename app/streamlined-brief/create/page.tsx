"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StreamlinedWizard from "../../brief-builder/components/streamlined-wizard";
import BriefDocument from "../../brief-builder/components/brief-document";
import BriefSaveModal from "../../components/brief-save-modal";
import { StreamlinedBriefIntake, MarketingBriefDocument } from "@/lib/streamlined-brief-types";

type AppState = "wizard" | "generating" | "document";

export default function CreateStreamlinedBriefPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("wizard");
  const [intakeData, setIntakeData] = useState<StreamlinedBriefIntake | null>(null);
  const [generatedBrief, setGeneratedBrief] = useState<MarketingBriefDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressState, setProgressState] = useState({
    currentStep: 0
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleWizardComplete = (data: StreamlinedBriefIntake) => {
    setIntakeData(data);
    setAppState("generating");
    setProgressState({
      currentStep: 0
    });
    generateBrief(data);
  };

  // Dynamic progress animation
  useEffect(() => {
    if (!isLoading) return;

    const progressSteps = [
      { duration: 4000, message: 'Decrypting strategic inputs' },
      { duration: 5000, message: 'Analyzing target demographics' },
      { duration: 6000, message: 'Building competitive intelligence matrix' },
      { duration: 7000, message: 'Generating tactical brief protocols' },
      { duration: 4000, message: 'Establishing secure channels' },
      { duration: 1000, message: 'Finalizing brief compilation' }
    ];

    let currentStepIndex = 0;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentStep = progressSteps[currentStepIndex];
      
      if (currentStep && elapsed < currentStep.duration) {
        setProgressState(prev => ({
          ...prev,
          currentStep: currentStepIndex
        }));
      } else if (currentStepIndex < progressSteps.length - 1) {
        currentStepIndex++;
        setProgressState(prev => ({
          ...prev,
          currentStep: currentStepIndex
        }));
      } else {
        // All steps complete
        setProgressState(prev => ({
          ...prev,
          currentStep: progressSteps.length
        }));
        return;
      }

      requestAnimationFrame(updateProgress);
    };

    updateProgress();
  }, [isLoading]);

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
    setGeneratedBrief(null);
    setError(null);
    // Keep intakeData intact so user can edit and regenerate
  };

  const handleCloseWizard = () => {
    router.push('/streamlined-brief');
  };

  const handleBackToWizardFromGenerating = () => {
    setAppState("wizard");
    setError(null);
    // Keep intakeData intact so user can edit and regenerate
  };

  const handleDiscardBrief = () => {
    if (window.confirm('Are you sure you want to discard this brief? This action cannot be undone.')) {
      handleBackToWizard();
    }
  };

  const handleSaveBrief = async (metadata: { title: string; description: string; author: string; status: string }) => {
    if (!generatedBrief) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefData: generatedBrief,
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save brief');
      }

      const result = await response.json();
      console.log('Brief saved successfully:', result);
      
      // Close modal and redirect to home
      setShowSaveModal(false);
      router.push('/streamlined-brief');
    } catch (error) {
      console.error('Error saving brief:', error);
      alert('Failed to save brief. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case "wizard":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <StreamlinedWizard 
                onComplete={handleWizardComplete} 
                onClose={handleCloseWizard}
                initialData={intakeData || undefined} 
              />
            </div>
          </div>
        );

      case "generating":
        return (
          <div className="h-full bg-black relative overflow-hidden">
            {/* Cyber Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)] animate-pulse"></div>
            </div>
            
            {/* Matrix-style falling characters */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-400/20 text-xs font-mono animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex items-center justify-center p-6">
              <div className="w-full max-w-4xl">
                {isLoading && (
                  <div className="font-mono">
                    {/* Terminal Header */}
                    <div className="mb-8 pb-4 border-b border-green-400/30">
                      <span className="text-green-400 text-sm drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                        {intakeData?.project_name ? 
                          `${intakeData.project_name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_INTELLIGENCE_TERMINAL v2.1.3` : 
                          'MARKETING_INTELLIGENCE_TERMINAL v2.1.3'
                        }
                      </span>
                    </div>

                    {/* Single Terminal Loading Bar */}
                    <div className="space-y-6">
                      {/* Current Step Display */}
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]">$</span>
                        <span className="text-green-300 drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]">
                          {progressState.currentStep === 0 && "Decrypting strategic inputs..."}
                          {progressState.currentStep === 1 && "Analyzing target demographics..."}
                          {progressState.currentStep === 2 && "Building competitive intelligence matrix..."}
                          {progressState.currentStep === 3 && "Generating tactical brief protocols..."}
                          {progressState.currentStep === 4 && "Establishing secure channels..."}
                          {progressState.currentStep === 5 && "Finalizing brief compilation..."}
                        </span>
                        <span className="text-green-400 animate-pulse drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]">[PROC]</span>
                      </div>

                      {/* Terminal Loading Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">
                          <span>Progress</span>
                          <span>{Math.round(progressState.currentStep / 3 * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-sm h-3 border border-green-800/30">
                          <div 
                            className="bg-green-400 h-full rounded-sm transition-all duration-500 relative overflow-hidden drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                            style={{ width: `${(progressState.currentStep / 3) * 100}%` }}
                          >
                            {/* Terminal-style loading animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Status */}
                    <div className="mt-8 space-y-2">
                      <div className="text-xs text-green-300/80 space-y-1">
                        <div className="animate-pulse drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]">[SECURE] Neural pathways established ✓</div>
                        <div className="animate-pulse drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]" style={{ animationDelay: '0.3s' }}>[ENCRYPT] Data integrity verified ✓</div>
                        <div className="animate-pulse drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]" style={{ animationDelay: '0.6s' }}>[PROCESS] Brief generation in progress...</div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="font-mono">
                    <div className="mb-6 pb-3 border-b border-red-400/30">
                      <span className="text-red-300 text-sm drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">ERROR_LOG_TERMINAL</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="text-red-300 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]">[ERROR] Mission failed to execute</div>
                      <div className="text-red-400/70 drop-shadow-[0_0_4px_rgba(239,68,68,0.3)]">{error}</div>
                      <div className="mt-6">
                        <button
                          onClick={handleBackToWizardFromGenerating}
                          className="px-4 py-2 text-sm font-mono text-red-400 hover:text-red-300 transition-all duration-200 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]"
                        >
                          $ RETRY_MISSION
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "document":
        return generatedBrief ? (
          <div className="h-full overflow-y-auto">
            <BriefDocument 
              brief={generatedBrief} 
              onBack={handleBackToWizard} 
              onDiscard={handleDiscardBrief}
              onSave={() => setShowSaveModal(true)}
            />
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
      
      {/* Save Modal */}
      <BriefSaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveBrief}
        isLoading={isSaving}
      />
    </div>
  );
}