'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from "@/components/ui/modal"
import { X, Sparkles, Download, Share2, Component, Barcode, Brain, TrendingUp, Calendar } from "lucide-react"
import { VariableMetadata, VariableType, Brand, Product, Persona, Trend } from '@/lib/variables-types'

interface ExecutionExample {
  tacticType: string
  platform: string
  description: string
  visualPrompt: string
  imageUrl?: string
}

interface CoreIdeaData {
  title: string
  description: string
  coreConcept: string
  whyItWorks: string
  emotionalHook: string
  trendConnection: string
  keyMechanism: string
  uniqueAngle: string
  executionExamples: string[] | ExecutionExample[] // Support both old and new format
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
    personaImageUrl?: string
    adjacentPersonas?: Array<{
      name: string
      archetype: string
      whyConsider: string
      overlap: string
      uniqueAngle: string
      keyDifference: string
    }>
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
    opportunityWindow?: {
      whyThisWindowExists: string
      competitiveLandscape: {
        whoCouldDoThis: string
        whatTheyreDoing: string
        whiteSpace: string
      }
      firstMoverAdvantage: {
        whatYouGain: string
        whatHappensIfYouWait: string
      }
      windowClosesWhen: {
        closingConditions: string[]
        urgency: string
        scenarioTriggers?: Array<{
          trigger: string
          likelihood: 'high' | 'medium' | 'low'
          timeline: string
          impact: string
        }>
        timeline?: {
          estimatedClose: string
          milestones: Array<{
            milestone: string
            date: string
            significance: string
          }>
          urgencyLevel: 'critical' | 'high' | 'medium' | 'low'
          actionWindow: string
        }
      }
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

    const getTypeIcon = (type: VariableType) => {
        switch (type) {
            case 'brand':
                return <Component className="size-4 text-blue-400" />
            case 'product':
                return <Barcode className="size-4 text-green-400" />
            case 'persona':
                return <Brain className="size-4 text-purple-400" />
            case 'trend':
                return <TrendingUp className="size-4 text-orange-400" />
            default:
                return <Component className="size-4 text-neutral-400" />
        }
    }

    const getTypeColor = (type: VariableType) => {
        switch (type) {
            case 'brand':
                return 'text-blue-400'
            case 'product':
                return 'text-green-400'
            case 'persona':
                return 'text-purple-400'
            case 'trend':
                return 'text-orange-400'
            default:
                return 'text-neutral-400'
        }
    }

    // Helper function to format brand/competitor names with proper commas
    const formatBrandNames = (text: string): string => {
        if (!text) return text
        
        // Remove any existing incorrect comma patterns
        let cleaned = text.trim()
        
        // If it already has proper comma formatting (contains ", and" or proper comma separation), return as-is
        if (cleaned.includes(', and') || cleaned.match(/^[A-Z][^,]+(?:, [A-Z][^,]+)+$/)) {
            return cleaned
        }
        
        // Try to detect brand names (capitalized words, possibly with spaces)
        // Split by common separators and clean up
        const parts = cleaned.split(/\s+(?:and|&)\s+/i).map(p => p.trim()).filter(p => p.length > 0)
        
        if (parts.length > 1) {
            // Format with commas and "and" before last item
            if (parts.length === 2) {
                return `${parts[0]} and ${parts[1]}`
            } else {
                const last = parts[parts.length - 1]
                const rest = parts.slice(0, -1).join(', ')
                return `${rest}, and ${last}`
            }
        }
        
        // If no clear separators, check if it's a list-like format without commas
        const words = cleaned.split(/\s+/)
        if (words.length > 3 && words.every(w => w[0] === w[0]?.toUpperCase())) {
            // Might be a list of capitalized brand names
            const brands = words.filter(w => w.length > 2 && /^[A-Z]/.test(w))
            if (brands.length >= 2) {
                if (brands.length === 2) {
                    return `${brands[0]} and ${brands[1]}`
                } else {
                    const last = brands[brands.length - 1]
                    const rest = brands.slice(0, -1).join(', ')
                    return `${rest}, and ${last}`
                }
            }
        }
        
        return cleaned
    }

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
        
        // Validate all required data is present
        if (!selectedBrand?.name || !selectedProduct?.name || !selectedPersona || !selectedTrend?.name) {
            setError('Please ensure all variables are properly selected')
            return
        }
        
        setIsGenerating(true)
        setError(null)
        try {
            console.log('Generating with:', {
                brand: selectedBrand?.name,
                product: selectedProduct?.name,
                persona: selectedPersona?.name || 'Persona object',
                trend: selectedTrend?.name
            })
            
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
            
            // Check if response is ok before parsing
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(errorData.error || `Server error: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('API Response:', data)
            
            if (!data.success) {
                console.error('API returned success: false', data)
                throw new Error(data.error || 'Failed to generate core idea')
            }
            
            if (data.ideas && data.ideas[0]) {
                console.log('Setting generated idea:', data.ideas[0])
                console.log('Idea title:', data.ideas[0].title)
                console.log('Idea description:', data.ideas[0].description)
                console.log('Idea has marketIntelligence:', !!data.ideas[0].marketIntelligence)
                console.log('Idea has opportunityWindow:', !!data.ideas[0].marketIntelligence?.opportunityWindow)
                
                // Set the generated idea
                setGeneratedIdea(data.ideas[0])
                
                // Force a small delay to ensure state updates
                await new Promise(resolve => setTimeout(resolve, 100))
                
                console.log('Generated idea should now be set')
            } else {
                console.error('No idea in response:', data)
                console.error('Response structure:', JSON.stringify(data, null, 2))
                throw new Error('No idea generated in response')
            }
        } catch (err) {
            console.error('Error generating idea:', err)
            console.error('Error stack:', err instanceof Error ? err.stack : 'No stack')
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate core idea'
            setError(errorMessage)
        } finally {
            setIsGenerating(false)
            console.log('Generation complete, isGenerating set to false')
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

            <div className='h-[calc(100vh-80px)] overflow-y-auto relative'>
                {/* Loading Overlay - Content Area Only */}
                {isGenerating && (
                    <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md z-40 flex items-start justify-center overflow-y-auto">
                        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
                            {/* Loading Header */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Generating Your Core Idea</h2>
                                        <p className="text-neutral-400 text-sm md:text-base">Crafting a strategic marketing concept...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skeleton Loader - Hero Section */}
                            <div className="mb-12">
                                <div className="relative w-full min-h-[400px] bg-gradient-to-br from-purple-950/30 to-neutral-900/50 border border-purple-500/20 rounded-3xl p-8 md:p-12 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 animate-pulse"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="h-4 w-32 bg-neutral-800/50 rounded-full animate-pulse"></div>
                                        <div className="h-12 md:h-16 w-3/4 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        <div className="h-6 w-full bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        <div className="h-6 w-5/6 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Skeleton Loader - Content Sections */}
                            <div className="space-y-8">
                                {/* Section 1 */}
                                <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                    <div className="h-6 w-48 bg-neutral-800/50 rounded-full mb-6 animate-pulse"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        <div className="h-4 w-5/6 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        <div className="h-4 w-4/6 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Section 2 - Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                        <div className="h-6 w-40 bg-neutral-800/50 rounded-full mb-6 animate-pulse"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-full bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                            <div className="h-4 w-4/5 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                        <div className="h-6 w-40 bg-neutral-800/50 rounded-full mb-6 animate-pulse"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-full bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                            <div className="h-4 w-4/5 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3 - Execution Examples */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[1, 2, 3, 4].map((idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/50 border border-neutral-700/50 rounded-3xl overflow-hidden">
                                            <div className="w-full aspect-square bg-neutral-800/50 animate-pulse"></div>
                                            <div className="p-8 space-y-4">
                                                <div className="h-6 w-12 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                                <div className="h-4 w-full bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                                <div className="h-4 w-5/6 bg-neutral-800/50 rounded-lg animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Loading Progress Indicator */}
                            <div className="mt-12 text-center">
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-purple-300 font-medium">Processing AI insights and generating visuals...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                        {generatedIdea.executionExamples.map((example, idx) => {
                                            // Handle both old string[] format and new ExecutionExample[] format
                                            const isStructured = typeof example === 'object' && 'tacticType' in example;
                                            const structuredExample = isStructured ? example as ExecutionExample : null;
                                            const description = isStructured ? structuredExample!.description : example as string;
                                            const imageUrl = isStructured ? structuredExample!.imageUrl : undefined;
                                            const platform = isStructured ? structuredExample!.platform : undefined;
                                            const tacticType = isStructured ? structuredExample!.tacticType : undefined;
                                            
                                            return (
                                                <div 
                                                    key={idx} 
                                                    className="group relative bg-gradient-to-br from-neutral-900/90 to-neutral-800/50 border border-neutral-700/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 flex flex-col h-full"
                                                >
                                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                                    
                                                    {/* Visual Preview */}
                                                    {imageUrl && (
                                                        <div className="relative w-full aspect-square overflow-hidden">
                                                            <img 
                                                                src={imageUrl} 
                                                                alt={`${tacticType || 'Execution'} mockup`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                onError={(e) => {
                                                                    // Hide image on error
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent"></div>
                                                            {platform && (
                                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-lg">
                                                                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{platform}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Content */}
                                                    <div className="relative z-10 p-8 flex-1 flex flex-col">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                                <span className="text-purple-300 font-bold text-2xl">{idx + 1}</span>
                                                            </div>
                                                            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                                                        </div>
                                                        <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-light">{description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* The Opportunity Window */}
                        {generatedIdea.marketIntelligence?.opportunityWindow && (
                            <section className="mb-24 px-6 md:px-12">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-center gap-3 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">The Opportunity Window</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                                    </div>
                                    
                                    {/* Panel 1: Why This Window Exists - Hero Visual */}
                                    <div className="relative mb-12 bg-gradient-to-br from-purple-950/40 to-neutral-900/50 border border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-sm overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/5 to-purple-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white">Why This Window Exists</h3>
                                            </div>
                                            <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-light">{generatedIdea.marketIntelligence.opportunityWindow.whyThisWindowExists}</p>
                                        </div>
                                    </div>

                                    {/* Panel 2: Competitive Landscape - Visual Map */}
                                    <div className="mb-12 bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Competitive Landscape</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50">
                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">Who Could Do This</p>
                                                <p className="text-base text-white leading-relaxed">
                                                    {formatBrandNames(generatedIdea.marketIntelligence.opportunityWindow.competitiveLandscape.whoCouldDoThis)}
                                                </p>
                                            </div>
                                            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50">
                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">What They're Doing</p>
                                                <p className="text-base text-white leading-relaxed">{generatedIdea.marketIntelligence.opportunityWindow.competitiveLandscape.whatTheyreDoing}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-950/40 to-neutral-800/50 rounded-2xl p-6 border border-purple-500/30">
                                                <p className="text-xs text-purple-400 font-semibold mb-3 uppercase tracking-wider">White Space</p>
                                                <p className="text-base text-white leading-relaxed">{generatedIdea.marketIntelligence.opportunityWindow.competitiveLandscape.whiteSpace}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Panel 3: First-Mover Advantage - Comparison View */}
                                    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-gradient-to-br from-purple-950/40 to-neutral-900/50 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h4 className="text-xl font-bold text-white">What You Gain</h4>
                                            </div>
                                            <p className="text-base text-neutral-200 leading-relaxed">{generatedIdea.marketIntelligence.opportunityWindow.firstMoverAdvantage.whatYouGain}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <h4 className="text-xl font-bold text-white">What Happens If You Wait</h4>
                                            </div>
                                            <p className="text-base text-neutral-300 leading-relaxed">{generatedIdea.marketIntelligence.opportunityWindow.firstMoverAdvantage.whatHappensIfYouWait}</p>
                                        </div>
                                    </div>

                                    {/* Panel 4: Window Closes When - Enhanced with Timeline & Scenario Triggers */}
                                    <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Window Closes When</h3>
                                        </div>
                                        
                                        {/* Timeline Visualization */}
                                        {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline && (
                                            <div className="mb-8 bg-gradient-to-br from-purple-950/40 to-neutral-800/50 rounded-2xl p-6 border border-purple-500/30">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <p className="text-sm text-purple-400 font-semibold mb-2 uppercase tracking-wider">Action Window</p>
                                                        <p className="text-xl font-bold text-white">{generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.actionWindow}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-purple-400 font-semibold mb-2 uppercase tracking-wider">Estimated Close</p>
                                                        <p className="text-xl font-bold text-white">{generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.estimatedClose}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Urgency Badge */}
                                                <div className="mb-6">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.urgencyLevel === 'critical' ? 'bg-red-400 animate-pulse' :
                                                            generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.urgencyLevel === 'high' ? 'bg-orange-400' :
                                                            generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.urgencyLevel === 'medium' ? 'bg-yellow-400' :
                                                            'bg-green-400'
                                                        }`}></div>
                                                        <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                                                            {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.urgencyLevel} Urgency
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Timeline Milestones */}
                                                {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.milestones && generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.milestones.length > 0 && (
                                                    <div>
                                                        <p className="text-sm text-purple-400 font-semibold mb-4 uppercase tracking-wider">Key Milestones</p>
                                                        <div className="space-y-4">
                                                            {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.timeline.milestones.map((milestone, idx) => (
                                                                <div key={idx} className="flex items-start gap-4">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                                            <span className="text-lg font-bold text-purple-300">{idx + 1}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-3 mb-2">
                                                                            <p className="text-base font-semibold text-white">{milestone.milestone}</p>
                                                                            <span className="text-xs text-purple-400 font-medium px-2 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                                                                                {milestone.date}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-neutral-300 leading-relaxed">{milestone.significance}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Scenario Triggers */}
                                        {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.scenarioTriggers && generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.scenarioTriggers.length > 0 && (
                                            <div className="mb-6">
                                                <p className="text-sm text-purple-400 font-semibold mb-4 uppercase tracking-wider">Scenario Triggers</p>
                                                <div className="space-y-4">
                                                    {generatedIdea.marketIntelligence.opportunityWindow.windowClosesWhen.scenarioTriggers.map((trigger, idx) => (
                                                        <div key={idx} className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/50">
                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                <p className="text-base font-semibold text-white flex-1">{trigger.trigger}</p>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                                        trigger.likelihood === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                                        trigger.likelihood === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                                        'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                    }`}>
                                                                        {trigger.likelihood} likelihood
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-purple-400 font-medium">Timeline: {trigger.timeline}</span>
                                                            </div>
                                                            <p className="text-sm text-neutral-300 mt-3 leading-relaxed">{trigger.impact}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

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
                                
                                {/* Primary Persona Profile */}
                                <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                        {/* Persona Title & Image */}
                                        {generatedIdea.personaFit?.personaImageUrl && (
                                            <div className="flex-shrink-0 flex flex-col md:w-64 justify-between">
                                                {/* Persona Title - First */}
                                                {selectedPersona && (
                                                    <div className="mb-6">
                                                        <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Target Persona</p>
                                                        <p className="text-xl font-bold text-white">{typeof selectedPersona === 'object' && selectedPersona.name ? selectedPersona.name : 'Selected Persona'}</p>
                                                    </div>
                                                )}
                                                {/* Persona Image - Second */}
                                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
                                                    <img 
                                                        src={generatedIdea.personaFit.personaImageUrl} 
                                                        alt="Persona profile"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/50 via-transparent to-transparent"></div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Persona Details */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="bg-gradient-to-br from-purple-950/40 to-neutral-900/50 border border-purple-500/30 rounded-2xl p-6 md:p-8 mb-6 flex-1">
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
                                </div>

                                {/* Motivations & Key Behaviors */}
                                {(generatedIdea.personaFit?.motivations?.length > 0 || generatedIdea.personaFit?.keyBehaviors?.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* Key Motivations */}
                                        {generatedIdea.personaFit?.motivations && generatedIdea.personaFit.motivations.length > 0 && (
                                            <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white">Key Motivations</h3>
                                                </div>
                                                <p className="text-sm text-purple-400 font-semibold mb-4 uppercase tracking-wider">What Drives This Audience</p>
                                                <div className="space-y-3">
                                                    {generatedIdea.personaFit.motivations.map((motivation, idx) => (
                                                        <div key={idx} className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors duration-300">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mt-0.5">
                                                                    <span className="text-xs font-bold text-purple-300">{idx + 1}</span>
                                                                </div>
                                                                <p className="text-sm text-neutral-200 leading-relaxed flex-1">{motivation}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Key Behaviors */}
                                        {generatedIdea.personaFit?.keyBehaviors && generatedIdea.personaFit.keyBehaviors.length > 0 && (
                                            <div className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-3xl p-8 backdrop-blur-sm">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white">Key Behaviors</h3>
                                                </div>
                                                <p className="text-sm text-purple-400 font-semibold mb-4 uppercase tracking-wider">How They Engage</p>
                                                <div className="space-y-3">
                                                    {generatedIdea.personaFit.keyBehaviors.map((behavior, idx) => (
                                                        <div key={idx} className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors duration-300">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mt-0.5">
                                                                    <span className="text-xs font-bold text-purple-300">{idx + 1}</span>
                                                                </div>
                                                                <p className="text-sm text-neutral-200 leading-relaxed flex-1">{behavior}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Adjacent Personas */}
                                {generatedIdea.personaFit?.adjacentPersonas && generatedIdea.personaFit.adjacentPersonas.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Adjacent Personas to Consider</span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {generatedIdea.personaFit.adjacentPersonas.map((adjacentPersona, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-neutral-900/80 to-purple-950/30 border border-neutral-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group flex flex-col h-full">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <span className="text-purple-300 font-bold text-lg">{idx + 1}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white">{adjacentPersona.name}</h4>
                                                            <p className="text-xs text-purple-400 font-medium">{adjacentPersona.archetype}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col flex-1 space-y-6">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Why Consider</p>
                                                            <p className="text-sm text-neutral-200 leading-relaxed">{adjacentPersona.whyConsider}</p>
                                                        </div>
                                                        
                                                        <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 flex-1 flex flex-col">
                                                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Unique Angle</p>
                                                            <p className="text-sm text-neutral-300 leading-relaxed flex-1">{adjacentPersona.uniqueAngle}</p>
                                                        </div>
                                                        
                                                        <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 flex-1 flex flex-col">
                                                            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wider">Overlap</p>
                                                            <p className="text-sm text-neutral-300 leading-relaxed flex-1">{adjacentPersona.overlap}</p>
                                                        </div>
                                                        
                                                        <div className="pt-4 border-t border-neutral-700/30">
                                                            <p className="text-xs text-neutral-400 italic">Key difference: {adjacentPersona.keyDifference}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

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

            {isBrandOpen && <Modal isOpen={isBrandOpen} onClose={() => setIsBrandOpen(false)} title="Select Brand">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    {getVariablesByType('brand').map(v => (
                        <div 
                            key={v.id} 
                            onClick={() => handleBrandSelect(v.id)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                                            {v.name}
                                        </h3>
                                        <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                                            {v.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Calendar className="size-3" />
                                        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>}

            {isProductOpen && <Modal isOpen={isProductOpen} onClose={() => setIsProductOpen(false)} title="Select Product">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    {getVariablesByType('product').map(v => (
                        <div 
                            key={v.id} 
                            onClick={() => handleProductSelect(v.id)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                                            {v.name}
                                        </h3>
                                        <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                                            {v.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Calendar className="size-3" />
                                        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>}

            {isPersonaOpen && <Modal isOpen={isPersonaOpen} onClose={() => setIsPersonaOpen(false)} title="Select Persona">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    {getVariablesByType('persona').map(v => (
                        <div 
                            key={v.id} 
                            onClick={() => handlePersonaSelect(v.id)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                                            {v.name}
                                        </h3>
                                        <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                                            {v.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Calendar className="size-3" />
                                        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>}

            {isTrendOpen && <Modal isOpen={isTrendOpen} onClose={() => setIsTrendOpen(false)} title="Select Trend">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    {getVariablesByType('trend').map(v => (
                        <div 
                            key={v.id} 
                            onClick={() => handleTrendSelect(v.id)}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                                            {v.name}
                                        </h3>
                                        <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                                            {v.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Calendar className="size-3" />
                                        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>}
        </div>
    )
}
