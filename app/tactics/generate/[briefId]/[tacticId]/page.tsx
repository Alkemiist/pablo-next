'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, CheckCircle, Clock, Target, Users, DollarSign, BarChart3, Calendar, AlertTriangle, Shield, ArrowLeft, Loader2, Edit3, RefreshCw, Send } from 'lucide-react';

// Types
interface GeneratedTactic {
  tactic_overview: {
    tactic_name: string;
    tactic_type: string;
    brief_linkage: {
      challenge: string;
      opportunity: string;
      target_audience_summary: string;
      brand_positioning_summary: string;
      creative_hook_or_big_idea: string;
    };
    strategic_role: string;
  };
  executable_idea: {
    core_concept: string;
    execution_premise: string;
    key_mechanism: string;
    unique_angle: string;
    implementation_hook: string;
  };
  concept_and_creative_direction: {
    idea_name: string;
    big_idea_or_theme: string;
    experience_or_execution_concept: string;
    key_creative_assets: string[];
    emotional_hook: string;
  };
  channel_and_audience_integration: {
    primary_channels: string[];
    supporting_channels: string[];
    target_segments: string[];
    customer_journey_entry_points: string[];
  };
  activation_components: Array<{
    component: string;
    description: string;
    role: string;
    asset_format: string;
  }>;
  channel_plan: Array<{
    channel: string;
    objective: string;
    cadence: string;
    content_type: string;
    budget_allocation_percent: number;
  }>;
  measurement_and_kpis: {
    primary_kpis: string[];
    success_benchmarks: string[];
    measurement_tools: string[];
    testing_plan: string;
  };
  implementation_snapshot: Array<{
    phase: string;
    timeline: string;
    key_actions: string[];
    owners: string[];
  }>;
  compliance_and_risk: {
    regulatory_considerations: string[];
    brand_safety: string[];
    potential_risks: string[];
    mitigation_plan: string[];
  };
  execution_blueprint: Array<{
    step: string;
    description: string;
    owner_role: string;
    dependencies: string[];
  }>;
  meta: {
    input_tactic: string;
    confidence: number;
    notes: string;
  };
}

interface BriefMetadata {
  id: string;
  title: string;
  createdAt: string;
}

export default function TacticGenerationPage() {
  const params = useParams();
  const router = useRouter();
  const briefId = params.briefId as string;
  const tacticId = params.tacticId as string;

  const [generatedTactic, setGeneratedTactic] = useState<GeneratedTactic | null>(null);
  const [briefTitle, setBriefTitle] = useState<string>('');
  const [tacticName, setTacticName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Create URL-safe IDs for tactics (same function as in main page)
  const createTacticId = (tacticName: string) => {
    return tacticName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Tactic categories (same as main page)
  const TACTIC_CATEGORIES = [
    {
      name: 'Brand Awareness Tactics',
      emoji: '📢',
      tactics: [
        'Social media brand campaign (paid + organic)',
        'Influencer or creator partnership campaign',
        'PR launch / press release distribution',
        'Thought leadership article or op-ed placement',
        'Podcast interview / guest appearance',
        'Sponsorship activation (events, podcasts, communities)',
        'Out-of-home advertising (billboards, transit, street posters, wildposting)',
        'Brand stunt / experiential pop-up',
        'Community event sponsorship or presence',
        'Strategic co-branding partnership'
      ]
    },
    {
      name: 'Engagement & Community Tactics',
      emoji: '🧲',
      tactics: [
        'UGC (user-generated content) challenge or hashtag campaign',
        'Interactive polls / quizzes / contests on social or web',
        'Branded live events (virtual or physical)',
        'Webinars, workshops, or AMAs (Ask Me Anything)',
        'Social media series (e.g., weekly tips, behind-the-scenes content)',
        'Loyalty or referral program launch',
        'Community forum / Discord / Slack group activation',
        'Micro-ambassador or street team program',
        'Branded AR filters or interactive experiences',
        'Limited edition drops or collaborations'
      ]
    },
    {
      name: 'Acquisition & Conversion Tactics',
      emoji: '🎯',
      tactics: [
        'Paid search (Google Ads / SEM) campaigns',
        'Paid social conversion campaigns (Meta, TikTok, LinkedIn, etc.)',
        'Lead magnet campaign (e.g., downloadable guide, quiz, early access)',
        'Landing page funnel with targeted offer',
        'Email drip or nurture sequence',
        'Retargeting / remarketing ads',
        'SMS marketing campaign',
        'Affiliate marketing program',
        'Direct mail campaign (postcards, flyers, catalogs)',
        'In-store or on-site promotions'
      ]
    },
    {
      name: 'Retention & Loyalty Tactics',
      emoji: '💎',
      tactics: [
        'Loyalty program rollout (points, tiers, VIP perks)',
        'Re-engagement email series for inactive users',
        'Customer anniversary or milestone campaigns',
        'Post-purchase "surprise & delight" campaigns',
        'Exclusive member drops or early access',
        'Personalized recommendation engine or content',
        'Customer testimonial and review campaign',
        'Thank-you campaigns (handwritten notes, special gifts, etc.)',
        'Educational onboarding series (email, video, or app-based)',
        'Win-back offer campaign'
      ]
    },
    {
      name: 'Content & Owned Media Tactics',
      emoji: '📝',
      tactics: [
        'Blog / editorial content series',
        'SEO content campaign (pillar pages + supporting blogs)',
        'Hero video or manifesto film',
        'Branded documentary or mini-series',
        'Evergreen content hub (FAQs, tutorials, how-tos)',
        'Newsletter (weekly, monthly, or themed series)',
        'Landing page or microsite development',
        'Interactive web experiences (calculators, visualizations, configurators)',
        'Podcast production (owned brand podcast)',
        'Brand book / toolkit rollout (internal & partner use)'
      ]
    },
    {
      name: 'Measurement & Optimization Tactics',
      emoji: '📊',
      tactics: [
        'A/B or multivariate creative testing',
        'Incrementality testing campaign (geo splits, holdouts)',
        'Social listening & sentiment analysis',
        'Brand lift study or survey',
        'Funnel analysis and CRO (conversion rate optimization) sprints',
        'Channel mix modeling or MMM light experiments',
        'Real-time dashboards & reporting cadences',
        'Attribution setup and UTM hygiene campaign',
        'Competitive benchmarking campaign'
      ]
    },
    {
      name: 'Implementation & Compliance Tactics',
      emoji: '⚙️',
      tactics: [
        'Launch countdown campaign (email, social, paid)',
        'Campaign playbook creation for cross-team execution',
        'Content versioning & localization rollout',
        'Internal advocacy or employee ambassador campaign',
        'Legal & compliance review cycle integration',
        'QA sprint (ad placements, landing pages, tracking pixels)',
        'Asset tagging and DAM (Digital Asset Management) setup'
      ]
    }
  ];

  // Create tactic mapping dynamically
  const tacticOptions = TACTIC_CATEGORIES.reduce((acc, category) => {
    category.tactics.forEach(tactic => {
      acc[createTacticId(tactic)] = tactic;
    });
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    const generateTactic = async () => {
      try {
        setIsLoading(true);
        setError('');

        const chosenTactic = tacticOptions[tacticId as keyof typeof tacticOptions];
        if (!chosenTactic) {
          setError('Invalid tactic selected');
          return;
        }

        setTacticName(chosenTactic);

        const response = await fetch('/api/generate-tactic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            briefId,
            chosenTactic,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate tactic');
        }

        const data = await response.json();
        setGeneratedTactic(data.tactic);
        setBriefTitle(data.briefTitle);
      } catch (error) {
        console.error('Error generating tactic:', error);
        setError('Failed to generate tactic. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (briefId && tacticId) {
      generateTactic();
    }
  }, [briefId, tacticId]);

  const handleBack = () => {
    router.push('/tactics');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">Generating Your Tactic</h2>
          <p className="text-neutral-400">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tactics
            </Button>
          </div>
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-300">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedTactic) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tactics
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-white">No Tactic Generated</h2>
            <p className="text-neutral-400">Something went wrong. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Detached Header */}
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tactics
            </Button>

            {/* Center: Title */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-white">
                {generatedTactic.tactic_overview.tactic_name}
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Strategic Marketing Tactic • {briefTitle}
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800 hover:text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Document Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <TacticDisplay tactic={generatedTactic} briefTitle={briefTitle} />
      </main>
    </div>
  );
}

// Tactic Display Component
function TacticDisplay({ tactic, briefTitle }: { tactic: GeneratedTactic; briefTitle: string }) {
  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
      {/* Document Header */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 border-b border-neutral-700 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-400 uppercase tracking-wide">
                Strategic Marketing Tactic
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{tactic.tactic_overview.tactic_name}</h2>
            <div className="flex items-center gap-4 text-neutral-300">
              <span className="text-lg">{tactic.tactic_overview.tactic_type}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-lg">{tactic.tactic_overview.strategic_role}</span>
            </div>
          </div>
          <div className="text-right text-sm text-neutral-400">
            <div>Confidence Score</div>
            <div className="text-2xl font-bold text-green-500">
              {Math.round(tactic.meta.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-12">
        {/* Strategic Overview */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-neutral-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Strategic Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-white mb-2 text-lg">Challenge</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.tactic_overview.brief_linkage.challenge}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-white mb-2 text-lg">Opportunity</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.tactic_overview.brief_linkage.opportunity}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-white mb-2 text-lg">Target Audience</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.tactic_overview.brief_linkage.target_audience_summary}</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="font-semibold text-white mb-2 text-lg">Brand Positioning</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.tactic_overview.brief_linkage.brand_positioning_summary}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Executable Idea */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">The Executable Idea</h3>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-8 border border-green-500/30">
            <div className="mb-8">
              <h4 className="font-semibold text-white mb-4 text-lg">Core Concept</h4>
              <p className="text-neutral-200 text-xl leading-relaxed font-medium">{tactic.executable_idea.core_concept}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Execution Premise</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.executable_idea.execution_premise}</p>
              </div>
              <div className="bg-neutral-800/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Key Mechanism</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.executable_idea.key_mechanism}</p>
              </div>
              <div className="bg-neutral-800/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Unique Angle</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.executable_idea.unique_angle}</p>
              </div>
              <div className="bg-neutral-800/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="font-semibold text-white mb-3">Implementation Hook</h4>
                <p className="text-neutral-300 leading-relaxed">{tactic.executable_idea.implementation_hook}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Creative Direction */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Creative Direction</h3>
          </div>
          
          <div className="bg-slate-700/50 rounded-xl p-8 border border-slate-600">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Big Idea</h4>
                  <p className="text-slate-300 leading-relaxed">{tactic.concept_and_creative_direction.big_idea_or_theme}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Experience Concept</h4>
                  <p className="text-slate-300 leading-relaxed">{tactic.concept_and_creative_direction.experience_or_execution_concept}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Emotional Hook</h4>
                  <p className="text-slate-300 leading-relaxed">{tactic.concept_and_creative_direction.emotional_hook}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Key Creative Assets</h4>
                  <div className="flex flex-wrap gap-2">
                    {tactic.concept_and_creative_direction.key_creative_assets.map((asset, index) => (
                      <span key={index} className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Channel Strategy */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Channel Strategy</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
              <h4 className="font-semibold text-white mb-4 text-lg">Primary Channels</h4>
              <div className="flex flex-wrap gap-2">
                {tactic.channel_and_audience_integration.primary_channels.map((channel, index) => (
                  <span key={index} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-700/30">
              <h4 className="font-semibold text-white mb-4 text-lg">Supporting Channels</h4>
              <div className="flex flex-wrap gap-2">
                {tactic.channel_and_audience_integration.supporting_channels.map((channel, index) => (
                  <span key={index} className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activation Components */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Activation Components</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tactic.activation_components.map((component, index) => (
              <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:bg-neutral-800/80 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                    {component.role}
                  </span>
                  <h4 className="font-semibold text-white text-lg">{component.component}</h4>
                </div>
                <p className="text-neutral-300 leading-relaxed mb-3">{component.description}</p>
                <div className="text-sm text-neutral-400 bg-neutral-900 px-3 py-2 rounded-lg">
                  <span className="font-medium">Format:</span> {component.asset_format}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Channel Plan */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Channel Plan & Budget</h3>
          </div>
          
          <div className="space-y-4">
            {tactic.channel_plan.map((channel, index) => (
              <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:bg-neutral-800/80 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-lg">{channel.channel}</h4>
                  <div className="bg-green-900/50 text-green-300 px-4 py-2 rounded-full font-semibold">
                    {channel.budget_allocation_percent}% Budget
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-neutral-900 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Objective</h5>
                    <p className="text-neutral-300 text-sm">{channel.objective}</p>
                  </div>
                  <div className="bg-neutral-900 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Cadence</h5>
                    <p className="text-neutral-300 text-sm">{channel.cadence}</p>
                  </div>
                  <div className="bg-neutral-900 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Content Type</h5>
                    <p className="text-neutral-300 text-sm">{channel.content_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Measurement & KPIs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-900/50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Measurement & KPIs</h3>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-8 border border-neutral-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Primary KPIs</h4>
                  <div className="flex flex-wrap gap-2">
                    {tactic.measurement_and_kpis.primary_kpis.map((kpi, index) => (
                      <span key={index} className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Success Benchmarks</h4>
                  <div className="flex flex-wrap gap-2">
                    {tactic.measurement_and_kpis.success_benchmarks.map((benchmark, index) => (
                      <span key={index} className="bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                        {benchmark}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Measurement Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {tactic.measurement_and_kpis.measurement_tools.map((tool, index) => (
                      <span key={index} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Testing Plan</h4>
                  <p className="text-neutral-300 leading-relaxed">{tactic.measurement_and_kpis.testing_plan}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-900/50 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Implementation Timeline</h3>
          </div>
          
          <div className="space-y-6">
            {tactic.implementation_snapshot.map((phase, index) => (
              <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:bg-neutral-800/80 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    phase.phase === 'Pre-Launch' ? 'bg-blue-500' :
                    phase.phase === 'Launch' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{phase.phase}</h4>
                    <p className="text-neutral-400 text-sm">{phase.timeline}</p>
                  </div>
                </div>
                <div className="ml-14 space-y-4">
                  <div>
                    <h5 className="font-medium text-white mb-2">Key Actions</h5>
                    <ul className="space-y-2">
                      {phase.key_actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-neutral-300">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-white mb-2">Owners</h5>
                    <div className="flex flex-wrap gap-2">
                      {phase.owners.map((owner, ownerIndex) => (
                        <span key={ownerIndex} className="bg-neutral-900 text-neutral-300 px-3 py-1 rounded-full text-sm">
                          {owner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Execution Blueprint */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-teal-900/50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Execution Blueprint</h3>
          </div>
          
          <div className="space-y-6">
            {tactic.execution_blueprint.map((step, index) => (
              <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:shadow-lg hover:bg-neutral-800/80 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-white text-lg">{step.step}</h4>
                </div>
                <div className="ml-14 space-y-4">
                  <p className="text-neutral-300 leading-relaxed">{step.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-900 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Owner Role</h5>
                      <p className="text-neutral-300 text-sm">{step.owner_role}</p>
                    </div>
                    <div className="bg-neutral-900 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Dependencies</h5>
                      <p className="text-neutral-300 text-sm">{step.dependencies.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Risk & Compliance */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Risk & Compliance</h3>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-8 border border-neutral-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Regulatory Considerations</h4>
                  <ul className="space-y-2">
                    {tactic.compliance_and_risk.regulatory_considerations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-300">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Brand Safety</h4>
                  <ul className="space-y-2">
                    {tactic.compliance_and_risk.brand_safety.map((safety, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-300">{safety}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Potential Risks</h4>
                  <ul className="space-y-2">
                    {tactic.compliance_and_risk.potential_risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-300">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 text-lg">Mitigation Plan</h4>
                  <ul className="space-y-2">
                    {tactic.compliance_and_risk.mitigation_plan.map((mitigation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-neutral-300">{mitigation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-neutral-400">Generated from: </span>
                <span className="text-neutral-200 font-medium">{tactic.meta.input_tactic}</span>
              </div>
              {tactic.meta.notes && (
                <div>
                  <span className="text-neutral-400">Notes: </span>
                  <span className="text-neutral-200">{tactic.meta.notes}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-neutral-400">Confidence Score</div>
              <div className="text-2xl font-bold text-green-500">
                {Math.round(tactic.meta.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
