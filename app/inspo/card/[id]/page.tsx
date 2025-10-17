'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Calendar, User, Tag, Trash2, Download, Share, RotateCcw, Save, X } from "lucide-react";
import { SavedInspoCard } from '@/lib/types/inspo-card';

// Simple tactic interface
interface Tactic {
  id: string;
  name: string;
  title: string;
  description: string;
  oneLinerSummary?: string;
  platform?: string;
  coreMessage?: string;
  image?: string;
  goal?: string;
  whyItWorks?: string;
}
import { Modal } from "@/components/ui/modal";

export default function InspoCardDetailPage() {
    const params = useParams();
    const router = useRouter();
    const cardId = params.id as string;

    const [card, setCard] = useState<SavedInspoCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Tactic modal state
    const [selectedTactic, setSelectedTactic] = useState<Tactic | null>(null);
    const [isTacticModalOpen, setIsTacticModalOpen] = useState(false);

    useEffect(() => {
        const loadCard = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/inspo-cards/${cardId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to load inspo card');
                }
                
                const data = await response.json();
                setCard(data.card);
            } catch (err) {
                console.error('Error loading inspo card:', err);
                setError(err instanceof Error ? err.message : 'Failed to load inspo card');
            } finally {
                setIsLoading(false);
            }
        };

        if (cardId) {
            loadCard();
        }
    }, [cardId]);

    const handleDelete = async () => {
        if (!card) return;
        
        const confirmed = window.confirm(`Are you sure you want to delete "${card.metadata.title}"? This action cannot be undone.`);
        
        if (!confirmed) return;
        
        try {
            const response = await fetch(`/api/inspo-cards/${cardId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete inspo card');
            }
            
            router.push('/inspo');
        } catch (error) {
            console.error('Error deleting inspo card:', error);
            alert('Failed to delete inspo card. Please try again.');
        }
    };

    const handleTacticClick = (tactic: Tactic) => {
        setSelectedTactic(tactic);
        setIsTacticModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400">Loading inspo card...</p>
                </div>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto flex items-center justify-center">
                <div className="text-center">
                    <Lightbulb className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-300 mb-2">Card not found</h3>
                    <p className="text-neutral-500 mb-6">{error || 'The inspo card you\'re looking for doesn\'t exist.'}</p>
                    <Button onClick={() => router.push('/inspo')} className="bg-blue-800 hover:bg-blue-700">
                        Back to Inspo
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-60px)] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-neutral-950 border-b border-neutral-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="border-neutral-700 text-neutral-300 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            <h1 className="text-xl font-semibold text-white">{card.metadata.title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="border-red-700 text-red-400 hover:text-red-300 hover:border-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Card Info */}
                <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-700 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Card Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-neutral-400">Description:</span>
                            <p className="text-white mt-1">{card.metadata.description}</p>
                        </div>
                        <div>
                            <span className="text-neutral-400">Brand:</span>
                            <p className="text-white mt-1">{card.data.context.brand}</p>
                        </div>
                        <div>
                            <span className="text-neutral-400">Product:</span>
                            <p className="text-white mt-1">{card.data.context.product}</p>
                        </div>
                        <div>
                            <span className="text-neutral-400">Persona:</span>
                            <p className="text-white mt-1">{card.data.context.persona}</p>
                        </div>
                        <div>
                            <span className="text-neutral-400">Goal:</span>
                            <p className="text-white mt-1">{card.data.context.goal}</p>
                        </div>
                        <div>
                            <span className="text-neutral-400">Created:</span>
                            <p className="text-white mt-1">{new Date(card.metadata.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Tactic Display - Show individual tactic or grid */}
                <div className="mb-6">
                    {card.data.tactics.length === 1 ? (
                        // Single tactic - show it prominently
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">Saved Tactic</h2>
                            <div 
                                className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                                onClick={() => handleTacticClick(card.data.tactics[0])}
                                style={{ outline: 'none', boxShadow: 'none' }}
                                tabIndex={-1}
                            >
                                {/* Tactic Image */}
                                <div className="relative h-64 bg-neutral-200 overflow-hidden">
                                    {card.data.tactics[0].image ? (
                                        <img 
                                            src={card.data.tactics[0].image} 
                                            alt={card.data.tactics[0].title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                                            <Lightbulb className="size-16 text-neutral-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Tactic Content */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-xl mb-2">{card.data.tactics[0].title}</h3>
                                    <p className="text-neutral-300 text-sm leading-relaxed mb-2">{card.data.tactics[0].oneLinerSummary}</p>
                                    <p className="text-neutral-400 text-xs">Platform: {card.data.tactics[0].platform}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Multiple tactics - show grid
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">Generated Tactics ({card.data.tactics.length})</h2>
                            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                                {card.data.tactics.map((tactic, index) => (
                                    <div 
                                        key={index}
                                        className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                                        onClick={() => handleTacticClick(tactic)}
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                        tabIndex={-1}
                                    >
                                        {/* Tactic Image */}
                                        <div className="relative h-32 bg-neutral-200 overflow-hidden">
                                            {tactic.image ? (
                                                <img 
                                                    src={tactic.image} 
                                                    alt={tactic.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                                                    <Lightbulb className="size-8 text-neutral-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Tactic Content */}
                                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                            <h3 className="text-white font-bold text-lg">{tactic.title}</h3>
                                            <p className="text-neutral-300 text-xs leading-relaxed">{tactic.oneLinerSummary}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Generated Content */}
                {Object.keys(card.data.generatedContent).length > 0 && (
                    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Generated Content</h2>
                        <div className="space-y-4">
                            {Object.entries(card.data.generatedContent).map(([tacticId, content]) => (
                                <div key={tacticId} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                                    <h3 className="text-white font-medium mb-3">Tactic Content</h3>
                                    <div className="space-y-3">
                                        {Object.entries(content).map(([contentType, contentData]) => (
                                            <div key={contentType} className="bg-neutral-700 rounded p-3">
                                                <h4 className="text-neutral-300 font-medium text-sm mb-2 capitalize">
                                                    {contentType.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                <div className="text-neutral-400 text-sm">
                                                    {typeof contentData === 'string' ? (
                                                        <p>{contentData}</p>
                                                    ) : (
                                                        <pre className="whitespace-pre-wrap text-xs">
                                                            {JSON.stringify(contentData, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tactic Modal - Same as inspo creation flow */}
            <Modal 
                isOpen={isTacticModalOpen} 
                onClose={() => {
                    setIsTacticModalOpen(false);
                    setSelectedTactic(null);
                }}
                title={selectedTactic?.title || "Tactic Details"}
                description={selectedTactic?.oneLinerSummary || "Complete marketing tactic breakdown and next steps"}
                maxWidth="max-w-[80vw]"
            >
                {/* Action Button Stack - Positioned next to close button */}
                <div className="absolute top-6 right-16 z-50 flex gap-2">
                    <button 
                        title="Save Tactic" 
                        className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <Save className="w-4 h-4 text-white" />
                    </button>
                    <button title="Download Tactic" className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Share className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                </div>

                {selectedTactic && (
                    <div className="space-y-6">
                        {/* Tactic Image */}
                        <div className="relative h-64 bg-neutral-200 rounded-lg overflow-hidden">
                            {selectedTactic.image ? (
                                <img 
                                    src={selectedTactic.image} 
                                    alt={selectedTactic.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                                    <Lightbulb className="size-16 text-neutral-400" />
                                </div>
                            )}
                        </div>

                        {/* Tactic Details */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">{selectedTactic.title}</h3>
                                <p className="text-neutral-300">{selectedTactic.oneLinerSummary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-white font-medium mb-2">Core Message</h4>
                                    <p className="text-neutral-300 text-sm">{selectedTactic.coreMessage}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Goal</h4>
                                    <p className="text-neutral-300 text-sm">{selectedTactic.goal}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Platform</h4>
                                    <p className="text-neutral-300 text-sm">{selectedTactic.platform}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-2">Why It Works</h4>
                                    <p className="text-neutral-300 text-sm">{selectedTactic.whyItWorks}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Full Description</h4>
                                <p className="text-neutral-300 text-sm leading-relaxed">{selectedTactic.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}