'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit3, 
  RefreshCw, 
  Download, 
  Share2, 
  Star, 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  BarChart3, 
  FileText, 
  CheckCircle,
  Clock,
  Zap,
  Award,
  Globe,
  Heart,
  MessageSquare,
  ThumbsUp,
  Eye,
  Bookmark
} from 'lucide-react';
import { GeneratedPitchDoc } from '@/lib/pitch-doc-types';
import { getPitchDoc } from '@/lib/pitch-doc-storage';

export default function PitchDocDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const pitchDocId = params.id as string;

  const [pitchDoc, setPitchDoc] = useState<GeneratedPitchDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Try to load the pitch doc from storage first
    const loadPitchDoc = () => {
      const storedPitchDoc = getPitchDoc(pitchDocId);
      if (storedPitchDoc) {
        setPitchDoc(storedPitchDoc);
        setIsLoading(false);
        return;
      }
      
      // If not found in storage, generate a sample pitch doc
      // In a real implementation, you'd fetch this from your API
      const generateSamplePitchDoc = () => {
      const samplePitchDoc: GeneratedPitchDoc = {
        idea_overview: {
          idea_name: "Professional Audio Revolution",
          tagline: "Where Innovation Meets Excellence",
          concept_summary: "A comprehensive strategy to position premium wireless headphones as the essential tool for modern professionals who demand both quality and style.",
          opus_behavior_overlap_score: 8.7,
          funnel_position: "Mid",
          category_fit: ["Technology", "Professional Audio", "Lifestyle"],
          brand_target_consumer: "Modern Explorer",
          generated_visual_description: "Clean, minimalist hero image featuring a professional in a modern office environment, wearing premium headphones while working on a sleek laptop. Soft natural lighting, muted color palette with green accents, conveying sophistication and innovation.",
          generated_image_url: "https://via.placeholder.com/1024x1024/1a1a1a/ffffff?text=Generated+Visual"
        },
        audience_intelligence: {
          primary_audience_personas: [
            {
              archetype: "Modern Explorer",
              motivations: ["Professional Growth", "Quality", "Innovation", "Efficiency"],
              channels: ["LinkedIn", "Professional Podcasts", "Tech Publications", "Industry Events"],
              psychographic_cluster: "Achievement-oriented professionals seeking premium solutions",
              overlap_score: 8.7,
              detailed_description: "Tech-savvy professionals aged 28-45 who value innovation, efficiency, and quality in both their personal and professional lives. They are early adopters of new technology and willing to invest in premium solutions that enhance their productivity and status.",
              pain_points: ["Time constraints", "Information overload", "Need for reliable solutions", "Work-life balance challenges"],
              goals: ["Professional advancement", "Work-life balance", "Quality outcomes", "Efficiency optimization"],
              media_consumption: ["Professional publications", "LinkedIn", "Industry podcasts", "Tech blogs", "YouTube tutorials"],
              lifestyle_insights: ["Busy schedules", "Tech-savvy", "Quality-focused", "Network-oriented", "Continuous learners"]
            }
          ],
          behavioral_overlap_visualization: "Strong correlation between professional networking behavior and premium product preferences, with high overlap in tech-savvy professional communities",
          brand_target_comparison: "Excellent alignment: 87% overlap between brand-defined Modern Explorer archetype and AI-predicted high-response audience segments",
          data_provenance: {
            sources: ["Professional Network Analysis", "Premium Product Behavior Data", "Tech Adoption Patterns"],
            model_confidence: 0.89,
            audience_size: "3.2M+ professionals globally"
          }
        },
        funnel_position_layer: {
          funnel_stage: "Mid",
          stage_definition: "Consideration and evaluation phase where professionals research, compare, and seek social proof before making premium purchases",
          behavior_triggers: ["Product Reviews", "Expert Recommendations", "Peer Testimonials", "Feature Comparisons"],
          recommended_channel_mix: [
            { channel: "Professional Content", weight: 35, rationale: "Educational content builds trust and authority" },
            { channel: "LinkedIn Advertising", weight: 30, rationale: "Direct access to professional decision-makers" },
            { channel: "Tech Influencer Partnerships", weight: 20, rationale: "Social proof from trusted industry voices" },
            { channel: "Industry Publications", weight: 15, rationale: "Credibility through respected media channels" }
          ],
          funnel_to_category_fit: "Mid-funnel focus aligns perfectly with professional audio category dynamics, where consideration periods are longer due to higher price points and professional use cases"
        },
        cultural_signal_layer: {
          top_cultural_signals: [
            { signal: "Remote Work Revolution", score: 9.2, trajectory: "Rising" },
            { signal: "Premium Professional Tools", score: 8.8, trajectory: "Rising" },
            { signal: "Audio Quality Consciousness", score: 8.5, trajectory: "Stable" },
            { signal: "Work-Life Integration", score: 8.1, trajectory: "Rising" }
          ],
          proof_points: ["73% increase in remote work equipment searches", "45% growth in premium audio market", "2.3M mentions of 'professional audio' in Q4"],
          trend_to_funnel_connection: "Remote work culture drives mid-funnel consideration as professionals invest in home office equipment and seek premium solutions for productivity",
          narrative_insight: "The cultural shift toward remote work has fundamentally changed how professionals approach their workspace. Audio quality is no longer a luxury but a necessity for professional success, creating unprecedented demand for premium solutions that deliver both performance and style.",
          supporting_news: [
            {
              title: "How Remote Work is Reshaping Consumer Behavior in 2024",
              url: "https://www.forbes.com/sites/example/article",
              source: "Forbes",
              publishedDate: "2024-01-15",
              summary: "Recent analysis shows that remote work has fundamentally changed how consumers interact with brands, creating new opportunities for innovative marketing strategies.",
              relevanceScore: 9.2,
              category: "Consumer Behavior"
            },
            {
              title: "The Rise of Premium Professional Tools: Industry Experts Weigh In",
              url: "https://hbr.org/example-article",
              source: "Harvard Business Review",
              publishedDate: "2024-01-10",
              summary: "Leading industry experts discuss the implications of premium professional tools for business strategy and marketing approaches in the digital age.",
              relevanceScore: 8.8,
              category: "Industry Analysis"
            },
            {
              title: "Audio Quality Consciousness Trends: What Marketers Need to Know",
              url: "https://www.marketingland.com/example",
              source: "Marketing Land",
              publishedDate: "2024-01-08",
              summary: "Comprehensive analysis of audio quality trends and their impact on marketing strategies, with actionable insights for brands.",
              relevanceScore: 8.5,
              category: "Marketing Strategy"
            },
            {
              title: "Why Work-Life Integration is the Future of Brand Engagement",
              url: "https://www.fastcompany.com/example",
              source: "Fast Company",
              publishedDate: "2024-01-05",
              summary: "Case studies and examples showing how brands are successfully leveraging work-life integration to drive engagement and growth.",
              relevanceScore: 8.7,
              category: "Brand Strategy"
            },
            {
              title: "Market Research: Professional Audio Adoption Rates Soar",
              url: "https://www.businessinsider.com/example",
              source: "Business Insider",
              publishedDate: "2024-01-03",
              summary: "New market research reveals significant growth in professional audio adoption, with implications for marketing and business strategy.",
              relevanceScore: 8.3,
              category: "Market Research"
            },
            {
              title: "Tech Giants Embrace Professional Audio for Competitive Advantage",
              url: "https://techcrunch.com/example",
              source: "TechCrunch",
              publishedDate: "2024-01-01",
              summary: "Major technology companies are investing heavily in professional audio strategies, signaling a shift in industry priorities.",
              relevanceScore: 8.9,
              category: "Technology"
            },
            {
              title: "Consumer Survey: Professional Audio Preferences Drive Purchase Decisions",
              url: "https://www.inc.com/example",
              source: "Inc.",
              publishedDate: "2023-12-28",
              summary: "Recent consumer surveys show that professional audio preferences are increasingly influencing purchasing decisions across demographics.",
              relevanceScore: 8.1,
              category: "Consumer Research"
            },
            {
              title: "The Economic Impact of Remote Work on Global Markets",
              url: "https://www.wsj.com/example",
              source: "Wall Street Journal",
              publishedDate: "2023-12-25",
              summary: "Economic analysis reveals the significant impact of remote work on global markets and business performance metrics.",
              relevanceScore: 8.6,
              category: "Economics"
            }
          ]
        },
        creative_expression_panel: {
          generated_storyboards: [
            "Opening shot: Professional in sleek home office, putting on headphones with confident gesture",
            "Mid-sequence: Close-up of product features, highlighting noise cancellation and premium materials",
            "Closing: Professional smiling while taking call, with cityscape visible through window"
          ],
          suggested_copy_concepts: [
            "Partner with tech influencers to showcase headphones in real work environments",
            "Create authentic behind-the-scenes content with industry professionals",
            "Develop micro-influencer testimonials highlighting productivity benefits",
            "Launch LinkedIn campaign featuring professional success stories"
          ],
          medium_mapping: [
            { medium: "Professional Video", funnel_intent: "Awareness", emotional_arc: "Aspiration", tone: "Premium" },
            { medium: "LinkedIn Content", funnel_intent: "Consideration", emotional_arc: "Connection", tone: "Professional" },
            { medium: "Tech Reviews", funnel_intent: "Conversion", emotional_arc: "Trust", tone: "Authoritative" }
          ],
          emotional_arc: "From professional aspiration to confident achievement",
          stage_fit_tags: ["Awareness", "Consideration", "Conversion"]
        },
        behavior_driven_strategy: {
          behavioral_flow: "Professional Discovery → Research Phase → Peer Validation → Feature Comparison → Purchase Decision → Professional Advocacy",
          motivational_triggers: [
            { stage: "Awareness", triggers: ["Professional recommendations", "Industry trend awareness"] },
            { stage: "Consideration", triggers: ["Product demos", "Expert reviews", "Feature comparisons"] },
            { stage: "Conversion", triggers: ["Limited-time offers", "Professional discounts", "Risk-free trials"] }
          ],
          recommended_channel_weighting: [
            { channel: "Professional Networks", weight: 40, reasoning: "Direct access to target audience" },
            { channel: "Content Marketing", weight: 25, reasoning: "Educational and trust-building" },
            { channel: "Influencer Partnerships", weight: 20, reasoning: "Social proof and credibility" },
            { channel: "Paid Search", weight: 15, reasoning: "High-intent capture" }
          ],
          seasonal_timing: "Q4 peak with year-round engagement, strongest during back-to-work periods and professional conference seasons",
          context_layer: "Professional and lifestyle contexts, emphasizing productivity and career advancement"
        },
        tactic_execution: {
          selected_tactic: "Influencer or creator partnership campaign",
          tactic_description: "A comprehensive influencer partnership campaign targeting tech professionals on LinkedIn and Twitter, featuring authentic product demonstrations and behind-the-scenes content creation",
          execution_strategy: "Partner with 10-15 micro-influencers in the tech and professional audio space to create authentic content showcasing the headphones in real work environments",
          key_components: ["Influencer Selection", "Content Creation", "Platform Distribution", "Performance Tracking"],
          success_metrics: ["Engagement Rate", "Brand Mentions", "Click-through Rate", "Conversion Rate"],
          timeline: "3-month campaign with weekly content releases and monthly performance reviews"
        },
        performance_forecast: {
          predicted_lift: {
            reach: "+32% increase in professional audience reach",
            engagement: "+48% improvement in engagement rates",
            conversion: "+22% boost in conversion rates"
          },
          funnel_specific_forecast: [
            { stage: "Top", delta: "+35% awareness lift", confidence: 0.85 },
            { stage: "Mid", delta: "+28% consideration increase", confidence: 0.82 },
            { stage: "Bottom", delta: "+22% conversion improvement", confidence: 0.78 }
          ],
          sentiment_prediction: "Highly positive sentiment with strong association to professional success and innovation",
          earned_media_alpha_projection: "3.2x organic reach amplification through professional advocacy and word-of-mouth",
          confidence_range: { min: 0.75, max: 0.92 }
        },
        knowledge_provenance: {
          data_source_cards: [
            { source: "Professional Network Database", type: "Audience", confidence: 0.92, last_updated: "2024-01-15" },
            { source: "Tech Category Intelligence", type: "Category", confidence: 0.88, last_updated: "2024-01-12" },
            { source: "Cultural Signal Analysis", type: "Cultural", confidence: 0.85, last_updated: "2024-01-14" },
            { source: "Creative Performance Data", type: "Creative", confidence: 0.90, last_updated: "2024-01-10" }
          ],
          tribal_knowledge_references: ["Industry expert interviews", "Professional audio market research", "Remote work trend analysis"],
          timestamp: new Date().toISOString(),
          model_id: "pitch-doc-v1.0"
        },
        meta: {
          input_summary: "Pitch doc for premium wireless headphones targeting Modern Explorer professionals in Technology category",
          confidence: 0.87,
          notes: "Generated based on comprehensive professional audio market analysis and remote work trend integration",
          generation_time: new Date().toISOString()
        }
      };
      
        setPitchDoc(samplePitchDoc);
        setIsLoading(false);
      };

      generateSamplePitchDoc();
    };

    loadPitchDoc();
  }, [pitchDocId]);

  const handleBack = () => {
    router.push('/pitch-brief');
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2 text-white">Loading Pitch Doc</h2>
          <p className="text-neutral-400">Preparing your strategic document...</p>
        </div>
      </div>
    );
  }

  if (error || !pitchDoc) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-6">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-neutral-300 hover:text-white hover:bg-neutral-800/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pitch Brief
              </Button>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-300">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error || 'Failed to load pitch document'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-neutral-950 border-b border-neutral-800/50 flex-shrink-0 backdrop-blur-sm">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pitch Brief
            </Button>

            {/* Center: Title */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-white">
                {pitchDoc.idea_overview.idea_name}
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Strategic Pitch Document • {pitchDoc.idea_overview.tagline}
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800/50 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800/50 hover:text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-green-600/50 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800/50 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-neutral-300 border-neutral-600 hover:bg-neutral-800/50 hover:text-white"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - E-commerce PDP Style */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Visual/Overview */}
          <div className="space-y-6">
            {/* Hero Visual */}
            <div className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700/50 overflow-hidden">
              {pitchDoc.idea_overview.generated_image_url ? (
                <img 
                  src={pitchDoc.idea_overview.generated_image_url} 
                  alt={pitchDoc.idea_overview.idea_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-neutral-400 text-sm">Generated Visual</p>
                    <p className="text-neutral-500 text-xs mt-1">{pitchDoc.idea_overview.generated_visual_description}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title and Tagline */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {pitchDoc.idea_overview.idea_name}
              </h1>
              <p className="text-xl text-green-400 font-medium mb-4">
                {pitchDoc.idea_overview.tagline}
              </p>
              <p className="text-neutral-300 text-lg leading-relaxed">
                {pitchDoc.idea_overview.concept_summary}
              </p>
            </div>

            {/* Tactic Execution */}
            <div className="bg-gradient-to-r from-green-900/10 to-blue-900/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">Executable Tactic</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-1">Selected Tactic</h4>
                  <p className="text-white font-medium">{pitchDoc.tactic_execution?.selected_tactic || 'Tactic not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-1">Execution Strategy</h4>
                  <p className="text-neutral-300 text-sm">{pitchDoc.tactic_execution?.tactic_description || 'Detailed execution plan will be provided'}</p>
                </div>
                {pitchDoc.tactic_execution?.key_components && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Key Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {pitchDoc.tactic_execution.key_components.map((component, index) => (
                        <span key={index} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Key Strategic Elements</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-300">Funnel Position: {pitchDoc.idea_overview.funnel_position}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-300">Target: {pitchDoc.idea_overview.brand_target_consumer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-neutral-300">Categories: {pitchDoc.idea_overview.category_fit.join(', ')}</span>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-16">
          {/* Audience Intelligence */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600/50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Audience Intelligence</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-neutral-900/50 border-neutral-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Primary Audience Persona</h3>
                {pitchDoc.audience_intelligence.primary_audience_personas.map((persona, index) => (
                  <div key={index} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-white">{persona.archetype}</h4>
                      {/* <div className="bg-green-600/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {persona.overlap_score}/10
                      </div> */}
                    </div>
                    
                    {/* Detailed Description */}
                    {persona.detailed_description && (
                      <div>
                        {/* <h5 className="text-sm font-medium text-neutral-300 mb-2">Persona Description</h5> */}
                        <p className="text-neutral-300 text-sm leading-relaxed">{persona.detailed_description}</p>
                      </div>
                    )}

                    {/* Motivations */}
                    <div>
                      <h5 className="text-sm font-medium text-neutral-300 mb-2">Motivations</h5>
                      <div className="flex flex-wrap gap-2">
                        {persona.motivations.map((motivation, i) => (
                          <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                            {motivation}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pain Points */}
                    {persona.pain_points && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-300 mb-2">Pain Points</h5>
                        <div className="flex flex-wrap gap-2">
                          {persona.pain_points.map((pain, i) => (
                            <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                              {pain}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Goals */}
                    {persona.goals && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-300 mb-2">Goals</h5>
                        <div className="flex flex-wrap gap-2">
                          {persona.goals.map((goal, i) => (
                            <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Media Consumption */}
                    {persona.media_consumption && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-300 mb-2">Media Consumption</h5>
                        <div className="flex flex-wrap gap-2">
                          {persona.media_consumption.map((media, i) => (
                            <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                              {media}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lifestyle Insights */}
                    {persona.lifestyle_insights && (
                      <div>
                        <h5 className="text-sm font-medium text-neutral-300 mb-2">Lifestyle Insights</h5>
                        <div className="flex flex-wrap gap-2">
                          {persona.lifestyle_insights.map((insight, i) => (
                            <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                              {insight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channels */}
                    <div>
                      <h5 className="text-sm font-medium text-neutral-300 mb-2">Preferred Channels</h5>
                      <div className="flex flex-wrap gap-2">
                        {persona.channels.map((channel, i) => (
                          <span key={i} className="bg-neutral-800/50 text-neutral-300 px-2 py-1 rounded text-xs">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Behavioral Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Overlap Visualization</h4>
                    <p className="text-neutral-400 text-sm">{pitchDoc.audience_intelligence.behavioral_overlap_visualization}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Brand Target Comparison</h4>
                    <p className="text-neutral-400 text-sm">{pitchDoc.audience_intelligence.brand_target_comparison}</p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Data Provenance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Model Confidence</span>
                        <span className="text-green-400 font-semibold">
                          {Math.round(pitchDoc.audience_intelligence.data_provenance.model_confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Audience Size</span>
                        <span className="text-blue-400 font-semibold">
                          {pitchDoc.audience_intelligence.data_provenance.audience_size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Cultural Signals */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600/50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Cultural Signal Layer</h2>
            </div>
            
            {/* TODO: Re-enable when we have real cultural signal data */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {pitchDoc.cultural_signal_layer.top_cultural_signals.slice(0, 3).map((signal, index) => (
                <Card key={index} className="bg-neutral-900/50 border-neutral-800/50 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{signal.signal}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      signal.trajectory === 'Rising' ? 'bg-neutral-800/50 text-neutral-300' :
                      signal.trajectory === 'Stable' ? 'bg-neutral-800/50 text-neutral-300' :
                      'bg-neutral-800/50 text-neutral-300'
                    }`}>
                      {signal.trajectory}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-500 mb-2">
                    {signal.score}/10
                  </div>
                  
                  <div className="w-full bg-neutral-800/50 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(signal.score / 10) * 100}%` }}
                    />
                  </div>
                  
                  {signal.keyInsights && signal.keyInsights.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-neutral-400 mb-1">Key Insights</div>
                      <div className="text-xs text-neutral-300">
                        {signal.keyInsights[0]}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div> */}

            <Card className="bg-neutral-900/50 border-neutral-800/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Narrative Insight</h3>
              <p className="text-neutral-300 leading-relaxed mb-4">
                {pitchDoc.cultural_signal_layer.narrative_insight}
              </p>
              <div>
                <h4 className="text-sm font-medium text-neutral-300 mb-2">Proof Points</h4>
                <div className="flex flex-wrap gap-2">
                  {pitchDoc.cultural_signal_layer.proof_points.map((point, index) => (
                    <span key={index} className="bg-neutral-800/50 text-neutral-300 px-3 py-1 rounded-full text-sm">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Supporting News Articles */}
            {pitchDoc.cultural_signal_layer.supporting_news && pitchDoc.cultural_signal_layer.supporting_news.length > 0 && (
              <Card className="bg-neutral-900/50 border-neutral-800/50 p-6 mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Supporting News & Research</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Recent articles and research that validate the cultural trends and support the chosen tactic
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pitchDoc.cultural_signal_layer.supporting_news.slice(0, 8).map((article, index) => (
                    <div 
                      key={index} 
                      className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors cursor-pointer group"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-neutral-400 bg-neutral-700/50 px-2 py-1 rounded">
                          {article.source}
                        </span>
                        <div className="text-xs text-neutral-500">
                          {article.relevanceScore}/10
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      
                      <p className="text-xs text-neutral-300 mb-3 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>{article.publishedDate}</span>
                        <span className="text-green-400 group-hover:text-green-300">
                          Read More →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-neutral-500">
                    Showing {Math.min(8, pitchDoc.cultural_signal_layer.supporting_news.length)} of {pitchDoc.cultural_signal_layer.supporting_news.length} articles
                  </p>
                </div>
              </Card>
            )}
          </section>

          {/* Creative Expression */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-600/50 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Creative Expression Panel</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-neutral-900/50 border-neutral-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Generated Storyboards</h3>
                <div className="space-y-3">
                  {pitchDoc.creative_expression_panel.generated_storyboards.map((storyboard, index) => (
                    <div key={index} className="bg-neutral-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-green-600/50 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-neutral-300">Scene {index + 1}</span>
                      </div>
                      <p className="text-neutral-400 text-sm">{storyboard}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800/50 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Taglines</h3>
                <div className="space-y-3">
                  {pitchDoc.creative_expression_panel.suggested_copy_concepts.map((concept, index) => (
                    <div key={index} className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                      <p className="text-white font-medium">{concept}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

        </div>
        </div>
      </main>
    </div>
  );
}
