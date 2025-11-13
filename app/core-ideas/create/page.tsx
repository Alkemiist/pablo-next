'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from "@/components/ui/modal"
import { X, Sparkles, Download, Share2, Component, Barcode, Brain, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { VariableMetadata, VariableType, Brand, Product, Persona, Trend } from '@/lib/variables-types'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, Cell } from "recharts"

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
  videoUrl?: string
  strategy?: {
    mechanismBreakdown: {
      coreMechanism: string
      activationPoints: string[]
      amplificationFactors: string[]
      sustainabilityApproach: string
    }
    psychologicalTriggers: {
      primaryTrigger: string
      supportingTriggers: string[]
      cognitivePathway: string
      emotionalPayoff: string
    }
    strategicLens: {
      strategicOpportunity: string
      strategicRisks: Array<{
        risk: string
        mitigation: string
      }>
      strategicTradeOffs: string
    }
  }
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
    const executionExamplesCarouselRef = useRef<HTMLDivElement>(null)

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

    // Helper function to format platform names for display
    const formatPlatformName = (platform?: string): string => {
        if (!platform) return ''
        const platformMap: Record<string, string> = {
            'instagram-reels': 'Instagram Reels',
            'instagram': 'Instagram',
            'email': 'Email',
            'web': 'Web',
            'influencer': 'Influencer',
            'social': 'Social Media',
            'live-event': 'Live Event',
            'youtube': 'YouTube',
            'tiktok': 'TikTok',
            'collaboration': 'Partnership'
        }
        return platformMap[platform] || platform.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
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

    // Carousel scroll functions
    const scrollExecutionExamplesLeft = () => {
        const scrollAmount = executionExamplesCarouselRef.current?.clientWidth 
            ? Math.max(400, Math.round(executionExamplesCarouselRef.current.clientWidth * 0.85))
            : 400
        executionExamplesCarouselRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }

    const scrollExecutionExamplesRight = () => {
        const scrollAmount = executionExamplesCarouselRef.current?.clientWidth 
            ? Math.max(400, Math.round(executionExamplesCarouselRef.current.clientWidth * 0.85))
            : 400
        executionExamplesCarouselRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }

    // Modular Block Components (inline)
    const MetricBlock = ({ label, value, unit, size = 'medium' }: { label: string; value: number | string; unit?: string; size?: 'small' | 'medium' | 'large' }) => {
        const sizeClasses = {
            small: 'p-4',
            medium: 'p-6',
            large: 'p-8'
        }
        return (
            <div className={`bg-neutral-900/50 border border-neutral-800 rounded-xl ${sizeClasses[size]} hover:border-yellow-500/30 transition-colors`}>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {unit && <span className="text-sm text-neutral-400">{unit}</span>}
                </div>
            </div>
        )
    }

    const ContentBlock = ({ title, content, size = 'medium', span = 1 }: { title?: string; content: string | React.ReactNode; size?: 'small' | 'medium' | 'large'; span?: 1 | 2 }) => {
        const sizeClasses = {
            small: 'p-4 text-sm',
            medium: 'p-6',
            large: 'p-8 text-lg'
        }
        const spanClass = span === 2 ? 'md:col-span-2' : ''
        return (
            <div className={`bg-neutral-900/50 border border-neutral-800 rounded-xl ${sizeClasses[size]} hover:border-yellow-500/30 transition-colors ${spanClass}`}>
                {title && <h3 className="text-lg font-bold text-white mb-4">{title}</h3>}
                {typeof content === 'string' ? (
                    <p className="text-neutral-300 leading-relaxed">{content}</p>
                ) : (
                    content
                )}
            </div>
        )
    }

    const ChartBlock = ({ title, children, span = 1 }: { title: string; children: React.ReactNode; span?: 1 | 2 }) => {
        const spanClass = span === 2 ? 'md:col-span-2' : ''
        return (
            <div className={`bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors ${spanClass}`}>
                <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
                {children}
            </div>
        )
    }

    const VisualBlock = ({ imageUrl, title, content, platform }: { imageUrl?: string; title?: string; content: string; platform?: string }) => {
        return (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-colors group h-full flex flex-col">
                {imageUrl && (
                    <div className="relative w-full aspect-square overflow-hidden bg-neutral-800 flex-shrink-0">
                        <img 
                            src={imageUrl} 
                            alt={title || 'Visual'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        {platform && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-lg">
                                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">{formatPlatformName(platform)}</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                    {title && <h3 className="text-lg font-bold text-white mb-3">{title}</h3>}
                    <p className="text-neutral-300 leading-relaxed flex-1">{content}</p>
                </div>
            </div>
        )
    }

    const ListBlock = ({ title, items, numbered = false }: { title: string; items: string[]; numbered?: boolean }) => {
        return (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors">
                <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            {numbered && (
                                <div className="flex-shrink-0 w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                                    <span className="text-xs font-bold text-yellow-400">{idx + 1}</span>
                                </div>
                            )}
                            <p className="text-sm text-neutral-300 leading-relaxed flex-1">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
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
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 animate-pulse opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 animate-spin opacity-40" style={{animationDuration: '8s'}}></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 rounded-xl blur-xl animate-pulse opacity-50" style={{animationDuration: '2s'}}></div>
                                <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl blur-lg animate-spin opacity-30" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
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

            {error && <div className="mx-8 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><p className="text-yellow-400 text-sm">{error}</p></div>}

            <div className='h-[calc(100vh-80px)] overflow-y-auto relative'>
                {/* Loading Overlay - Content Area Only */}
                {isGenerating && (
                    <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md z-40 flex items-start justify-center overflow-y-auto">
                        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
                            {/* Loading Header */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
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
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-yellow-300 font-medium">Processing AI insights and generating visuals...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {generatedIdea ? (
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                        {/* Hero Section - Above the Fold */}
                        <section className="mb-16 min-h-[85vh] flex flex-col justify-center">
                            <div className="w-full">
                                {/* Generated Hero Image */}
                                {generatedIdea.imageUrl && (
                                    <div className="mb-8 w-full">
                                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                                            <img 
                                                src={generatedIdea.imageUrl} 
                                                alt={generatedIdea.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent"></div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Title and Description */}
                                <div className="text-center">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                        {generatedIdea.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                                        {generatedIdea.description}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Foundation Section */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-white mb-8">Foundation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ContentBlock title="Core Concept" content={generatedIdea.coreConcept} span={1} />
                                <ContentBlock title="Why It Works" content={generatedIdea.whyItWorks} span={1} />
                            </div>
                            {generatedIdea.emotionalHook && (
                                <div className="mt-6">
                                    <ContentBlock title="Emotional Hook" content={generatedIdea.emotionalHook} span={2} />
                                </div>
                            )}
                        </section>

                        {/* Persona Section - Moved to Second Position */}
                        {generatedIdea.personaFit && (
                            <section className="mb-16">
                                <h2 className="text-2xl font-bold text-white mb-8">Target Audience</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Persona Image & Basic Info */}
                                    {generatedIdea.personaFit.personaImageUrl && (
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
                                            <div className="relative w-full aspect-[4/3] bg-neutral-800">
                                                <img 
                                                    src={generatedIdea.personaFit.personaImageUrl} 
                                                    alt="Persona"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                {selectedPersona && (
                                                    <div className="mb-3">
                                                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Persona</p>
                                                        <p className="text-lg font-bold text-white">
                                                            {typeof selectedPersona === 'object' && selectedPersona.name ? selectedPersona.name : 'Selected Persona'}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Archetype</p>
                                                        <p className="text-sm font-medium text-white">{generatedIdea.personaFit.archetype}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Cluster</p>
                                                        <p className="text-sm font-medium text-white">{generatedIdea.personaFit.psychographicCluster}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Stacked Content: Strategic Fit, Motivations, Behaviors */}
                                    <div className="flex flex-col gap-4 h-full">
                                        <ContentBlock title="Strategic Fit" content={generatedIdea.personaFit.whyThisPersona} span={1} />
                                        {generatedIdea.personaFit.motivations?.length > 0 && (
                                            <ListBlock title="Key Motivations" items={generatedIdea.personaFit.motivations} numbered />
                                        )}
                                        {generatedIdea.personaFit.keyBehaviors?.length > 0 && (
                                            <ListBlock title="Key Behaviors" items={generatedIdea.personaFit.keyBehaviors} numbered />
                                        )}
                                    </div>
                                </div>

                                {/* Adjacent Personas */}
                                {generatedIdea.personaFit?.adjacentPersonas && generatedIdea.personaFit.adjacentPersonas.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-white mb-6">Adjacent Personas to Consider</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {generatedIdea.personaFit.adjacentPersonas.map((adjacentPersona, idx) => (
                                                <div key={idx} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300 group flex flex-col h-full">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <span className="text-yellow-400 font-bold text-lg">{idx + 1}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white">{adjacentPersona.name}</h4>
                                                            <p className="text-xs text-yellow-400 font-medium">{adjacentPersona.archetype}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col flex-1 space-y-4">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Why Consider</p>
                                                            <p className="text-sm text-neutral-300 leading-relaxed">{adjacentPersona.whyConsider}</p>
                                                        </div>
                                                        
                                                        <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 flex-1 flex flex-col">
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Unique Angle</p>
                                                            <p className="text-sm text-neutral-300 leading-relaxed flex-1">{adjacentPersona.uniqueAngle}</p>
                                                        </div>
                                                        
                                                        <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 flex-1 flex flex-col">
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Overlap</p>
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
                            </section>
                        )}

                        {/* Strategy Section */}
                        {generatedIdea.strategy && (
                            <section className="mb-16">
                                <h2 className="text-2xl font-bold text-white mb-8">Strategy</h2>
                                
                                {/* How It Works */}
                                <div className="mb-12">
                                    <h3 className="text-xl font-bold text-white mb-6">How It Works</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <ContentBlock title="Core Mechanism" content={generatedIdea.strategy.mechanismBreakdown.coreMechanism} span={2} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <ListBlock title="Activation Points" items={generatedIdea.strategy.mechanismBreakdown.activationPoints} numbered />
                                        <ListBlock title="Amplification Factors" items={generatedIdea.strategy.mechanismBreakdown.amplificationFactors} numbered />
                                    </div>
                                    <ContentBlock title="Sustainability Approach" content={generatedIdea.strategy.mechanismBreakdown.sustainabilityApproach} span={2} />
                                </div>

                                {/* Why It Works */}
                                <div className="mb-12">
                                    <h3 className="text-xl font-bold text-white mb-6">Why It Works</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <ContentBlock title="Primary Psychological Trigger" content={generatedIdea.strategy.psychologicalTriggers.primaryTrigger} span={2} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ListBlock title="Supporting Triggers" items={generatedIdea.strategy.psychologicalTriggers.supportingTriggers} />
                                        <div className="space-y-6">
                                            <ContentBlock title="Cognitive Pathway" content={generatedIdea.strategy.psychologicalTriggers.cognitivePathway} />
                                            <ContentBlock title="Emotional Payoff" content={generatedIdea.strategy.psychologicalTriggers.emotionalPayoff} />
                                        </div>
                                    </div>
                                </div>

                                {/* What to Watch For */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6">What to Watch For</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <ContentBlock title="Strategic Opportunity" content={generatedIdea.strategy.strategicLens.strategicOpportunity} span={2} />
                                    </div>
                                    {generatedIdea.strategy.strategicLens.strategicRisks?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-bold text-white mb-4">Strategic Risks & Mitigation</h4>
                                            <div className="space-y-4">
                                                {generatedIdea.strategy.strategicLens.strategicRisks.map((risk, idx) => (
                                                    <div key={idx} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                                                        <p className="text-white font-semibold mb-2">{risk.risk}</p>
                                                        <p className="text-sm text-neutral-400">Mitigation: <span className="text-neutral-300">{risk.mitigation}</span></p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <ContentBlock title="Strategic Trade-offs" content={generatedIdea.strategy.strategicLens.strategicTradeOffs} span={2} />
                                </div>
                            </section>
                        )}

                        {/* Execution Examples */}
                        {generatedIdea.executionExamples.length > 0 && (
                            <section className="mb-16 ">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-white">Execution Examples</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={scrollExecutionExamplesLeft}
                                            className="w-10 h-10 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Scroll left"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-neutral-300" />
                                        </button>
                                        <button
                                            onClick={scrollExecutionExamplesRight}
                                            className="w-10 h-10 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Scroll right"
                                        >
                                            <ChevronRight className="w-5 h-5 text-neutral-300" />
                                        </button>
                                    </div>
                                </div>
                                {/* Full-width carousel wrapper that breaks out of max-width // change this when you test more */}
                                <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
                                    <div className="px-4 md:px-6 lg:px-8">
                                        <div
                                            ref={executionExamplesCarouselRef}
                                            className="relative flex gap-6 overflow-x-auto scroll-smooth pr-2 scroll-container items-stretch"
                                            aria-label="Execution examples carousel"
                                        >
                                            {generatedIdea.executionExamples.map((example, idx) => {
                                                const isStructured = typeof example === 'object' && 'tacticType' in example;
                                                const structuredExample = isStructured ? example as ExecutionExample : null;
                                                const description = isStructured ? structuredExample!.description : example as string;
                                                const imageUrl = isStructured ? structuredExample!.imageUrl : undefined;
                                                const platform = isStructured ? structuredExample!.platform : undefined;
                                                
                                                return (
                                                    <div key={idx} className="shrink-0 w-[90%] sm:w-[400px] md:w-[500px] flex flex-col">
                                                        <VisualBlock 
                                                            imageUrl={imageUrl}
                                                            content={description}
                                                            platform={platform}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}


                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center px-4">
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
