"use client";
import { useState } from "react";
import { MarketingBriefDocument } from "@/lib/streamlined-brief-types";
import jsPDF from "jspdf";

interface BriefDocumentProps {
  brief: MarketingBriefDocument;
  onBack: () => void;
  onDiscard?: () => void;
  onSave?: () => void;
  isViewOnly?: boolean;
}

export default function BriefDocument({ brief, onBack, onDiscard, onSave, isViewOnly = false }: BriefDocumentProps) {
  const [isEditing, setIsEditing] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };
    
    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 5;
    };
    
    // Helper function to add section header
    const addSectionHeader = (title: string) => {
      checkPageBreak(15);
      yPosition += 10;
      addText(title, 16, true, [255, 255, 255]);
      yPosition += 5;
    };
    
    // Helper function to add subsection
    const addSubsection = (title: string, content: string) => {
      checkPageBreak(20);
      addText(title, 12, true, [255, 255, 255]);
      addText(content, 10, false, [200, 200, 200]);
      yPosition += 5;
    };
    
    // Set background to black
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
    // Header
    addText(brief.document_info.title, 20, true, [255, 255, 255]);
    addText(`Generated: ${brief.document_info.generated_date}`, 12, false, [150, 150, 150]);
    addText(`Project: ${brief.document_info.project_name} | Brand: ${brief.document_info.brand_name}`, 12, false, [150, 150, 150]);
    
    // Executive Summary
    addSectionHeader('Executive Summary');
    
    addSubsection('Challenge', brief.executive_summary.challenge);
    addSubsection('Opportunity', brief.executive_summary.opportunity);
    addSubsection('Strategy', brief.executive_summary.strategy);
    addSubsection('Expected Outcome', brief.executive_summary.expected_outcome);
    
    // Strategic Foundation
    addSectionHeader('Strategic Foundation');
    
    addSubsection('Business Context', brief.strategic_foundation.business_context);
    
    // Target Audience
    addText('Target Audience', 14, true, [255, 255, 255]);
    yPosition += 5;
    
    // Persona Name and Description
    addText(brief.strategic_foundation.target_audience.persona_name, 16, true, [100, 150, 255]);
    addText(brief.strategic_foundation.target_audience.persona_description, 12, false, [200, 200, 255]);
    yPosition += 10;
    
    // Demographics - handle both string and object formats
    const demographicsText = typeof brief.strategic_foundation.target_audience.primary_demographics === 'string' 
      ? brief.strategic_foundation.target_audience.primary_demographics
      : Object.entries(brief.strategic_foundation.target_audience.primary_demographics)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
    addSubsection('Demographics', demographicsText);
    // Psychographics - handle both string and object formats
    const psychographicsText = typeof brief.strategic_foundation.target_audience.psychographics === 'string' 
      ? brief.strategic_foundation.target_audience.psychographics
      : Object.entries(brief.strategic_foundation.target_audience.psychographics)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
    addSubsection('Psychographics', psychographicsText);
    
    // Pain Points
    addText('Pain Points:', 12, true, [255, 255, 255]);
    brief.strategic_foundation.target_audience.pain_points.forEach(point => {
      addText(`• ${point}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    // Motivations
    addText('Motivations:', 12, true, [255, 255, 255]);
    brief.strategic_foundation.target_audience.motivations.forEach(motivation => {
      addText(`• ${motivation}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    // Competitive Landscape
    addText('Competitive Landscape', 14, true, [255, 255, 255]);
    yPosition += 5;
    
    addText('Key Competitors:', 12, true, [255, 255, 255]);
    brief.strategic_foundation.competitive_landscape.key_competitors.forEach(competitor => {
      addText(`• ${competitor}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    addSubsection('Competitive Advantage', brief.strategic_foundation.competitive_landscape.competitive_advantage);
    addSubsection('Market Positioning', brief.strategic_foundation.competitive_landscape.market_positioning);
    
    // Brand & Positioning
    addSectionHeader('Brand & Positioning');
    
    addSubsection('Brand Personality', brief.brand_positioning.brand_personality);
    addSubsection('Brand Values', brief.brand_positioning.brand_values.join(', '));
    addSubsection('Unique Selling Proposition', brief.brand_positioning.unique_selling_proposition);
    addSubsection('Brand Voice', brief.brand_positioning.brand_voice);
    addSubsection('Visual Direction', brief.brand_positioning.visual_direction);
    
    // Creative Strategy
    addSectionHeader('Creative Strategy');
    
    addSubsection('Big Idea', brief.creative_strategy.big_idea);
    addSubsection('Strategic Insight', brief.creative_strategy.strategic_insight);
    
    // Creative Territories
    addText('Creative Territories', 14, true, [255, 255, 255]);
    yPosition += 5;
    
    brief.creative_strategy.creative_territories.forEach((territory, index) => {
      addText(`${territory.name}`, 12, true, [255, 255, 255]);
      addText(territory.description, 10, false, [200, 200, 200]);
      addText(`Example Hook: "${territory.example_hook}"`, 10, false, [150, 150, 150]);
      yPosition += 5;
    });
    
    // Key Messages
    addText('Key Messages:', 12, true, [255, 255, 255]);
    brief.creative_strategy.key_messages.forEach(message => {
      addText(`• ${message}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    // Channel Strategy
    addSectionHeader('Channel Strategy');
    
    brief.channel_strategy.primary_channels.forEach((channel, index) => {
      addText(`${channel.channel}`, 12, true, [255, 255, 255]);
      addText(`Objective: ${channel.objective}`, 10, false, [200, 200, 200]);
      addText(`Budget Allocation: ${channel.budget_percentage}`, 10, false, [200, 200, 200]);
      
      addText('Key Metrics:', 10, true, [255, 255, 255]);
      channel.key_metrics.forEach(metric => {
        addText(`• ${metric}`, 10, false, [200, 200, 200]);
      });
      
      addText('Creative Requirements:', 10, true, [255, 255, 255]);
      channel.creative_requirements.forEach(req => {
        addText(`• ${req}`, 10, false, [200, 200, 200]);
      });
      yPosition += 10;
    });
    
    // Customer Journey
    addSectionHeader('Customer Journey');
    
    Object.entries(brief.customer_journey).forEach(([stage, data]) => {
      addText(stage.charAt(0).toUpperCase() + stage.slice(1), 12, true, [255, 255, 255]);
      addText(`Audience State: ${data.audience_state}`, 10, false, [200, 200, 200]);
      addText(`Key Message: ${data.key_message}`, 10, false, [200, 200, 200]);
      
      addText('Touchpoints:', 10, true, [255, 255, 255]);
      data.touchpoints.forEach(touchpoint => {
        addText(`• ${touchpoint}`, 10, false, [200, 200, 200]);
      });
      
      addText('Assets Needed:', 10, true, [255, 255, 255]);
      data.assets_needed.forEach(asset => {
        addText(`• ${asset}`, 10, false, [200, 200, 200]);
      });
      yPosition += 10;
    });
    
    // Measurement Framework
    addSectionHeader('Measurement Framework');
    
    addText('Primary KPIs', 14, true, [255, 255, 255]);
    yPosition += 5;
    
    brief.measurement_framework.primary_kpis.forEach((kpi, index) => {
      addText(`${kpi.kpi} - Target: ${kpi.target}`, 12, true, [255, 255, 255]);
      addText(`Method: ${kpi.measurement_method}`, 10, false, [200, 200, 200]);
      addText(`Timeframe: ${kpi.timeframe}`, 10, false, [200, 200, 200]);
      addText(`Baseline: ${kpi.baseline}`, 10, false, [200, 200, 200]);
      yPosition += 5;
    });
    
    // Test Plan
    addText('Test Plan', 14, true, [255, 255, 255]);
    yPosition += 5;
    
    brief.measurement_framework.test_plan.forEach((test, index) => {
      addText(`Hypothesis: ${test.hypothesis}`, 12, true, [255, 255, 255]);
      addText(`Variant A: ${test.variant_a}`, 10, false, [200, 200, 200]);
      addText(`Variant B: ${test.variant_b}`, 10, false, [200, 200, 200]);
      addText(`Success Metric: ${test.success_metric}`, 10, false, [200, 200, 200]);
      addText(`Timeline: ${test.timeline}`, 10, false, [200, 200, 200]);
      yPosition += 10;
    });
    
    // Implementation
    addSectionHeader('Implementation');
    
    addSubsection('Timeline', brief.implementation.timeline);
    
    addText('Key Milestones:', 12, true, [255, 255, 255]);
    brief.implementation.key_milestones.forEach(milestone => {
      addText(`• ${milestone}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    addText('Resource Requirements:', 12, true, [255, 255, 255]);
    brief.implementation.resource_requirements.forEach(resource => {
      addText(`• ${resource}`, 10, false, [200, 200, 200]);
    });
    yPosition += 5;
    
    addText('Risk Mitigation:', 12, true, [255, 255, 255]);
    brief.implementation.risk_mitigation.forEach(risk => {
      addText(`• ${risk}`, 10, false, [200, 200, 200]);
    });
    
    // Save the PDF
    doc.save(`marketing-brief-${brief.document_info.project_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const saveBrief = () => {
    localStorage.setItem('saved-briefs', JSON.stringify({
      ...JSON.parse(localStorage.getItem('saved-briefs') || '{}'),
      [Date.now()]: brief
    }));
    alert('Brief saved successfully!');
  };

  return (
    <div className="h-full overflow-y-auto bg-black">
      <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="border-b border-gray-700 pb-8 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {brief.document_info.title}
          </h1>
          <div className="text-gray-400 space-y-1 text-sm">
            <p><strong>Generated:</strong> {brief.document_info.generated_date}</p>
            <p><strong>Project:</strong> {brief.document_info.project_name} | <strong>Brand:</strong> {brief.document_info.brand_name}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          {!isViewOnly && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 font-medium transition-colors"
            >
              {isEditing ? "View Mode" : "Edit Mode"}
            </button>
          )}
          {!isViewOnly && onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
            >
              Save Brief
            </button>
          )}
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Download PDF
          </button>
          {!isViewOnly && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 font-medium transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="space-y-16">
        
        {/* Executive Summary */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Executive Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-white mb-3">Challenge</h3>
              <p className="text-gray-300 leading-relaxed">{brief.executive_summary.challenge}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-white mb-3">Opportunity</h3>
              <p className="text-gray-300 leading-relaxed">{brief.executive_summary.opportunity}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-white mb-3">Strategy</h3>
              <p className="text-gray-300 leading-relaxed">{brief.executive_summary.strategy}</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-white mb-3">Expected Outcome</h3>
              <p className="text-gray-300 leading-relaxed">{brief.executive_summary.expected_outcome}</p>
            </div>
          </div>
        </section>

        {/* Strategic Foundation */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Strategic Foundation
          </h2>
          
          <div className="space-y-10">
            {/* Business Context */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Business Context</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{brief.strategic_foundation.business_context}</p>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Target Audience</h3>
              
              {/* Persona Header */}
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
                <h4 className="text-2xl font-bold text-white mb-3">{brief.strategic_foundation.target_audience.persona_name}</h4>
                <p className="text-gray-200 text-lg leading-relaxed">{brief.strategic_foundation.target_audience.persona_description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-3">Demographics</h4>
                  {typeof brief.strategic_foundation.target_audience.primary_demographics === 'string' ? (
                    <p className="text-gray-300">{brief.strategic_foundation.target_audience.primary_demographics}</p>
                  ) : (
                    <div className="text-gray-300">
                      {Object.entries(brief.strategic_foundation.target_audience.primary_demographics).map(([key, value]) => (
                        <p key={key} className="mb-1">
                          <span className="font-medium capitalize">{key}:</span> {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Psychographics</h4>
                  {typeof brief.strategic_foundation.target_audience.psychographics === 'string' ? (
                    <p className="text-gray-300">{brief.strategic_foundation.target_audience.psychographics}</p>
                  ) : (
                    <div className="text-gray-300">
                      {Object.entries(brief.strategic_foundation.target_audience.psychographics).map(([key, value]) => (
                        <p key={key} className="mb-1">
                          <span className="font-medium capitalize">{key}:</span> {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Pain Points</h4>
                  <ul className="text-gray-300 space-y-2">
                    {brief.strategic_foundation.target_audience.pain_points.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Motivations</h4>
                  <ul className="text-gray-300 space-y-2">
                    {brief.strategic_foundation.target_audience.motivations.map((motivation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>{motivation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitive Landscape */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Competitive Landscape</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Key Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {brief.strategic_foundation.competitive_landscape.key_competitors.map((competitor, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded border border-gray-600 text-sm">
                        {competitor}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Competitive Advantage</h4>
                  <p className="text-gray-300">{brief.strategic_foundation.competitive_landscape.competitive_advantage}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Market Positioning</h4>
                  <p className="text-gray-300">{brief.strategic_foundation.competitive_landscape.market_positioning}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand & Positioning */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Brand & Positioning
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Brand Personality</h3>
              <p className="text-gray-300">{brief.brand_positioning.brand_personality}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Brand Values</h3>
              <ul className="text-gray-300 space-y-2">
                {brief.brand_positioning.brand_values.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Unique Selling Proposition</h3>
              <p className="text-gray-300">{brief.brand_positioning.unique_selling_proposition}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Brand Voice</h3>
              <p className="text-gray-300">{brief.brand_positioning.brand_voice}</p>
            </div>
          </div>
        </section>

        {/* Creative Strategy */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Creative Strategy
          </h2>
          
          <div className="space-y-10">
            {/* Big Idea */}
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Big Idea
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">{brief.creative_strategy.big_idea}</p>
            </div>

            {/* Strategic Insight */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Strategic Insight</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{brief.creative_strategy.strategic_insight}</p>
            </div>

            {/* Creative Territories */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Creative Territories</h3>
              <div className="space-y-6">
                {brief.creative_strategy.creative_territories.map((territory, index) => (
                  <div key={index} className="border-l-4 border-gray-600 pl-6 bg-gray-900/50 p-6">
                    <h4 className="font-semibold text-white text-lg mb-3">{territory.name}</h4>
                    <p className="text-gray-300 mb-4">{territory.description}</p>
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded">
                      <p className="text-gray-400 text-sm italic">"{territory.example_hook}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Channel Strategy */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Channel Strategy
          </h2>
          
          <div className="space-y-8">
            {brief.channel_strategy.primary_channels.map((channel, index) => (
              <div key={index} className="border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">{channel.channel}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Objective</h4>
                    <p className="text-gray-300">{channel.objective}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Budget Allocation</h4>
                    <p className="text-gray-300 font-medium">{channel.budget_percentage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Metrics</h4>
                    <ul className="text-gray-300 space-y-1">
                      {channel.key_metrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Creative Requirements</h4>
                    <ul className="text-gray-300 space-y-1">
                      {channel.creative_requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Journey */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Customer Journey
          </h2>
          
          <div className="space-y-8">
            {Object.entries(brief.customer_journey).map(([stage, data], index) => (
              <div key={stage} className="border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">{stage}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Audience State</h4>
                    <p className="text-gray-300">{data.audience_state}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Message</h4>
                    <p className="text-gray-300">{data.key_message}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Touchpoints</h4>
                    <ul className="text-gray-300 space-y-1">
                      {data.touchpoints.map((touchpoint, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <span>{touchpoint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Assets Needed</h4>
                    <ul className="text-gray-300 space-y-1">
                      {data.assets_needed.map((asset, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          <span>{asset}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Measurement Framework */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Measurement Framework
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Primary KPIs</h3>
              <div className="space-y-4">
                {brief.measurement_framework.primary_kpis.map((kpi, index) => (
                  <div key={index} className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-white">{kpi.kpi}</h4>
                      <span className="text-white font-bold bg-gray-800 px-3 py-1 rounded border border-gray-600">{kpi.target}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 font-medium">Method: </span>
                        <span className="text-gray-300">{kpi.measurement_method}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Timeframe: </span>
                        <span className="text-gray-300">{kpi.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Baseline: </span>
                        <span className="text-gray-300">{kpi.baseline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Test Plan</h3>
              <div className="space-y-4">
                {brief.measurement_framework.test_plan.map((test, index) => (
                  <div key={index} className="border border-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">{test.hypothesis}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400 font-medium">Variant A: </span>
                        <span className="text-gray-300">{test.variant_a}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Variant B: </span>
                        <span className="text-gray-300">{test.variant_b}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Success Metric: </span>
                        <span className="text-gray-300">{test.success_metric}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Timeline: </span>
                        <span className="text-gray-300">{test.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Implementation */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-2">
            Implementation
          </h2>
          
          <div className="border border-gray-700 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
                <p className="text-gray-300">{brief.implementation.timeline}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Milestones</h3>
                <ul className="text-gray-300 space-y-2">
                  {brief.implementation.key_milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Resource Requirements</h3>
                <ul className="text-gray-300 space-y-2">
                  {brief.implementation.resource_requirements.map((resource, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Risk Mitigation</h3>
                <ul className="text-gray-300 space-y-2">
                  {brief.implementation.risk_mitigation.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
