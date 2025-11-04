'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from "@/components/ui/modal"
import { X, Sparkles, Download, Share2 } from "lucide-react"
import { VariableMetadata, VariableType, Brand, Product, Persona, Trend } from '@/lib/variables-types'

interface CoreIdeaData {
  title: string
  description: string
  coreConcept: string
  whyItWorks: string
  emotionalHook: string
  trendConnection: string
  keyMechanism: string
  uniqueAngle: string
  executionExamples: string[]
  targetOutcome: string
  imageUrl?: string
  personaFit: {
    whyThisPersona: string
    archetype: string
    motivations: string[]
    channels: string[]
    psychographicCluster: string
    overlapWithBaseIdea: string
    keyBehaviors: string[]
    dataProvenance?: {
      sources: string[]
      modelConfidence: string
      audienceSize: string
    }
  }
  marketIntelligence?: {
    totalAddressableMarket: {
      immediateAudience: string
      expandedAudience: string
      potentialReach: string
      engagementPotential: string
      conversionPotential: string
    }
    funnelAlignment: {
      awareness: { score: number; reasoning: string }
      consideration: { score: number; reasoning: string }
      conversion: { score: number; reasoning: string }
      retention: { score: number; reasoning: string }
    }
    tactics: Array<{
      name: string
      impact: 'low' | 'medium' | 'high' | 'very-high'
      feasibility: 'low' | 'medium' | 'high'
      budget: string
      expectedROI: string
    }>
    channelEffectiveness: Array<{
      channel: string
      effectiveness: number
      affordability: 'budget' | 'mid' | 'premium'
      audienceAlignment: 'low' | 'medium' | 'high'
    }>
    timing: {
      optimalLaunchWindow: string
      trendLifecyclePhase: 'emerging' | 'peak' | 'mature' | 'declining'
      seasonalFit: string
      urgency: 'low' | 'medium' | 'high'
    }
    competitive: {
      whiteSpaceScore: number
      differentiationStrength: string
      marketSaturation: 'uncrowded' | 'moderate' | 'crowded'
    }
    psychological: {
      triggers: string[]
      emotionalVsRational: number
      persuasionStrength: string
    }
    virality: {
      shareabilityScore: number
      memePotential: string
      talkability: string
      factors: string[]
    }
    confidence: {
      overall: number
      feasibility: number
      marketReadiness: number
      trendAlignment: number
      brandFit: number
      innovation: number
    }
    implementationRoadmap: {
      phase1: { name: string; timeline: string; actions: string[]; quickWins: string[] }
      phase2: { name: string; timeline: string; actions: string[]; quickWins: string[] }
      phase3: { name: string; timeline: string; actions: string[]; quickWins: string[] }
    }
  }
}

export default function CreateCoreIdeaPage() {
    const router = useRouter()
    const [variables, setVariables] = useState<VariableMetadata[]>([])
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
    const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
    const [isBrandOpen, setIsBrandOpen] = useState(false)
    const [isProductOpen, setIsProductOpen] = useState(false)
    const [isPersonaOpen, setIsPersonaOpen] = useState(false)
    const [isTrendOpen, setIsTrendOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedIdea, setGeneratedIdea] = useState<CoreIdeaData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        fetch('/api/variables/files')
            .then(res => res.json())
            .then(result => result.success && result.variables && setVariables(result.variables))
            .catch(err => { console.error('Error loading variables:', err); setError('Failed to load variables') })
    }, [])

    const getVariablesByType = (type: VariableType) => variables.filter(v => v.type === type)
    const isCompleted = (variable: any) => variable !== null && variable !== ''
    const allVariablesSelected = selectedBrand && selectedProduct && selectedPersona && selectedTrend

    const loadVariableData = async (variableId: string, type: VariableType) => {
        try {
            const response = await fetch(`/api/variables/files?id=${variableId}&type=${type}`)
            const result = await response.json()
            return result.success && result.variable ? result.variable : null
        } catch (err) {
            console.error('Error loading variable data:', err)
            return null
        }
    }

    const handleBrandSelect = async (id: string) => { const data = await loadVariableData(id, 'brand'); if (data) setSelectedBrand(data as Brand); setIsBrandOpen(false) }
    const handleProductSelect = async (id: string) => { const data = await loadVariableData(id, 'product'); if (data) setSelectedProduct(data as Product); setIsProductOpen(false) }
    const handlePersonaSelect = async (id: string) => { const data = await loadVariableData(id, 'persona'); if (data) setSelectedPersona(data as Persona); setIsPersonaOpen(false) }
    const handleTrendSelect = async (id: string) => { const data = await loadVariableData(id, 'trend'); if (data) setSelectedTrend(data as Trend); setIsTrendOpen(false) }

    const handleGenerate = async () => {
        if (!allVariablesSelected) return
        setIsGenerating(true)
        setError(null)
        try {
            const response = await fetch('/api/generate-core-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    brand: selectedBrand?.name, 
                    product: selectedProduct?.name, 
                    persona: selectedPersona, 
                    trend: selectedTrend?.name,
                    generateSingle: true,
                    cardIndex: 0
                })
            })
            const data = await response.json()
            if (data.success && data.ideas && data.ideas[0]) setGeneratedIdea(data.ideas[0])
        } catch (err) {
            console.error('Error generating idea:', err)
            setError('Failed to generate core idea')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownloadPDF = async () => {
        if (!generatedIdea) return
        setIsDownloading(true)
        
        // Scroll to top for better PDF capture
        window.scrollTo(0, 0)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // window.print() is synchronous and opens a system print dialog
        // It doesn't throw exceptions and doesn't return a promise
        // We reset the loading state after opening the dialog since we can't detect when it closes
        window.print()
        
        // Reset loading state after a short delay to allow the dialog to open
        // Note: We can't detect when the user actually completes/cancels the print dialog
        setTimeout(() => {
            setIsDownloading(false)
        }, 300)
    }

    const handleShare = async () => {
        if (!generatedIdea) return
        try {
            const shareData = {
                title: generatedIdea.title,
                text: generatedIdea.description,
                url: window.location.href
            }
            
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center border-b border-neutral-800 bg-neutral-950 py-4 px-6 sticky top-0 z-10 h-[80px]">
                <div className="flex gap-4">
                    <div className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(selectedBrand) ? 'border-neutral-800' : 'border-neutral-800'}`} onClick={() => setIsBrandOpen(true)}>
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(selectedBrand) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}></div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(selectedBrand) ? selectedBrand?.name : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Brand</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(selectedProduct) ? 'border-neutral-800' : 'border-neutral-800'}`} onClick={() => setIsProductOpen(true)}>
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(selectedProduct) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}></div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(selectedProduct) ? selectedProduct?.name : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Product</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(selectedPersona) ? 'border-neutral-800' : 'border-neutral-800'}`} onClick={() => setIsPersonaOpen(true)}>
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(selectedPersona) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}></div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(selectedPersona) ? 'Persona Set' : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Persona</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(selectedTrend) ? 'border-neutral-800' : 'border-neutral-800'}`} onClick={() => setIsTrendOpen(true)}>
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(selectedTrend) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}></div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(selectedTrend) ? selectedTrend?.name : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Trend</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {generatedIdea && (
                        <>
                            <button 
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="w-12 h-12 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50" 
                                title="Download PDF"
                            >
                                {isDownloading ? (
                                    <div className="w-5 h-5 border-2 border-neutral-300/30 border-t-neutral-300 rounded-full animate-spin"></div>
                                ) : (
                                    <Download className="w-5 h-5 text-neutral-300" />
                                )}
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-12 h-12 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors" 
                                title="Share"
                            >
                                <Share2 className="w-5 h-5 text-neutral-300" />
                            </button>
                        </>
                    )}
                    <button className={`relative px-8 h-12 rounded-xl border text-sm font-semibold transition-all duration-500 ease-in-out flex items-center gap-3 overflow-hidden ${allVariablesSelected ? 'border-transparent text-white group' + (isGenerating ? ' cursor-wait' : ' cursor-pointer') : 'bg-neutral-800 border-neutral-700 text-neutral-400 cursor-not-allowed'}`} disabled={!allVariablesSelected || isGenerating} onClick={handleGenerate}>
                        {allVariablesSelected && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 animate-pulse opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-500 animate-spin opacity-40" style={{animationDuration: '8s'}}></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 rounded-xl blur-xl animate-pulse opacity-50" style={{animationDuration: '2s'}}></div>
                                <div className="absolute -inset-1 bg-gradient-to-tr from-purple-400 via-purple-500 to-purple-600 rounded-xl blur-lg animate-spin opacity-30" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
                            </>
                        )}
                        <div className="relative z-10 flex items-center gap-3">
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="font-mono tracking-wider">Generating Idea</span>
                                </>
                            ) : (
                                <span className="font-mono tracking-wider">Create</span>
                            )}
                        </div>
                    </button>
                    <button onClick={() => router.push('/core-ideas')} className="w-12 h-12 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors" title="Back to Core Ideas">
                        <X className="w-5 h-5 text-neutral-300" />
                    </button>
                </div>
            </div>

            {error && <div className="mx-8 mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"><p className="text-purple-400 text-sm">{error}</p></div>}

            <div className='h-[calc(100vh-80px)] overflow-y-auto'>
                {generatedIdea ? (
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Section - Cinematic */}
                        <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden mb-20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-neutral-950 to-purple-950/50"></div>
                            {generatedIdea.imageUrl && (
                                <>
                                    <div className="absolute inset-0 opacity-20">
                                        <img 
                                            src={generatedIdea.imageUrl} 
                                            alt={generatedIdea.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950"></div>
                                </>
                            )}
                            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-purple-300">Core Idea</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                                    {generatedIdea.title}
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-5xl mx-auto leading-relaxed font-light">
                                    {generatedIdea.description}
                                </p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent"></div>
                        </section>

                        {/* The Hook - Emotional Entry Point */}
                        <section className="mb-24 px-6 md:px-12">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">The Hook</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-950/30 to-neutral-900/50 border border-purple-500/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Emotional Hook</h2>
                                    <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-light">{generatedIdea.emotionalHook}</p>
                                </div>
                            </div>
                        </section>

                        {/* The Concept - Core Foundation */}
                        <section className="mb-24 px-6 md:px-12">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-3 mb-12">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">The Foundation</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/40 border border-neutral-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-500 group">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Sparkles className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">Core Concept</h2>
                                        </div>
                                        <p className="text-lg text-neutral-300 leading-relaxed">{generatedIdea.coreConcept}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/40 border border-neutral-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-500 group">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Sparkles className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">Why It Works</h2>
                                        </div>
                                        <p className="text-lg text-neutral-300 leading-relaxed">{generatedIdea.whyItWorks}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* The Mechanism - Key Differentiator */}
                        <section className="mb-24 px-6 md:px-12">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">The Mechanism</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-950/40 to-neutral-900/50 border border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Key Mechanism</h2>
                                    <p className="text-xl md:text-2xl text-purple-200 leading-relaxed font-medium">{generatedIdea.keyMechanism}</p>
                                </div>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/40 border border-neutral-700/50 rounded-2xl p-6 backdrop-blur-sm">
                                        <h3 className="text-lg font-bold text-white mb-3">Unique Angle</h3>
                                        <p className="text-base text-neutral-300 leading-relaxed">{generatedIdea.uniqueAngle}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/40 border border-neutral-700/50 rounded-2xl p-6 backdrop-blur-sm">
                                        <h3 className="text-lg font-bold text-white mb-3">Trend Connection</h3>
                                        <p className="text-base text-neutral-300 leading-relaxed">{generatedIdea.trendConnection}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Execution Examples - Visual Showcase */}
                        {generatedIdea.executionExamples.length > 0 && (
                            <section className="mb-24 px-6 md:px-12">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-center gap-3 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">How to Execute</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {generatedIdea.executionExamples.map((example, idx) => (
                                            <div 
                                                key={idx} 
                                                className="group relative bg-gradient-to-br from-neutral-900/90 to-neutral-800/50 border border-neutral-700/50 rounded-3xl p-10 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <span className="text-purple-300 font-bold text-2xl">{idx + 1}</span>
                                                        </div>
                                                        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                                                    </div>
                                                    <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-light">{example}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Decision Framework */}
                        {generatedIdea.marketIntelligence && (
                            <section className="mb-24 px-6 md:px-12">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-center gap-3 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Decision Framework</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    </div>
                                    
                                    {/* Three Column Layout: Why Now | Differentiation | Feasibility */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                        {/* Why Now */}
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">Why Now</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Trend Lifecycle</p>
                                                    <p className="text-base text-white capitalize mb-2">{generatedIdea.marketIntelligence.timing.trendLifecyclePhase}</p>
                                                    <p className="text-sm text-neutral-400 leading-relaxed">{generatedIdea.marketIntelligence.timing.seasonalFit}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Launch Window</p>
                                                    <p className="text-base text-white leading-relaxed">{generatedIdea.marketIntelligence.timing.optimalLaunchWindow}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Urgency</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                                            generatedIdea.marketIntelligence.timing.urgency === 'high' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' :
                                                            generatedIdea.marketIntelligence.timing.urgency === 'medium' ? 'bg-neutral-900/30 text-neutral-400 border border-neutral-700/30' : 
                                                            'bg-neutral-900/30 text-neutral-400 border border-neutral-700/30'
                                                        }`}>
                                                            {generatedIdea.marketIntelligence.timing.urgency.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Differentiation */}
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">Differentiation</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">White Space</p>
                                                        <span className="text-lg font-bold text-white">{generatedIdea.marketIntelligence.competitive.whiteSpaceScore}/10</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-900 rounded-full h-2 mb-3">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                            width: `${generatedIdea.marketIntelligence.competitive.whiteSpaceScore * 10}%`
                                                        }}></div>
                                                    </div>
                                                    <p className="text-xs text-neutral-400 capitalize">Market: {generatedIdea.marketIntelligence.competitive.marketSaturation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Competitive Advantage</p>
                                                    <p className="text-sm text-white leading-relaxed">{generatedIdea.marketIntelligence.competitive.differentiationStrength}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feasibility */}
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">Feasibility</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {generatedIdea.marketIntelligence.tactics.length > 0 && (
                                                    <>
                                                        <div>
                                                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Implementation Ease</p>
                                                            {(() => {
                                                                const highFeasibility = generatedIdea.marketIntelligence.tactics.filter(t => t.feasibility === 'high').length;
                                                                const total = generatedIdea.marketIntelligence.tactics.length;
                                                                const ease = highFeasibility / total;
                                                                const label = ease >= 0.67 ? 'High' : ease >= 0.33 ? 'Medium' : 'Low';
                                                                return (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                                                            label === 'High' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' :
                                                                            label === 'Medium' ? 'bg-neutral-900/30 text-neutral-400 border border-neutral-700/30' : 
                                                                            'bg-neutral-900/30 text-neutral-400 border border-neutral-700/30'
                                                                        }`}>
                                                                            {label}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Resource Requirements</p>
                                                            <p className="text-sm text-white leading-relaxed">
                                                                {generatedIdea.marketIntelligence.tactics.some(t => t.budget.includes('budget') || t.budget.includes('Low')) 
                                                                    ? 'Low to moderate investment needed' 
                                                                    : 'Moderate to significant investment required'}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                                {generatedIdea.marketIntelligence.confidence && (
                                                    <div>
                                                        <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Feasibility Score</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-white">{generatedIdea.marketIntelligence.confidence.feasibility}/10</span>
                                                            <div className="flex-1 bg-neutral-900 rounded-full h-2">
                                                                <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                                    width: `${generatedIdea.marketIntelligence.confidence.feasibility * 10}%`
                                                                }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Strategic Alignment */}
                                    {generatedIdea.marketIntelligence.confidence && (
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm mb-12">
                                            <h3 className="text-2xl font-bold text-white mb-6">Strategic Alignment</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Brand Fit</p>
                                                        <span className="text-2xl font-bold text-white">{generatedIdea.marketIntelligence.confidence.brandFit}/10</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-900 rounded-full h-2">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                            width: `${generatedIdea.marketIntelligence.confidence.brandFit * 10}%`
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Trend Alignment</p>
                                                        <span className="text-2xl font-bold text-white">{generatedIdea.marketIntelligence.confidence.trendAlignment}/10</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-900 rounded-full h-2">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                            width: `${generatedIdea.marketIntelligence.confidence.trendAlignment * 10}%`
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Market Readiness</p>
                                                        <span className="text-2xl font-bold text-white">{generatedIdea.marketIntelligence.confidence.marketReadiness}/10</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-900 rounded-full h-2">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                            width: `${generatedIdea.marketIntelligence.confidence.marketReadiness * 10}%`
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Overall Confidence</p>
                                                        <span className="text-2xl font-bold text-white">{generatedIdea.marketIntelligence.confidence.overall}/10</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-900 rounded-full h-2">
                                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{
                                                            width: `${generatedIdea.marketIntelligence.confidence.overall * 10}%`
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Risk Assessment */}
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm mb-12">
                                        <h3 className="text-2xl font-bold text-white mb-6">Risk Assessment</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">Potential Challenges</p>
                                                <ul className="space-y-2">
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">⚠</span>
                                                        <span>Trend timing may shift - monitor lifecycle closely</span>
                                                    </li>
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">⚠</span>
                                                        <span>Competitive response could emerge quickly in {generatedIdea.marketIntelligence.competitive.marketSaturation === 'uncrowded' ? 'uncrowded' : 'moderate'} market</span>
                                                    </li>
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">⚠</span>
                                                        <span>Resource allocation needs careful planning for {generatedIdea.marketIntelligence.tactics.some(t => t.feasibility === 'low') ? 'higher complexity' : 'moderate complexity'} tactics</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">Mitigation Strategies</p>
                                                <ul className="space-y-2">
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">✓</span>
                                                        <span>Start with Phase 1 quick wins to validate concept</span>
                                                    </li>
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">✓</span>
                                                        <span>Leverage {generatedIdea.marketIntelligence.competitive.whiteSpaceScore >= 7 ? 'significant' : 'moderate'} white space advantage for early positioning</span>
                                                    </li>
                                                    <li className="text-sm text-neutral-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">✓</span>
                                                        <span>Focus on tactics with high feasibility scores first</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Wins & Validation Pathway */}
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                        <h3 className="text-2xl font-bold text-white mb-6">Quick Wins & Validation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-sm text-purple-400 font-semibold mb-3 uppercase tracking-wider">Test in 1 Week</p>
                                                <ul className="space-y-2">
                                                    {generatedIdea.marketIntelligence.implementationRoadmap.phase1.quickWins.slice(0, 2).map((win, idx) => (
                                                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                            <span className="text-purple-400 mt-1">•</span>
                                                            <span>{win}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-400 font-semibold mb-3 uppercase tracking-wider">Validate in 1 Month</p>
                                                <p className="text-sm text-neutral-300 mb-2">Measure initial response to:</p>
                                                <ul className="space-y-2">
                                                    {generatedIdea.marketIntelligence.implementationRoadmap.phase1.actions.slice(0, 2).map((action, idx) => (
                                                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                            <span className="text-purple-400 mt-1">→</span>
                                                            <span>{action}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-400 font-semibold mb-3 uppercase tracking-wider">First Actions</p>
                                                <p className="text-sm text-neutral-300 mb-2">Prioritize these quick wins:</p>
                                                <ul className="space-y-2">
                                                    {generatedIdea.marketIntelligence.implementationRoadmap.phase1.quickWins.slice(2).map((win, idx) => (
                                                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                            <span className="text-purple-400 mt-1">✓</span>
                                                            <span>{win}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Deep Dive: Persona Strategic Fit */}
                        <section className="mb-24 px-6 md:px-12">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-3 mb-12">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Deep Dive: Audience Intelligence</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                </div>
                                <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                                    <div className="bg-gradient-to-br from-purple-950/40 to-neutral-900/50 border border-purple-500/30 rounded-2xl p-8 mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Strategic Fit</h3>
                                        </div>
                                        <p className="text-neutral-200 text-lg md:text-xl leading-relaxed font-light">{generatedIdea.personaFit?.whyThisPersona}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Archetype</h4>
                                            </div>
                                            <p className="text-white text-lg font-medium">{generatedIdea.personaFit?.archetype}</p>
                                        </div>
                                        <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Psychographic Cluster</h4>
                                            </div>
                                            <p className="text-white text-lg font-medium">{generatedIdea.personaFit?.psychographicCluster}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Deep Dive: Strategy */}
                        {generatedIdea.marketIntelligence && (
                            <section className="mb-24 px-6 md:px-12">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-center gap-3 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Deep Dive: Strategy</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    </div>
                                    <div className="space-y-12">
                                        {/* Implementation Roadmap */}
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                                            <h3 className="text-2xl font-bold text-white mb-8">Implementation Roadmap</h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {[
                                                    generatedIdea.marketIntelligence.implementationRoadmap.phase1,
                                                    generatedIdea.marketIntelligence.implementationRoadmap.phase2,
                                                    generatedIdea.marketIntelligence.implementationRoadmap.phase3
                                                ].map((phase, phaseIdx) => (
                                                    <div key={phaseIdx} className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                                <span className="text-purple-300 font-bold text-xl">{phaseIdx + 1}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-white">{phase.name}</h4>
                                                                <p className="text-xs text-neutral-400">{phase.timeline}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-5">
                                                            <div>
                                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">Actions</p>
                                                                <ul className="space-y-2">
                                                                    {phase.actions.map((action, idx) => (
                                                                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                                            <span className="text-purple-400 mt-1">•</span>
                                                                            <span>{action}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">Quick Wins</p>
                                                                <ul className="space-y-2">
                                                                    {phase.quickWins.map((win, idx) => (
                                                                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                                                                            <span className="text-purple-400 mt-1">✓</span>
                                                                            <span>{win}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center px-4">
                            <Sparkles className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
                            <p className="text-neutral-500 text-lg">Select your variables and click Create to generate a core idea</p>
                        </div>
                    </div>
                )}
            </div>

            {isBrandOpen && <Modal isOpen={isBrandOpen} onClose={() => setIsBrandOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Select Brand</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getVariablesByType('brand').map(v => (
                        <button key={v.id} onClick={() => handleBrandSelect(v.id)} className="w-full text-left p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700">
                            <p className="font-semibold">{v.name}</p>
                            <p className="text-sm text-neutral-400">{v.description}</p>
                        </button>
                    ))}
                </div>
            </Modal>}

            {isProductOpen && <Modal isOpen={isProductOpen} onClose={() => setIsProductOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Select Product</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getVariablesByType('product').map(v => (
                        <button key={v.id} onClick={() => handleProductSelect(v.id)} className="w-full text-left p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700">
                            <p className="font-semibold">{v.name}</p>
                            <p className="text-sm text-neutral-400">{v.description}</p>
                        </button>
                    ))}
                </div>
            </Modal>}

            {isPersonaOpen && <Modal isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Select Persona</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getVariablesByType('persona').map(v => (
                        <button key={v.id} onClick={() => handlePersonaSelect(v.id)} className="w-full text-left p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700">
                            <p className="font-semibold">{v.name}</p>
                            <p className="text-sm text-neutral-400">{v.description}</p>
                        </button>
                    ))}
                </div>
            </Modal>}

            {isTrendOpen && <Modal isOpen={isTrendOpen} onClose={() => setIsTrendOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Select Trend</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getVariablesByType('trend').map(v => (
                        <button key={v.id} onClick={() => handleTrendSelect(v.id)} className="w-full text-left p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700">
                            <p className="font-semibold">{v.name}</p>
                            <p className="text-sm text-neutral-400">{v.description}</p>
                        </button>
                    ))}
                </div>
            </Modal>}
        </div>
    )
}
