"use client";
import { useState } from "react";
import { MarketingBrief } from "@/lib/brief-types";
import jsPDF from "jspdf";

interface BriefReviewProps {
  brief: MarketingBrief;
  onBack: () => void;
}

export default function BriefReview({ brief, onBack }: BriefReviewProps) {
  const [editedBrief, setEditedBrief] = useState<MarketingBrief>(brief);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Safety check to ensure brief has required structure
  if (!brief || !brief.project || !brief.project.title) {
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
      link.download = `marketing-brief-${brief.project.title.replace(/\s+/g, '-').toLowerCase()}.json`;
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
      doc.text(`Title: ${editedBrief.project.title}`, 20, 50);
      doc.text(`Launch Window: ${editedBrief.project.launch_window}`, 20, 60);
      doc.text(`Owner: ${editedBrief.project.owner}`, 20, 70);
      
      // Add objective
      doc.setFontSize(14);
      doc.text('Objective', 20, 90);
      doc.setFontSize(12);
      doc.text(`SMART Goal: ${editedBrief.objective.smart}`, 20, 100);
      
      // Add audience
      doc.setFontSize(14);
      doc.text('Target Audience', 20, 120);
      doc.setFontSize(12);
      doc.text(`Descriptor: ${editedBrief.audience.descriptor}`, 20, 130);
      doc.text(`Pain Point: ${editedBrief.audience.pain_tension}`, 20, 140);
      
      // Add big idea
      doc.setFontSize(14);
      doc.text('Big Idea', 20, 160);
      doc.setFontSize(12);
      doc.text(editedBrief.outputs.big_idea, 20, 170);
      
      // Save the PDF
      doc.save(`marketing-brief-${brief.project.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
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

  const sections = [
    { id: "overview", title: "Overview", icon: "📋" },
    { id: "project", title: "Project", icon: "🚀" },
    { id: "objective", title: "Objective", icon: "🎯" },
    { id: "audience", title: "Audience", icon: "👥" },
    { id: "brand", title: "Brand", icon: "🏷️" },
    { id: "message", title: "Message", icon: "💬" },
    { id: "execution", title: "Execution", icon: "⚡" },
    { id: "outputs", title: "AI Outputs", icon: "🤖" }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white mb-6">Marketing Brief Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-blue-400 mb-3 text-lg">Project Summary</h4>
                <p className="text-white text-lg font-medium">{brief.project.title}</p>
                <p className="text-slate-300 text-sm mt-2">{brief.project.business_context}</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-green-400 mb-3 text-lg">Key Objective</h4>
                <p className="text-white text-sm leading-relaxed">{brief.objective.smart}</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-purple-400 mb-3 text-lg">Target Audience</h4>
                <p className="text-white text-sm leading-relaxed">{brief.audience.descriptor}</p>
              </div>
              <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl">
                <h4 className="font-semibold text-orange-400 mb-3 text-lg">Big Idea</h4>
                <p className="text-white text-sm leading-relaxed">{brief.outputs.big_idea}</p>
              </div>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Project Details</h3>
            {isEditing ? (
              <div className="space-y-6">
                <input
                  type="text"
                  value={editedBrief.project.title}
                  onChange={(e) => updateBrief("project", "title", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.project.launch_window}
                  onChange={(e) => updateBrief("project", "launch_window", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.project.owner}
                  onChange={(e) => updateBrief("project", "owner", e.target.value)}
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
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Title:</strong> <span className="text-slate-300 ml-2">{brief.project.title}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Launch Window:</strong> <span className="text-slate-300 ml-2">{brief.project.launch_window}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Owner:</strong> <span className="text-slate-300 ml-2">{brief.project.owner}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-blue-400">Business Context:</strong> <span className="text-slate-300 ml-2">{brief.project.business_context}</span></div>
              </div>
            )}
          </div>
        );

      case "objective":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Objectives & KPIs</h3>
            {isEditing ? (
              <div className="space-y-6">
                <textarea
                  value={editedBrief.objective.smart}
                  onChange={(e) => updateBrief("objective", "smart", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={editedBrief.objective.primary_kpis.join(", ")}
                  onChange={(e) => updateArrayField("objective", "primary_kpis", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.objective.targets || ""}
                  onChange={(e) => updateBrief("objective", "targets", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.objective.learning_goal || ""}
                  onChange={(e) => updateBrief("objective", "learning_goal", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">SMART Objective:</strong> <span className="text-slate-300 ml-2">{brief.objective.smart}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Primary KPIs:</strong> <span className="text-slate-300 ml-2">{brief.objective.primary_kpis.join(", ")}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Targets:</strong> <span className="text-slate-300 ml-2">{brief.objective.targets || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-green-400">Learning Goal:</strong> <span className="text-slate-300 ml-2">{brief.objective.learning_goal || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "audience":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Target Audience</h3>
            {isEditing ? (
              <div className="space-y-6">
                <input
                  type="text"
                  value={editedBrief.audience.descriptor}
                  onChange={(e) => updateBrief("audience", "descriptor", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  value={editedBrief.audience.pain_tension}
                  onChange={(e) => updateBrief("audience", "pain_tension", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={editedBrief.audience.current_emotion || ""}
                  onChange={(e) => updateBrief("audience", "current_emotion", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.audience.desired_emotion || ""}
                  onChange={(e) => updateBrief("audience", "desired_emotion", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.audience.desired_action}
                  onChange={(e) => updateBrief("audience", "desired_action", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Descriptor:</strong> <span className="text-slate-300 ml-2">{brief.audience.descriptor}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Pain/Tension:</strong> <span className="text-slate-300 ml-2">{brief.audience.pain_tension}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Current Emotion:</strong> <span className="text-slate-300 ml-2">{brief.audience.current_emotion || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Desired Emotion:</strong> <span className="text-slate-300 ml-2">{brief.audience.desired_emotion || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-purple-400">Desired Action:</strong> <span className="text-slate-300 ml-2">{brief.audience.desired_action}</span></div>
              </div>
            )}
          </div>
        );

      case "brand":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Brand & Positioning</h3>
            {isEditing ? (
              <div className="space-y-6">
                <input
                  type="text"
                  value={editedBrief.brand.role}
                  onChange={(e) => updateBrief("brand", "role", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  value={editedBrief.brand.positioning || ""}
                  onChange={(e) => updateBrief("brand", "positioning", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={(editedBrief.brand.competitors || []).join(", ")}
                  onChange={(e) => updateArrayField("brand", "competitors", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Role:</strong> <span className="text-slate-300 ml-2">{brief.brand.role}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Positioning:</strong> <span className="text-slate-300 ml-2">{brief.brand.positioning || "Not specified"}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-orange-400">Competitors:</strong> <span className="text-slate-300 ml-2">{(brief.brand.competitors || []).join(", ") || "Not specified"}</span></div>
              </div>
            )}
          </div>
        );

      case "message":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Core Message</h3>
            {isEditing ? (
              <div className="space-y-6">
                <textarea
                  value={editedBrief.insight}
                  onChange={(e) => updateBrief("insight", "", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-24"
                />
                <input
                  type="text"
                  value={editedBrief.message.smp}
                  onChange={(e) => updateBrief("message", "smp", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={editedBrief.message.reasons_to_believe.join(", ")}
                  onChange={(e) => updateArrayField("message", "reasons_to_believe", e.target.value)}
                  className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">Key Insight:</strong> <span className="text-slate-300 ml-2">{brief.insight}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">SMP:</strong> <span className="text-slate-300 ml-2">{brief.message.smp}</span></div>
                <div className="bg-slate-800 p-4 rounded-xl"><strong className="text-pink-400">Reasons to Believe:</strong> <span className="text-slate-300 ml-2">{brief.message.reasons_to_believe.join(", ")}</span></div>
              </div>
            )}
          </div>
        );

      case "execution":
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Execution Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Tone & Style</h4>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={(editedBrief.tone_style.tone_tags || []).join(", ")}
                      onChange={(e) => updateArrayField("tone_style", "tone_tags", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tone tags"
                    />
                    <input
                      type="text"
                      value={(editedBrief.tone_style.mood_tags || []).join(", ")}
                      onChange={(e) => updateArrayField("tone_style", "mood_tags", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Mood tags"
                    />
                    <input
                      type="text"
                      value={(editedBrief.tone_style.avoid || []).join(", ")}
                      onChange={(e) => updateArrayField("tone_style", "avoid", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Avoid"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Tone:</strong> <span className="text-slate-300 ml-2">{(brief.tone_style.tone_tags || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Mood:</strong> <span className="text-slate-300 ml-2">{(brief.tone_style.mood_tags || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Avoid:</strong> <span className="text-slate-300 ml-2">{(brief.tone_style.avoid || []).join(", ") || "Not specified"}</span></div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Channels & Formats</h4>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={(editedBrief.channels_formats.channels || []).join(", ")}
                      onChange={(e) => updateArrayField("channels_formats", "channels", e.target.value)}
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
                      value={(editedBrief.channels_formats.constraints || []).join(", ")}
                      onChange={(e) => updateArrayField("channels_formats", "constraints", e.target.value)}
                      className="w-full p-4 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Constraints"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Channels:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.channels || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Formats:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.formats || []).join(", ") || "Not specified"}</span></div>
                    <div className="bg-slate-800 p-3 rounded-xl"><strong className="text-cyan-400">Constraints:</strong> <span className="text-slate-300 ml-2">{(brief.channels_formats.constraints || []).join(", ") || "Not specified"}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "outputs":
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">AI-Generated Outputs</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Executive Summary</h4>
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
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Big Idea</h4>
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
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Creative Territories</h4>
                {brief.outputs.creative_territories.map((territory, index) => (
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
                <h4 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-3">Customer Journey Map</h4>
                {brief.outputs.journey_map.map((stage, index) => (
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

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Review & Edit Brief
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 hover:border-slate-500"
          >
            {isEditing ? "View Mode" : "Edit Mode"}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 hover:border-slate-500"
          >
            Back to Wizard
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={saveBrief}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          Save Brief
        </button>
        <button
          onClick={() => downloadBrief('json')}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          Download JSON
        </button>
        <button
          onClick={() => downloadBrief('pdf')}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sticky top-6">
            <h3 className="font-semibold text-white mb-6 text-lg">Sections</h3>
            <nav className="space-y-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
