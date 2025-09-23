"use client";
import { useState } from "react";
import { MarketingBrief } from "@/lib/brief-types";
import jsPDF from "jspdf";

interface BriefReviewProps {
  brief: MarketingBrief;
  onBack: () => void;
  onDiscard?: () => void;
}

export default function BriefReview({ brief, onBack, onDiscard }: BriefReviewProps) {
  const [editedBrief, setEditedBrief] = useState<MarketingBrief>(brief);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Safety check to ensure brief has required structure
  if (!brief || !brief.project) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-red-400 mb-4">Invalid Brief Data</h3>
          <p className="text-red-300 mb-6 text-lg">
            The generated brief is missing required information. Please try generating again.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            Back to Wizard
          </button>
        </div>
      </div>
    );
  }

  const updateBrief = (section: keyof MarketingBrief, field: string, value: any) => {
    setEditedBrief(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateArrayField = (section: keyof MarketingBrief, field: string, value: string) => {
    const newArray = value.split(',').map(item => item.trim()).filter(Boolean);
    updateBrief(section, field, newArray);
  };

  const downloadBrief = (format: 'json' | 'pdf') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(editedBrief, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `marketing-brief-${brief.project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Marketing Brief', 20, 20);
      
      // Add project details
      doc.setFontSize(14);
      doc.text('Project Details', 20, 40);
      doc.setFontSize(12);
      doc.text(`Title: ${editedBrief.project.name}`, 20, 50);
      doc.text(`Core Idea: ${editedBrief.project.core_idea}`, 20, 60);
      doc.text(`Timeline: ${editedBrief.project.timeline}`, 20, 70);
      
      // Add objective
      doc.setFontSize(14);
      doc.text('Objective', 20, 90);
      doc.setFontSize(12);
      doc.text(`Intent: ${editedBrief.objectives.intent}`, 20, 100);
      
      // Add audience
      doc.setFontSize(14);
      doc.text('Target Audience', 20, 120);
      doc.setFontSize(12);
      doc.text(`Demographics: ${editedBrief.audience.primary_demographics}`, 20, 130);
      doc.text(`Psychographics: ${editedBrief.audience.psychographics}`, 20, 140);
      
      // Add big idea
      doc.setFontSize(14);
      doc.text('Big Idea', 20, 160);
      doc.setFontSize(12);
      doc.text(editedBrief.outputs.big_idea, 20, 170);
      
      // Save the PDF
      doc.save(`marketing-brief-${brief.project.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    }
  };

  const saveBrief = () => {
    // Here you would typically save to a database
    // For now, we'll save to localStorage
    localStorage.setItem('saved-briefs', JSON.stringify({
      ...JSON.parse(localStorage.getItem('saved-briefs') || '{}'),
      [Date.now()]: editedBrief
    }));
    alert('Brief saved successfully!');
  };

  const discardBrief = () => {
    if (window.confirm('Are you sure you want to discard this brief? This action cannot be undone.')) {
      onDiscard?.();
    }
  };

  const sections = [
    { id: "overview", title: "Overview", icon: "📋", type: "ai-generated" },
    { id: "project", title: "Project Details", icon: "🚀", type: "user-input" },
    { id: "objective", title: "Objectives", icon: "🎯", type: "user-input" },
    { id: "audience", title: "Target Audience", icon: "👥", type: "user-input" },
    { id: "brand", title: "Brand & Positioning", icon: "🏷️", type: "user-input" },
    { id: "message", title: "Core Message", icon: "💬", type: "user-input" },
    { id: "execution", title: "Execution Strategy", icon: "⚡", type: "user-input" },
    { id: "outputs", title: "AI-Generated Strategy", icon: "🤖", type: "ai-generated" },
    { id: "competitive", title: "Competitive Analysis", icon: "⚔️", type: "ai-generated" },
    { id: "channels", title: "Channel Strategy", icon: "📺", type: "ai-generated" }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2">AI-Generated Marketing Brief</h3>
              <p className="text-slate-400 text-lg">Strategic marketing brief created by AI based on your inputs</p>
            </div>
            
            {/* AI Generation Badge */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500/20 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">🤖</span>
                <h4 className="text-xl font-bold text-white">AI-Generated Strategy</h4>
              </div>
              <p className="text-blue-100 text-sm">
                This comprehensive marketing brief was generated by our AI using your inputs as the foundation. 
                The AI has created strategic insights, creative territories, and execution plans ready for immediate use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-blue-400 mb-3 text-lg">Project Summary</h4>
                <p className="text-white text-lg font-medium">{brief.project.name}</p>
                <p className="text-slate-300 text-sm mt-2">{brief.project.business_context}</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-green-400 mb-3 text-lg">Key Objective</h4>
                <p className="text-white text-sm leading-relaxed">{brief.objectives?.intent || "Not specified"}</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-purple-400 mb-3 text-lg">Target Audience</h4>
                <p className="text-white text-sm leading-relaxed">{brief.audience?.primary_demographics || "Not specified"}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 border border-orange-500/20 p-6 rounded-2xl">
                <h4 className="font-semibold text-white mb-3 text-lg flex items-center">
                  <span className="mr-2">✨</span>
                  AI-Generated Big Idea
                </h4>
                <p className="text-white text-sm leading-relaxed font-medium">{brief.outputs?.big_idea || "Not available"}</p>
              </div>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedBrief.project.name}
                  onChange={(e) => updateBrief("project", "name", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.project.core_idea}
                  onChange={(e) => updateBrief("project", "core_idea", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.project.timeline}
                  onChange={(e) => updateBrief("project", "timeline", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  value={editedBrief.project.business_context}
                  onChange={(e) => updateBrief("project", "business_context", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Title:</strong> <span className="text-slate-300 ml-2">{brief.project.name}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Core Idea:</strong> <span className="text-slate-300 ml-2">{brief.project.core_idea}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Timeline:</strong> <span className="text-slate-300 ml-2">{brief.project.timeline}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Business Context:</strong> <span className="text-slate-300 ml-2">{brief.project.business_context}</span></div>
              </div>
            )}
          </div>
        );

      case "objective":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Objectives & KPIs</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedBrief.objectives?.intent || ""}
                  onChange={(e) => updateBrief("objectives", "intent", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={(editedBrief.objectives?.smart_targets || []).join(", ")}
                  onChange={(e) => updateArrayField("objectives", "smart_targets", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.objectives?.success_metrics?.join(", ") || ""}
                  onChange={(e) => updateArrayField("objectives", "success_metrics", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.objectives?.kpis?.join(", ") || ""}
                  onChange={(e) => updateArrayField("objectives", "kpis", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Intent:</strong> <span className="text-slate-300 ml-2">{brief.objectives?.intent || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Smart Targets:</strong> <span className="text-slate-300 ml-2">{(brief.objectives?.smart_targets || []).join(", ") || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Success Metrics:</strong> <span className="text-slate-300 ml-2">{(brief.objectives?.success_metrics || []).join(", ") || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">KPIs:</strong> <span className="text-slate-300 ml-2">{(brief.objectives?.kpis || []).join(", ") || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "audience":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Target Audience</h3>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedBrief.audience.primary_demographics}
                  onChange={(e) => updateBrief("audience", "primary_demographics", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  value={editedBrief.audience.psychographics}
                  onChange={(e) => updateBrief("audience", "psychographics", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={editedBrief.audience.pain_points?.join(", ") || ""}
                  onChange={(e) => updateArrayField("audience", "pain_points", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.audience.motivations?.join(", ") || ""}
                  onChange={(e) => updateArrayField("audience", "motivations", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.audience.behaviors?.join(", ") || ""}
                  onChange={(e) => updateArrayField("audience", "behaviors", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Demographics:</strong> <span className="text-slate-300 ml-2">{brief.audience?.primary_demographics || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Psychographics:</strong> <span className="text-slate-300 ml-2">{brief.audience?.psychographics || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Pain Points:</strong> <span className="text-slate-300 ml-2">{(brief.audience?.pain_points || []).join(", ") || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Motivations:</strong> <span className="text-slate-300 ml-2">{(brief.audience?.motivations || []).join(", ") || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Behaviors:</strong> <span className="text-slate-300 ml-2">{(brief.audience?.behaviors || []).join(", ") || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "brand":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Brand & Positioning</h3>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedBrief.brand.name}
                  onChange={(e) => updateBrief("brand", "name", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  value={editedBrief.brand.description || ""}
                  onChange={(e) => updateBrief("brand", "description", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={(editedBrief.brand.values || []).join(", ")}
                  onChange={(e) => updateArrayField("brand", "values", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Name:</strong> <span className="text-slate-300 ml-2">{brief.brand.name}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Description:</strong> <span className="text-slate-300 ml-2">{brief.brand.description || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Values:</strong> <span className="text-slate-300 ml-2">{(brief.brand.values || []).join(", ") || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "message":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Core Message</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedBrief.outputs?.big_idea || ""}
                  onChange={(e) => updateBrief("outputs", "big_idea", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={editedBrief.outputs?.strategic_insight || ""}
                  onChange={(e) => updateBrief("outputs", "strategic_insight", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.outputs?.exec_summary || ""}
                  onChange={(e) => updateBrief("outputs", "exec_summary", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">Big Idea:</strong> <span className="text-slate-300 ml-2">{brief.outputs?.big_idea || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">Strategic Insight:</strong> <span className="text-slate-300 ml-2">{brief.outputs?.strategic_insight || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">Executive Summary:</strong> <span className="text-slate-300 ml-2">{brief.outputs?.exec_summary || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "execution":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Execution Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Tone & Style</h4>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={(editedBrief.outputs?.creative_territories?.map(t => t.name) || []).join(", ")}
                      onChange={(e) => updateArrayField("outputs", "creative_territories", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tone tags"
                    />
                    <input
                      type="text"
                      value={editedBrief.outputs?.strategic_insight || ""}
                      onChange={(e) => updateBrief("outputs", "strategic_insight", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Mood tags"
                    />
                    <input
                      type="text"
                      value={editedBrief.outputs?.exec_summary || ""}
                      onChange={(e) => updateBrief("outputs", "exec_summary", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Avoid"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Creative Territories:</strong> <span className="text-slate-300 ml-2">{(brief.outputs?.creative_territories?.map(t => t.name) || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Strategic Insight:</strong> <span className="text-slate-300 ml-2">{brief.outputs?.strategic_insight || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Big Idea:</strong> <span className="text-slate-300 ml-2">{brief.outputs?.big_idea || "Not specified"}</span></div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Channels & Formats</h4>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={(editedBrief.channels_formats.platforms || []).join(", ")}
                      onChange={(e) => updateArrayField("channels_formats", "platforms", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Channels"
                    />
                    <input
                      type="text"
                      value={(editedBrief.channels_formats.formats || []).join(", ")}
                      onChange={(e) => updateArrayField("channels_formats", "formats", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Formats"
                    />
                    <input
                      type="text"
                      value={(editedBrief.channels_formats.creative_constraints || []).join(", ")}
                      onChange={(e) => updateArrayField("channels_formats", "creative_constraints", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Constraints"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Platforms:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.platforms || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Formats:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.formats || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Creative Constraints:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.creative_constraints || []).join(", ") || "Not specified"}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "outputs":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                <span className="mr-3">🤖</span>
                AI-Generated Strategy
              </h3>
              <p className="text-slate-400 text-lg">Strategic insights, creative territories, and execution plans created by AI</p>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Executive Summary</h4>
                {isEditing ? (
                  <textarea
                    value={editedBrief.outputs.exec_summary}
                    onChange={(e) => updateBrief("outputs", "exec_summary", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-32"
                  />
                ) : (
                  <div className="bg-slate-800 p-6 rounded-xl">
                    <p className="text-slate-300 leading-relaxed">{brief.outputs.exec_summary}</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Strategic Insight</h4>
                {isEditing ? (
                  <textarea
                    value={editedBrief.outputs.strategic_insight || ""}
                    onChange={(e) => updateBrief("outputs", "strategic_insight", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  />
                ) : (
                  <div className="bg-slate-800 p-6 rounded-xl">
                    <p className="text-slate-300 leading-relaxed">{brief.outputs.strategic_insight || "Strategic insight not available."}</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Big Idea</h4>
                {isEditing ? (
                  <textarea
                    value={editedBrief.outputs.big_idea}
                    onChange={(e) => updateBrief("outputs", "big_idea", e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                  />
                ) : (
                  <div className="bg-slate-800 p-6 rounded-xl">
                    <p className="text-slate-300 leading-relaxed">{brief.outputs.big_idea}</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Creative Territories</h4>
                {(brief.outputs.creative_territories || []).map((territory, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 mb-6 bg-slate-800 p-4 rounded-xl">
                    <h5 className="font-semibold text-white text-lg mb-3">{territory.name}</h5>
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={territory.description}
                          onChange={(e) => {
                            const newTerritories = [...editedBrief.outputs.creative_territories];
                            newTerritories[index] = { ...territory, description: e.target.value };
                            updateBrief("outputs", "creative_territories", newTerritories);
                          }}
                          className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          rows={3}
                        />
                        <input
                          type="text"
                          value={territory.example_hook || ""}
                          onChange={(e) => {
                            const newTerritories = [...editedBrief.outputs.creative_territories];
                            newTerritories[index] = { ...territory, example_hook: e.target.value };
                            updateBrief("outputs", "creative_territories", newTerritories);
                          }}
                          className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Example hook"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-2">{territory.description}</p>
                        {territory.example_hook && (
                          <div className="bg-slate-700 p-3 rounded-lg">
                            <p className="text-slate-400 text-sm"><em>"{territory.example_hook}"</em></p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-slate-700 pb-2">Customer Journey Map</h4>
                {(brief.outputs.journey_map || []).map((stage, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-6 mb-6 bg-slate-800 p-4 rounded-xl">
                    <h5 className="font-semibold text-white text-lg mb-3">{stage.stage}</h5>
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={stage.message}
                          onChange={(e) => {
                            const newJourney = [...editedBrief.outputs.journey_map];
                            newJourney[index] = { ...stage, message: e.target.value };
                            updateBrief("outputs", "journey_map", newJourney);
                          }}
                          className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          rows={3}
                        />
                        <input
                          type="text"
                          value={stage.asset || ""}
                          onChange={(e) => {
                            const newJourney = [...editedBrief.outputs.journey_map];
                            newJourney[index] = { ...stage, asset: e.target.value };
                            updateBrief("outputs", "journey_map", newJourney);
                          }}
                          className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Asset type"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-2">{stage.message}</p>
                        <div className="bg-slate-700 p-3 rounded-lg">
                          <p className="text-slate-400 text-sm"><strong>Asset:</strong> {stage.asset}</p>
                          {stage.kpi && <p className="text-slate-400 text-sm mt-1"><strong>KPI:</strong> {stage.kpi}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "competitive":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                <span className="mr-3">⚔️</span>
                AI-Generated Competitive Analysis
              </h3>
              <p className="text-slate-400 text-lg">Strategic competitive intelligence and positioning insights</p>
            </div>
            
            {brief.outputs.competitive_analysis ? (
              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {(brief.outputs.competitive_analysis?.key_competitors || []).map((competitor, index) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Competitive Advantage</h4>
                  <p className="text-slate-300 leading-relaxed">{brief.outputs.competitive_analysis.competitive_advantage}</p>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Market Positioning</h4>
                  <p className="text-slate-300 leading-relaxed">{brief.outputs.competitive_analysis.market_positioning}</p>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Differentiation Strategy</h4>
                  <p className="text-slate-300 leading-relaxed">{brief.outputs.competitive_analysis.differentiation_strategy}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl text-center">
                <p className="text-slate-400">Competitive analysis not available in this brief.</p>
              </div>
            )}
          </div>
        );

      case "channels":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                <span className="mr-3">📺</span>
                AI-Generated Channel Strategy
              </h3>
              <p className="text-slate-400 text-lg">Comprehensive channel strategy and budget allocation</p>
            </div>
            
            {brief.outputs.channel_strategy ? (
              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Primary Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    {(brief.outputs.channel_strategy?.primary_channels || []).map((channel, index) => (
                      <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Channel Objectives</h4>
                  <ul className="space-y-2">
                    {(brief.outputs.channel_strategy?.channel_objectives || []).map((objective, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Budget Allocation</h4>
                  <p className="text-slate-300 leading-relaxed">{brief.outputs.channel_strategy.budget_allocation}</p>
                </div>
                
                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold text-white mb-3">Success Metrics</h4>
                  <ul className="space-y-2">
                    {(brief.outputs.channel_strategy?.success_metrics || []).map((metric, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl text-center">
                <p className="text-slate-400">Channel strategy not available in this brief.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Review & Edit Brief
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 hover:border-slate-500 text-sm"
          >
            {isEditing ? "View Mode" : "Edit Mode"}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 hover:border-slate-500 text-sm"
          >
            Back to Wizard
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <button
          onClick={saveBrief}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
        >
          Save Brief
        </button>
        <button
          onClick={() => downloadBrief('json')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
        >
          Download JSON
        </button>
        <button
          onClick={() => downloadBrief('pdf')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
        >
          Download PDF
        </button>
        <button
          onClick={discardBrief}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
        >
          Discard Brief
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 h-full overflow-y-auto">
            <h3 className="font-semibold text-white mb-4">Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 text-sm ${
                    activeSection === section.id
                      ? section.type === 'ai-generated'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </div>
                    {section.type === 'ai-generated' && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl h-full overflow-y-auto">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
