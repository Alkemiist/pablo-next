'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, CheckCircle, Clock, Target, Users, DollarSign, BarChart3, Calendar, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';

// Types
interface BriefMetadata {
  id: string;
  title: string;
  createdAt: string;
}

interface TacticOption {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

// Tactic options organized by category
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

export default function TacticsPage() {
  const router = useRouter();
  // State management
  const [availableBriefs, setAvailableBriefs] = useState<BriefMetadata[]>([]);
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true);
  const [selectedBriefId, setSelectedBriefId] = useState<string>('');
  const [selectedTactic, setSelectedTactic] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Load available briefs on component mount
  useEffect(() => {
    const loadBriefs = async () => {
      try {
        setIsLoadingBriefs(true);
        const response = await fetch('/api/briefs');
        if (response.ok) {
          const data = await response.json();
          setAvailableBriefs(data.briefs || []);
        } else {
          console.error('Failed to load briefs');
          setAvailableBriefs([]);
        }
      } catch (err) {
        console.error('Error loading briefs:', err);
        setAvailableBriefs([]);
      } finally {
        setIsLoadingBriefs(false);
      }
    };

    loadBriefs();
  }, []);

  // Handle tactic generation
  const handleGenerateTactic = async () => {
    if (!selectedBriefId || !selectedTactic) {
      setError('Please select both a brief and a tactic');
      return;
    }

    console.log('Generating tactic:', { selectedBriefId, selectedTactic });
    
    // Navigate to the generation page
    router.push(`/tactics/generate/${selectedBriefId}/${selectedTactic}`);
  };

  // Create URL-safe IDs for tactics
  const createTacticId = (tacticName: string) => {
    return tacticName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Flatten all tactics for the grid
  const allTactics = TACTIC_CATEGORIES.flatMap(category =>
    category.tactics.map(tactic => ({
      id: createTacticId(tactic),
      name: tactic,
      category: category.name,
      emoji: category.emoji
    }))
  );

  // Check if brief is selected
  const isBriefSelected = !!selectedBriefId;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-neutral-950 border-b border-neutral-800 backdrop-blur-sm">
        <div className="w-full px-3 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side: Brief Selection */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Tactic Generator</h1>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-400">Brief:</label>
                <Select
                  value={selectedBriefId}
                  onValueChange={setSelectedBriefId}
                  disabled={isLoadingBriefs}
                >
                  <SelectTrigger className="w-80 bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200">
                    <SelectValue placeholder={isLoadingBriefs ? "Loading briefs..." : "Choose a brief..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    {Array.isArray(availableBriefs) && availableBriefs.map((brief) => (
                      <SelectItem 
                        key={brief.id} 
                        value={brief.id} 
                        className="cursor-pointer hover:bg-neutral-800"
                      >
                        <span className="font-medium">{brief.title}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Side: Generate Button */}
            <Button
              onClick={handleGenerateTactic}
              disabled={!isBriefSelected || !selectedTactic}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                isBriefSelected && selectedTactic 
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25 hover:shadow-green-500/40' 
                  : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
            >
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Tactic
              </>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-3 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Tactic Cards Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Choose Your Tactic</h2>
            <p className="text-neutral-400">
              {isBriefSelected 
                ? "Select a tactic below to generate your strategic plan" 
                : "Select a brief first to unlock tactic options"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {allTactics.map((tactic) => (
              <TacticCard
                key={tactic.id}
                tactic={tactic}
                isSelected={selectedTactic === tactic.id}
                isDisabled={!isBriefSelected}
                onSelect={() => setSelectedTactic(tactic.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tactic Card Component
function TacticCard({ 
  tactic, 
  isSelected, 
  isDisabled, 
  onSelect 
}: { 
  tactic: TacticOption; 
  isSelected: boolean; 
  isDisabled: boolean; 
  onSelect: () => void; 
}) {
  return (
    <div
      onClick={isDisabled ? undefined : onSelect}
      className={`relative h-56 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isDisabled 
          ? 'opacity-50 cursor-not-allowed bg-neutral-800' 
          : isSelected
            ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/25 bg-gradient-to-br from-neutral-800 to-neutral-900'
            : 'hover:ring-2 hover:ring-green-400 hover:shadow-lg hover:shadow-green-400/25 bg-gradient-to-br from-neutral-800 to-neutral-900'
      }`}
    >
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold leading-tight line-clamp-4 text-white pr-2">
            {tactic.name}
          </h3>
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-sm text-neutral-400 mt-auto">
          {tactic.category}
        </p>
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500 rounded-2xl" />
      )}
    </div>
  );
}