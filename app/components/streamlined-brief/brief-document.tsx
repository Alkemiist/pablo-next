'use client';

import { ArrowLeft, Save, Download, Share2, Eye, EyeOff, Edit3, X, Check, TrendingUp, Users, Target, BarChart3, Calendar, AlertTriangle, Lightbulb, Zap, Globe, Award, Shield, FileText, PieChart, Layers, Settings, CheckCircle } from 'lucide-react';
import { MarketingBriefDocument } from '@/lib/streamlined-brief-types';

interface BriefDocumentProps {
  brief: MarketingBriefDocument;
  onBack: () => void;
  onDiscard: () => void;
  onSave: () => void;
  onBriefUpdate?: (updatedBrief: MarketingBriefDocument) => void;
  isViewOnly?: boolean;
}

export default function BriefDocument({ 
  brief, 
  onBack, 
  onDiscard, 
  onSave, 
  onBriefUpdate,
  isViewOnly = false 
}: BriefDocumentProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Document Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Document Header */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Title Section */}
            <div className="lg:col-span-2">
              <h1 className="text-5xl font-bold text-white mb-3 leading-tight">{brief.document_info.title}</h1>
              <p className="text-xl text-neutral-300 mb-6 font-medium">Strategic Marketing Brief</p>
              
              {/* Project Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Project</span>
                  <p className="text-lg text-white font-medium">{brief.document_info.project_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Brand</span>
                  <p className="text-lg text-white font-medium">{brief.document_info.brand_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Version</span>
                  <p className="text-lg text-white font-medium">{brief.document_info.brief_version}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Confidentiality</span>
                  <p className="text-lg text-white font-medium">{brief.document_info.confidentiality_level}</p>
                </div>
              </div>
            </div>
            
            {/* Status Section */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-800/50 rounded-xl p-6 h-full">
                <h3 className="text-lg font-semibold text-white mb-4">Document Status</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Generated</span>
                    <p className="text-white font-medium mt-1">{brief.document_info.generated_date}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Next Review</span>
                    <p className="text-white font-medium mt-1">{brief.document_info.next_review_date}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">Status</span>
                    <div className="mt-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        brief.document_info.approval_status === 'Approved' ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50' :
                        brief.document_info.approval_status === 'Draft' ? 'bg-amber-900/30 text-amber-300 border border-amber-700/50' :
                        'bg-neutral-700/30 text-neutral-300 border border-neutral-600/50'
                      }`}>
                        {brief.document_info.approval_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-8 bg-gradient-to-r from-neutral-900/20 to-slate-900/20 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">1. Executive Summary</div>
              <div className="text-neutral-400 text-sm ml-4">Strategic Overview & ROI Projections</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">2. Strategic Foundation</div>
              <div className="text-neutral-400 text-sm ml-4">Market Analysis & Competitive Intelligence</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">3. Brand Positioning</div>
              <div className="text-neutral-400 text-sm ml-4">Brand Strategy & Voice Guidelines</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">4. Creative Strategy</div>
              <div className="text-neutral-400 text-sm ml-4">Big Idea & Creative Territories</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">5. Channel Strategy</div>
              <div className="text-neutral-400 text-sm ml-4">Media Planning & Budget Optimization</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">6. Customer Journey</div>
              <div className="text-neutral-400 text-sm ml-4">Journey Mapping & Touchpoint Strategy</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">7. Measurement Framework</div>
              <div className="text-neutral-400 text-sm ml-4">KPIs & Testing Strategy</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">8. Implementation</div>
              <div className="text-neutral-400 text-sm ml-4">Timeline & Resource Allocation</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-semibold text-lg">9. Compliance Framework</div>
              <div className="text-neutral-400 text-sm ml-4">Regulatory & Brand Safety Guidelines</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Executive Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Challenge
                </h3>
                <p className="text-neutral-300 leading-relaxed">{brief.executive_summary.challenge}</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Strategy
                </h3>
                <p className="text-neutral-300 leading-relaxed">{brief.executive_summary.strategy}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                  Opportunity
                </h3>
                <p className="text-neutral-300 leading-relaxed">{brief.executive_summary.opportunity}</p>
              </div>
              <div className="bg-neutral-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Expected Outcome
                </h3>
                <p className="text-neutral-300 leading-relaxed">{brief.executive_summary.expected_outcome}</p>
              </div>
            </div>
          </div>

          {/* ROI Projections */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <PieChart className="w-6 h-6 text-emerald-400" />
              ROI Projections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-neutral-800/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Revenue Increase</h4>
                <p className="text-emerald-400 font-bold text-xl">{brief.executive_summary.roi_projections?.revenue_increase || "N/A"}</p>
              </div>
              <div className="bg-neutral-800/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">CPA Reduction</h4>
                <p className="text-blue-400 font-bold text-xl">{brief.executive_summary.roi_projections?.cpa_reduction || "N/A"}</p>
              </div>
              <div className="bg-neutral-800/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">LTV Increase</h4>
                <p className="text-emerald-400 font-bold text-xl">{brief.executive_summary.roi_projections?.ltv_increase || "N/A"}</p>
              </div>
              <div className="bg-neutral-800/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Payback Period</h4>
                <p className="text-blue-400 font-bold text-xl">{brief.executive_summary.roi_projections?.payback_period || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Executive Recommendations */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              Executive Recommendations
            </h3>
            <div className="bg-neutral-800/50 rounded-xl p-6">
              <ul className="space-y-3">
                {(brief.executive_summary?.executive_recommendations || []).map((recommendation, index) => (
                  <li key={index} className="text-neutral-300 flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-emerald-400 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="leading-relaxed">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Strategic Foundation */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Strategic Foundation
          </h2>
          
          {/* Business Context */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-white mb-6">Business Context</h3>
            <div className="bg-neutral-800/50 p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Company Overview</h4>
                    <p className="text-neutral-300 leading-relaxed">{brief.strategic_foundation?.business_context?.company_overview || "N/A"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Market Position</h4>
                    <p className="text-neutral-300 leading-relaxed">{brief.strategic_foundation?.business_context?.market_position || "N/A"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Strategic Initiatives</h4>
                    <p className="text-neutral-300 leading-relaxed">{brief.strategic_foundation?.business_context?.strategic_initiatives?.join(", ") || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Business Objectives</h4>
                    <ul className="space-y-2">
                      {(brief.strategic_foundation?.business_context?.business_objectives || []).map((objective, index) => (
                        <li key={index} className="text-neutral-300 flex items-start gap-3">
                          <div className="w-5 h-5 bg-emerald-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-emerald-400 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="leading-relaxed">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Industry Trends</h4>
                    <div className="flex flex-wrap gap-2">
                      {(brief.strategic_foundation?.business_context?.industry_trends || []).map((trend, index) => (
                        <span key={index} className="px-3 py-1 bg-neutral-700/50 text-neutral-300 rounded-full text-sm border border-neutral-600/50">
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-neutral-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Target Audience
            </h3>
            <div className="bg-neutral-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-2">{brief.strategic_foundation?.target_audience?.primary_persona?.persona_name || "N/A"}</h4>
              <p className="text-neutral-300 mb-4">{brief.strategic_foundation?.target_audience?.primary_persona?.persona_description || "N/A"}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-semibold text-neutral-200 mb-2">Demographics</h5>
                  <div className="space-y-1 text-sm">
                    <p className="text-neutral-400"><span className="font-semibold">Age:</span> {brief.strategic_foundation?.target_audience?.primary_persona?.demographics?.age_range || "N/A"}</p>
                    <p className="text-neutral-400"><span className="font-semibold">Income:</span> {brief.strategic_foundation?.target_audience?.primary_persona?.demographics?.income_level || "N/A"}</p>
                    <p className="text-neutral-400"><span className="font-semibold">Location:</span> {brief.strategic_foundation?.target_audience?.primary_persona?.demographics?.geographic_location || "N/A"}</p>
                    <p className="text-neutral-400"><span className="font-semibold">Occupation:</span> {brief.strategic_foundation?.target_audience?.primary_persona?.demographics?.occupation || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-neutral-200 mb-2">Psychographics</h5>
                  <div className="space-y-1 text-sm">
                    <p className="text-neutral-400"><span className="font-semibold">Values:</span> {(brief.strategic_foundation?.target_audience?.primary_persona?.psychographics?.values || []).join(', ') || "N/A"}</p>
                    <p className="text-neutral-400"><span className="font-semibold">Lifestyle:</span> {brief.strategic_foundation?.target_audience?.primary_persona?.psychographics?.lifestyle || "N/A"}</p>
                    <p className="text-neutral-400"><span className="font-semibold">Interests:</span> {(brief.strategic_foundation?.target_audience?.primary_persona?.psychographics?.interests || []).join(', ') || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-neutral-200 mb-2">Media Preferences</h5>
                  <div className="space-y-1 text-sm">
                    {(brief.strategic_foundation?.target_audience?.primary_persona?.media_preferences || []).map((pref, index) => (
                      <div key={index} className="text-neutral-400">
                        <span className="font-semibold">{pref.platform}:</span> {pref.usage_frequency}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h5 className="text-sm font-semibold text-neutral-200 mb-2">Pain Points</h5>
                  <ul className="space-y-1">
                    {(brief.strategic_foundation?.target_audience?.primary_persona?.pain_points || []).map((pain, index) => (
                      <li key={index} className="text-neutral-400 text-sm">
                        <span className="font-semibold">{pain.pain_point}</span> - {pain.severity} severity
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-neutral-200 mb-2">Motivations</h5>
                  <ul className="space-y-1">
                    {(brief.strategic_foundation?.target_audience?.primary_persona?.motivations || []).map((motivation, index) => (
                      <li key={index} className="text-neutral-400 text-sm">
                        <span className="font-semibold">{motivation.motivation}</span> - {motivation.importance} importance
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Intelligence */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-neutral-200 mb-4">Competitive Intelligence</h3>
            <div className="bg-neutral-900/50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Key Competitors</h4>
                  <div className="space-y-3">
                    {(brief.strategic_foundation?.competitive_intelligence?.competitor_analysis || []).map((competitor, index) => (
                      <div key={index} className="border border-neutral-700 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-white">{competitor.competitor_name}</h5>
                          <span className={`px-2 py-1 rounded text-xs ${
                            competitor.threat_level === 'High' ? 'bg-red-900/30 text-red-300 border border-red-800/50' :
                            competitor.threat_level === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50' :
                            'bg-green-900/30 text-green-300 border border-green-800/50'
                          }`}>
                            {competitor.threat_level} Threat
                          </span>
                        </div>
                        <p className="text-neutral-400 text-sm mb-2">{competitor.market_position}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-semibold text-green-400">Strengths:</span>
                            <ul className="text-neutral-400">
                              {competitor.strengths.slice(0, 2).map((strength, i) => (
                                <li key={i}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-semibold text-red-400">Weaknesses:</span>
                            <ul className="text-neutral-400">
                              {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                                <li key={i}>• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Competitive Positioning</h4>
                  <p className="text-neutral-300 mb-4">{brief.strategic_foundation?.competitive_intelligence?.competitive_positioning?.positioning_map || "N/A"}</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">Differentiation Strategy</h4>
                  <p className="text-neutral-300 mb-4">{brief.strategic_foundation?.competitive_intelligence?.competitive_positioning?.differentiation_strategy || "N/A"}</p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">Market Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {(brief.strategic_foundation?.competitive_intelligence?.competitive_positioning?.market_gaps || []).map((gap, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-sm border border-blue-800/50">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SWOT Analysis */}
          <div>
            <h3 className="text-xl font-semibold text-neutral-200 mb-4">SWOT Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-800/30">
                <h4 className="text-lg font-semibold text-green-400 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {(brief.strategic_foundation?.swot_analysis?.strengths || []).map((strength, index) => (
                    <li key={index} className="text-neutral-300 text-sm">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/30">
                <h4 className="text-lg font-semibold text-red-400 mb-2">Weaknesses</h4>
                <ul className="space-y-1">
                  {(brief.strategic_foundation?.swot_analysis?.weaknesses || []).map((weakness, index) => (
                    <li key={index} className="text-neutral-300 text-sm">• {weakness}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Opportunities</h4>
                <ul className="space-y-1">
                  {(brief.strategic_foundation?.swot_analysis?.opportunities || []).map((opportunity, index) => (
                    <li key={index} className="text-neutral-300 text-sm">• {opportunity}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-800/30">
                <h4 className="text-lg font-semibold text-orange-400 mb-2">Threats</h4>
                <ul className="space-y-1">
                  {(brief.strategic_foundation?.swot_analysis?.threats || []).map((threat, index) => (
                    <li key={index} className="text-neutral-300 text-sm">• {threat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Positioning */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            Brand Positioning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Positioning Statement</h3>
              <p className="text-neutral-400 leading-relaxed mb-4">{brief.brand_positioning?.positioning_strategy?.positioning_statement || "N/A"}</p>
              
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Value Proposition</h3>
              <p className="text-neutral-400 leading-relaxed">{brief.brand_positioning?.positioning_strategy?.value_proposition || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Brand Personality</h3>
              <p className="text-neutral-400 leading-relaxed mb-4">{brief.brand_positioning?.brand_voice_tone?.brand_personality || "N/A"}</p>
              
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">Communication Style</h3>
              <p className="text-neutral-400 leading-relaxed">{brief.brand_positioning?.brand_voice_tone?.communication_style || "N/A"}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Differentiation Factors</h3>
            <div className="flex flex-wrap gap-2">
              {(brief.brand_positioning?.positioning_strategy?.differentiation_factors || []).map((factor, index) => (
                <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-800/50">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Creative Strategy */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            Creative Strategy
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Big Idea</h3>
              <p className="text-neutral-400 leading-relaxed">{brief.creative_strategy?.big_idea?.core_concept || "N/A"}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Creative Hook</h3>
              <p className="text-neutral-400 leading-relaxed">{brief.creative_strategy?.big_idea?.creative_hook || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">Creative Territories</h3>
              <div className="space-y-4">
                {(brief.creative_strategy?.creative_territories || []).map((territory, index) => (
                  <div key={index} className="bg-neutral-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">{territory.name}</h4>
                    <p className="text-neutral-300 mb-3">{territory.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-neutral-200">Example Hook:</span>
                        <p className="text-neutral-400">{territory.example_hook}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Visual Direction:</span>
                        <p className="text-neutral-400">{territory.visual_direction}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Target Emotion:</span>
                        <p className="text-neutral-400">{territory.target_emotion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Key Messages</h3>
              <ul className="space-y-2">
                {(brief.creative_strategy?.messaging_framework?.supporting_messages || []).map((message, index) => (
                  <li key={index} className="text-neutral-400 flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Channel Strategy */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            Channel Strategy
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">Primary Channels</h3>
              <div className="space-y-4">
                {(brief.channel_strategy?.channel_mix?.primary_channels || []).map((channel, index) => (
                  <div key={index} className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{channel.channel}</h4>
                      <span className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-sm border border-cyan-800/50">
                        {channel.budget_percentage}
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-3">{channel.objective}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-200 mb-1">Key Metrics</h5>
                        <div className="flex flex-wrap gap-1">
                          {channel.key_metrics.map((metric, idx) => (
                            <span key={idx} className="px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-200 mb-1">Creative Requirements</h5>
                        <div className="flex flex-wrap gap-1">
                          {channel.creative_requirements.map((req, idx) => (
                            <span key={idx} className="px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Budget Optimization</h3>
              <p className="text-neutral-400">{brief.channel_strategy?.budget_optimization?.budget_allocation || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Customer Journey */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Customer Journey
          </h2>
          
          <div className="space-y-8">
            {/* Journey Stages */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Journey Stages</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max pb-4">
                  {(brief.customer_journey?.journey_mapping?.journey_stages || []).map((journeyStage, index) => (
                    <div key={journeyStage.stage} className="flex-shrink-0 w-80 bg-neutral-800/50 p-6 rounded-xl relative">
                      {/* Stage Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-emerald-900/30 rounded-full flex items-center justify-center">
                          <span className="text-emerald-400 text-sm font-bold">{index + 1}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white capitalize">{journeyStage.stage}</h4>
                      </div>
                      
                      {/* Stage Content */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Audience State</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{journeyStage.audience_state}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Key Message</h5>
                          <p className="text-neutral-300 text-sm leading-relaxed">{journeyStage.key_message}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Touchpoints</h5>
                          <div className="flex flex-wrap gap-1">
                            {journeyStage.touchpoints.map((touchpoint, touchpointIndex) => (
                              <span key={touchpointIndex} className="px-2 py-1 bg-neutral-700/50 text-neutral-300 rounded text-xs border border-neutral-600/50">
                                {touchpoint}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Success Metrics</h5>
                          <div className="flex flex-wrap gap-1">
                            {journeyStage.success_metrics.map((metric, metricIndex) => (
                              <span key={metricIndex} className="px-2 py-1 bg-emerald-900/30 text-emerald-300 rounded text-xs border border-emerald-700/50">
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow connector (except for last item) */}
                      {index < (brief.customer_journey?.journey_mapping?.journey_stages || []).length - 1 && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 bg-neutral-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Journey Insights */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Journey Insights</h3>
              <div className="bg-neutral-800/50 p-6 rounded-xl">
                <ul className="space-y-3">
                  {(brief.customer_journey?.journey_mapping?.journey_insights || []).map((insight, index) => (
                    <li key={index} className="text-neutral-300 flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Behavioral Triggers */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Behavioral Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(brief.customer_journey?.behavioral_triggers || []).map((trigger, index) => (
                  <div key={index} className="bg-neutral-800/50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-white mb-3">{trigger.trigger}</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-1">Psychological Principle</h5>
                        <p className="text-neutral-300 text-sm">{trigger.psychological_principle}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-1">Application</h5>
                        <p className="text-neutral-300 text-sm">{trigger.application}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-1">Expected Outcome</h5>
                        <p className="text-neutral-300 text-sm">{trigger.expected_outcome}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Framework */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Measurement Framework
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">Primary KPIs</h3>
              <div className="space-y-3">
                {(brief.measurement_framework?.kpi_dashboard?.primary_kpis || []).map((kpi, index) => (
                  <div key={index} className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{kpi.kpi}</h4>
                      <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-sm border border-yellow-800/50">
                        {kpi.target}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-neutral-200">Measurement Method:</span>
                        <p className="text-neutral-400">{kpi.measurement_method}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Timeframe:</span>
                        <p className="text-neutral-400">{kpi.timeframe}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Owner:</span>
                        <p className="text-neutral-400">{kpi.owner}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">Testing Strategy</h3>
              <div className="space-y-3">
                {(brief.measurement_framework?.testing_strategy?.test_plan || []).map((test, index) => (
                  <div key={index} className="bg-neutral-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">{test.hypothesis}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-neutral-200">Variant A:</span>
                        <p className="text-neutral-400">{test.variant_a}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Variant B:</span>
                        <p className="text-neutral-400">{test.variant_b}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Success Metric:</span>
                        <p className="text-neutral-400">{test.success_metric}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Timeline:</span>
                        <p className="text-neutral-400">{test.timeline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Implementation
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Project Timeline</h3>
              <p className="text-neutral-400 mb-4">{brief.implementation?.project_timeline?.timeline || "N/A"}</p>
              
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Key Milestones</h3>
              <ul className="space-y-2">
                {(brief.implementation?.project_timeline?.key_milestones || []).map((milestone, index) => (
                  <li key={index} className="text-neutral-400 flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold">{milestone.milestone_name}</span> - {milestone.due_date}
                      <p className="text-sm text-neutral-500">{milestone.owner}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Resource Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {(brief.implementation?.resource_allocation?.resource_requirements || []).map((resource, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-900/30 text-gray-300 rounded-full text-sm border border-gray-800/50">
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Risk Management</h3>
              <ul className="space-y-2">
                {(brief.implementation?.risk_management?.risk_assessment || []).map((risk, index) => (
                  <li key={index} className="text-neutral-400 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <span className="font-semibold">{risk.risk}</span> - {risk.probability} probability, {risk.impact} impact
                      <p className="text-sm text-neutral-500">Mitigation: {risk.mitigation_strategy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance Framework */}
        <div className="mb-12 p-10 bg-gradient-to-r from-neutral-900/30 to-slate-900/30 rounded-2xl border border-neutral-700/50 shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Compliance Framework
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">Regulatory Requirements</h3>
              <div className="space-y-3">
                {(brief.compliance_framework?.regulatory_requirements || []).map((requirement, index) => (
                  <div key={index} className="bg-neutral-900/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{requirement.requirement}</h4>
                      <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-sm border border-red-800/50">
                        {requirement.jurisdiction}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-neutral-200">Deadline:</span>
                        <p className="text-neutral-400">{requirement.compliance_deadline}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-200">Responsible Party:</span>
                        <p className="text-neutral-400">{requirement.responsible_party}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">Data Privacy Compliance</h3>
              <div className="bg-neutral-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 mb-1">Privacy Regulations</h4>
                    <div className="flex flex-wrap gap-1">
                      {(brief.compliance_framework?.data_privacy_compliance?.privacy_regulations || []).map((regulation, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs border border-blue-800/50">
                          {regulation}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-200 mb-1">Consent Management</h4>
                    <p className="text-neutral-400 text-sm">{brief.compliance_framework?.data_privacy_compliance?.consent_management || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {!isViewOnly && (
            <>
              <button
                onClick={onSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Save Brief
              </button>
              <button
                onClick={onDiscard}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Discard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}