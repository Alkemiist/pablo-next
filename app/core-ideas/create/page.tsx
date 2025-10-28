'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from "@/components/ui/modal"
import { X, Sparkles } from "lucide-react"
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
                    persona: selectedPersona?.name, 
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
                    <button className={`relative px-8 h-12 rounded-xl border text-sm font-semibold transition-all duration-500 ease-in-out flex items-center gap-3 overflow-hidden ${allVariablesSelected ? 'border-transparent text-white group' + (isGenerating ? ' cursor-wait' : ' cursor-pointer') : 'bg-neutral-800 border-neutral-700 text-neutral-400 cursor-not-allowed'}`} disabled={!allVariablesSelected || isGenerating} onClick={handleGenerate}>
                        {allVariablesSelected && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-pulse opacity-90"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-spin opacity-40" style={{animationDuration: '8s'}}></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 via-cyan-400 to-blue-500 rounded-xl blur-xl animate-pulse opacity-50" style={{animationDuration: '2s'}}></div>
                                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg animate-spin opacity-30" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
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

            {error && <div className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">{error}</p></div>}

            <div className='mx-4 md:mx-8 h-[calc(100vh-80px)] overflow-y-auto'>
                {generatedIdea ? (
                    <div className="max-w-6xl mx-auto py-8">
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-8 group">
                            {generatedIdea.imageUrl && (
                                <img 
                                    src={generatedIdea.imageUrl} 
                                    alt={generatedIdea.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h1 className="text-2xl md:text-5xl font-bold text-white mb-4">{generatedIdea.title}</h1>
                                <p className="text-base md:text-xl text-neutral-200 max-w-3xl">{generatedIdea.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-xl font-semibold text-white">Core Concept</h2>
                                </div>
                                <p className="text-neutral-300 leading-relaxed">{generatedIdea.coreConcept}</p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Why It Works</h2>
                                <p className="text-neutral-300 leading-relaxed">{generatedIdea.whyItWorks}</p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Emotional Hook</h2>
                                <p className="text-neutral-300 leading-relaxed">{generatedIdea.emotionalHook}</p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Trend Connection</h2>
                                <p className="text-neutral-300 leading-relaxed">{generatedIdea.trendConnection}</p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Key Mechanism</h2>
                                <p className="text-purple-300 text-lg font-medium">{generatedIdea.keyMechanism}</p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Unique Angle</h2>
                                <p className="text-neutral-300 leading-relaxed">{generatedIdea.uniqueAngle}</p>
                            </div>
                            {generatedIdea.executionExamples.length > 0 && (
                                <div className="md:col-span-2 bg-neutral-900 border border-neutral-700 rounded-xl p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Execution Examples</h2>
                                    <ul className="space-y-3">
                                        {generatedIdea.executionExamples.map((example, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-purple-900/30 border border-purple-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-purple-300 text-sm font-semibold">{idx + 1}</span>
                                                </div>
                                                <p className="text-neutral-300 flex-1">{example}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="md:col-span-2 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/30 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-purple-300 mb-4">Target Outcome</h2>
                                <p className="text-neutral-200 text-lg leading-relaxed">{generatedIdea.targetOutcome}</p>
                            </div>
                        </div>
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
