'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, X } from "lucide-react"
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
            <div className="min労力-screen bg-neutral-950 flex items-center justify-center">
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

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-neutral-700 flex justify-between text-sm text-neutral-500">
                    <span>Created on {new Date(metadata.createdAt).toLocaleDateString()}</span>
                    <span>Author: {metadata.author}</span>
                </div>
            </div>
        </div>
    )
}

