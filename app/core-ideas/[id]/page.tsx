'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, X, ExternalLink } from "lucide-react"
import { SavedCoreIdea } from '@/lib/types/core-idea'

export default function CoreIdeaDetailPage() {
    const router = useRouter()
    const params = useParams()
    const ideaId = params?.id as string

    const [idea, setIdea] = useState<SavedCoreIdea | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadIdea = async () => {
            if (!ideaId) return;

            try {
                setIsLoading(true)
                const response = await fetch(`/api/core-ideas/${ideaId}`)
                
                if (!response.ok) {
                    throw new Error('Failed to load core idea')
                }
                
                const data = await response.json()
                if (data.success && data.idea) {
                    setIdea(data.idea)
                }
            } catch (err) {
                console.error('Error loading core idea:', err)
                setError('Failed to load core idea')
            } finally {
                setIsLoading(false)
            }
        }

        loadIdea()
    }, [ideaId])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
            </div>
        )
    }

    if (error || !idea) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Core idea not found'}</p>
                    <Button onClick={() => router.push('/core-ideas')} className="bg-purple-800 hover:bg-purple-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Core Ideas
                    </Button>
                </div>
            </div>
        )
    }

    const { data: ideaData, metadata } = idea

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/core-ideas')}
                            className="w-12 h-12 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-neutral-300" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold">{metadata.title}</h1>
                            <div className="flex gap-2 mt-2">
                                <span className="text-sm px-2 py-1 bg-purple-900/30 text-purple-300 rounded border border-purple-700/50">
                                    {metadata.brand}
                                </span>
                                <span className="text-sm px-2 py-1 bg-green-900/30 text-green-300 rounded border border-green-700/50">
                                    {metadata.product}
                                </span>
                                <span className="text-sm px-2 py-1 bg-orange-900/30 text-orange-300 rounded border border-orange-700/50">
                                    {metadata.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/core-ideas')}
                        className="w-12 h-12 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5 text-neutral-300" />
                    </button>
                </div>

                {/* Description */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 mb-6">
                    <p className="text-lg text-neutral-300">{metadata.description}</p>
                </div>

                {/* Idea Details */}
                <div className="space-y-4">
                    {/* Core Concept */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Core Concept
                        </h2>
                        <p className="text-neutral-300">{ideaData.ideaDetails.coreConcept}</p>
                    </div>

                    {/* Why It Works */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-3">Why It Works</h2>
                        <p className="text-neutral-300">{ideaData.ideaDetails.whyItWorks}</p>
                    </div>

                    {/* Emotional Hook */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-3">Emotional Hook</h2>
                        <p className="text-neutral-300">{ideaData.ideaDetails.emotionalHook}</p>
                    </div>

                    {/* Trend Connection */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-3">Trend Connection</h2>
                        <p className="text-neutral-300">{ideaData.ideaDetails.trendConnection}</p>
                    </div>

                    {/* Key Mechanism and Unique Angle */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-purple-300 mb-3">Key Mechanism</h2>
                            <p className="text-neutral-300">{ideaData.ideaDetails.keyMechanism}</p>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-purple-300 mb-3">Unique Angle</h2>
                            <p className="text-neutral-300">{ideaData.ideaDetails.uniqueAngle}</p>
                        </div>
                    </div>

                    {/* Execution Examples */}
                    {ideaData.ideaDetails.executionExamples.length > 0 && (
                        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-purple-300 mb-3">Execution Examples</h2>
                            <ul className="list-disc list-inside space-y-2 text-neutral-300">
                                {ideaData.ideaDetails.executionExamples.map((example, idx) => (
                                    <li key={idx}>{example}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Target Outcome */}
                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-purple-300 mb-3">Target Outcome</h2>
                        <p className="text-neutral-300">{ideaData.ideaDetails.targetOutcome}</p>
                    </div>
                </div>

                {/* Persona Fit Section */}
                {ideaData.personaFit && (
                    <div className="mt-8 space-y-6">
                        <div className="bg-gradient-to-br from-neutral-900/50 to-purple-950/20 border border-neutral-700/50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Persona Match Analysis
                            </h2>

                            {/* Match Score - Circular Graph */}
                            <div className="mb-8">
                                <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
                                    <div className="relative w-48 h-48 flex-shrink-0">
                                        {/* Circular Progress */}
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                            {/* Background circle */}
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                fill="none"
                                                stroke="rgb(38 38 38)"
                                                strokeWidth="10"
                                            />
                                            {/* Progress circle */}
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                fill="none"
                                                stroke="rgb(168 85 247)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 50}`}
                                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - (ideaData.personaFit.matchScore || 85) / 100)}`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        {/* Center content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-4xl font-bold text-white">
                                                {ideaData.personaFit.matchScore || 85}%
                                            </div>
                                            <div className="text-sm text-neutral-400 mt-1">Match Score</div>
                                        </div>
                                    </div>
                                    
                                    {/* Description and Reason */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-purple-300 mb-3">Persona Match Summary</h3>
                                            <p className="text-neutral-300 leading-relaxed">
                                                {ideaData.personaFit.whyThisPersona}
                                            </p>
                                        </div>
                                        <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                                            <p className="text-sm font-semibold text-purple-200 mb-2">Why This Persona Works for This Idea</p>
                                            <p className="text-sm text-purple-100 leading-relaxed">
                                                {ideaData.personaFit.overlapWithBaseIdea}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Persona Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6">
                                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Archetype</h4>
                                    <p className="text-lg font-bold text-white">{ideaData.personaFit.archetype}</p>
                                </div>
                                <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6">
                                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Psychographic Cluster</h4>
                                    <p className="text-lg font-bold text-white">{ideaData.personaFit.psychographicCluster}</p>
                                </div>
                            </div>

                            {/* Motivations and Behaviors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Key Motivations</h4>
                                    <div className="space-y-2">
                                        {ideaData.personaFit.motivations?.map((motivation, idx) => (
                                            <div key={idx} className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-3">
                                                <p className="text-sm text-neutral-300">{motivation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Key Behaviors</h4>
                                    <div className="space-y-2">
                                        {ideaData.personaFit.keyBehaviors?.map((behavior, idx) => (
                                            <div key={idx} className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-3">
                                                <p className="text-sm text-neutral-300">{behavior}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Data Provenance - Enhanced with Research Sources */}
                            {ideaData.personaFit.dataProvenance && (
                                <div className="bg-neutral-800/30 border border-cyan-700/50 rounded-xl p-6 mt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                            <h3 className="text-lg font-semibold text-cyan-400">Data Provenance</h3>
                                        </div>
                                        <div className="text-xs font-mono text-cyan-400/70">
                                            {ideaData.personaFit.dataProvenance.modelConfidence}
                                        </div>
                                    </div>

                                    {/* Research Elements - Trustworthy Sources */}
                                    {ideaData.personaFit.dataProvenance.researchElements && 
                                     ideaData.personaFit.dataProvenance.researchElements.length > 0 ? (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                                                Research-Backed Validation
                                            </h4>
                                            <div className="space-y-4">
                                                {ideaData.personaFit.dataProvenance.researchElements.map((element, idx) => (
                                                    <div key={idx} className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h5 className="text-base font-semibold text-white">
                                                                        {element.title}
                                                                    </h5>
                                                                    {element.url && (
                                                                        <a
                                                                            href={element.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-cyan-400 hover:text-cyan-300"
                                                                        >
                                                                            <ExternalLink className="w-4 h-4" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                {element.domain && (
                                                                    <p className="text-xs text-neutral-500 mb-2">{element.domain}</p>
                                                                )}
                                                                {element.snippet && (
                                                                    <p className="text-sm text-neutral-300 leading-relaxed">{element.snippet}</p>
                                                                )}
                                                                {element.date && (
                                                                    <p className="text-xs text-neutral-500 mt-2">Published: {element.date}</p>
                                                                )}
                                                            </div>
                                                            {element.relevanceScore && (
                                                                <div className="flex-shrink-0">
                                                                    <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg px-3 py-1">
                                                                        <div className="text-xs text-cyan-400 mb-1">Relevance</div>
                                                                        <div className="text-lg font-bold text-white">{element.relevanceScore}/10</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Fallback to basic sources if researchElements not available */
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Sources</h4>
                                            <ul className="space-y-2">
                                                {ideaData.personaFit.dataProvenance.sources?.map((source, idx) => (
                                                    <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-cyan-400 mt-1">•</span>
                                                        <span>{source}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Audience Size */}
                                    {ideaData.personaFit.dataProvenance.audienceSize && (
                                        <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-4">
                                            <p className="text-xs text-cyan-400 font-semibold mb-1">AUDIENCE SIZE</p>
                                            <p className="text-sm text-neutral-300">{ideaData.personaFit.dataProvenance.audienceSize}</p>
                                        </div>
                                    )}

                                    {/* Core Idea Research Validation - Research elements that validate the core idea itself */}
                                    {ideaData.marketIntelligence?.sources && ideaData.marketIntelligence.sources.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                                                Core Idea Research Validation
                                            </h4>
                                            <p className="text-xs text-neutral-500 mb-4">
                                                Trustworthy sources that validate this core idea based on deep research
                                            </p>
                                            <div className="space-y-4">
                                                {ideaData.marketIntelligence.sources.map((source, idx) => (
                                                    <div key={idx} className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h5 className="text-base font-semibold text-white">
                                                                        {source.title}
                                                                    </h5>
                                                                    {source.url && (
                                                                        <a
                                                                            href={source.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-cyan-400 hover:text-cyan-300"
                                                                        >
                                                                            <ExternalLink className="w-4 h-4" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                {source.domain && (
                                                                    <p className="text-xs text-neutral-500 mb-2">{source.domain}</p>
                                                                )}
                                                                {source.snippet && (
                                                                    <p className="text-sm text-neutral-300 leading-relaxed">{source.snippet}</p>
                                                                )}
                                                                {source.date && (
                                                                    <p className="text-xs text-neutral-500 mt-2">Published: {source.date}</p>
                                                                )}
                                                            </div>
                                                            {source.relevanceScore && (
                                                                <div className="flex-shrink-0">
                                                                    <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg px-3 py-1">
                                                                        <div className="text-xs text-cyan-400 mb-1">Relevance</div>
                                                                        <div className="text-lg font-bold text-white">{source.relevanceScore}/10</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Market Intelligence Section */}
                {ideaData.marketIntelligence && (
                    <div className="mt-8">
                        <div className="bg-gradient-to-br from-neutral-900/50 to-cyan-950/20 border border-neutral-700/50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-cyan-400" />
                                Market Opportunity
                            </h2>

                            {/* Market Opportunity Explanation */}
                            <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold text-cyan-300 mb-3">Market Analysis</h3>
                                {ideaData.marketIntelligence.marketOpportunityExplanation ? (
                                    <p className="text-neutral-300 leading-relaxed">
                                        {ideaData.marketIntelligence.marketOpportunityExplanation}
                                    </p>
                                ) : (
                                    <p className="text-neutral-300 leading-relaxed">
                                        This market opportunity analysis evaluates the potential reach, engagement, and conversion potential for this core idea based on current market dynamics and audience behavior patterns.
                                    </p>
                                )}
                            </div>

                            {/* Market Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl p-6 border border-cyan-700/30">
                                    <p className="text-sm text-cyan-400 font-semibold mb-2">IMMEDIATE AUDIENCE</p>
                                    <p className="text-xl font-bold text-white">{ideaData.marketIntelligence.totalAddressableMarket.immediateAudience}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-700/30">
                                    <p className="text-sm text-purple-400 font-semibold mb-2">EXPANDED AUDIENCE</p>
                                    <p className="text-xl font-bold text-white">{ideaData.marketIntelligence.totalAddressableMarket.expandedAudience}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-700/30">
                                    <p className="text-sm text-green-400 font-semibold mb-2">POTENTIAL REACH</p>
                                    <p className="text-xl font-bold text-white">{ideaData.marketIntelligence.totalAddressableMarket.potentialReach}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-700/30">
                                    <p className="text-sm text-blue-400 font-semibold mb-2">ENGAGEMENT</p>
                                    <p className="text-xl font-bold text-white">{ideaData.marketIntelligence.totalAddressableMarket.engagementPotential}</p>
                                </div>
                                <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-xl p-6 border border-pink-700/30">
                                    <p className="text-sm text-pink-400 font-semibold mb-2">CONVERSION</p>
                                    <p className="text-xl font-bold text-white">{ideaData.marketIntelligence.totalAddressableMarket.conversionPotential}</p>
                                </div>
                            </div>

                            {/* Sources for Market Opportunity */}
                            {ideaData.marketIntelligence.sources && ideaData.marketIntelligence.sources.length > 0 && (
                                <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Supporting Research</h3>
                                    <div className="space-y-4">
                                        {ideaData.marketIntelligence.sources.map((source, idx) => (
                                            <div key={idx} className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="text-base font-semibold text-white">
                                                                {source.title}
                                                            </h4>
                                                            {source.url && (
                                                                <a
                                                                    href={source.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-cyan-400 hover:text-cyan-300"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                        </div>
                                                        {source.domain && (
                                                            <p className="text-xs text-neutral-500 mb-2">{source.domain}</p>
                                                        )}
                                                        {source.snippet && (
                                                            <p className="text-sm text-neutral-300 leading-relaxed">{source.snippet}</p>
                                                        )}
                                                        {source.date && (
                                                            <p className="text-xs text-neutral-500 mt-2">Published: {source.date}</p>
                                                        )}
                                                    </div>
                                                    {source.relevanceScore && (
                                                        <div className="flex-shrink-0">
                                                            <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg px-3 py-1">
                                                                <div className="text-xs text-cyan-400 mb-1">Relevance</div>
                                                                <div className="text-lg font-bold text-white">{source.relevanceScore}/10</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-neutral-700 flex justify-between text-sm text-neutral-500">
                    <span>Created on {new Date(metadata.createdAt).toLocaleDateString()}</span>
                    <span>Author: {metadata.author}</span>
                </div>
            </div>
        </div>
    )
}

