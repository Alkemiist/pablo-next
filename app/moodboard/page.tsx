'use client';

import { useState } from 'react';
import MoodboardTopBar from '@/app/components/moodboard/moodboard-top-bar';
import MoodboardDisplay from '@/app/components/moodboard/moodboard-display';
import { MoodboardRequest } from '@/lib/types/moodboard';
import type { Moodboard } from '@/lib/types/moodboard';

export default function Moodboard() {
    const [moodboard, setMoodboard] = useState<Moodboard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // top bar state
    const [brand, setBrand] = useState('');
    const [product, setProduct] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [campaignGoal, setCampaignGoal] = useState('');

    const handleGenerateMoodboard = async (formData?: MoodboardRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const body = formData ?? {
                brand,
                product,
                targetAudience,
                campaignGoal,
            };

            const response = await fetch('/api/generate-moodboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate moodboard');
            }

            if (data.success && data.moodboard) {
                setMoodboard(data.moodboard);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            console.error('Error generating moodboard:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMoodboard(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">AI-Powered Moodboard Generator</h1>
                    <p className="text-xl text-slate-400 max-w-3xl">
                        Create professional marketing campaign moodboards with AI assistance. 
                        Generate comprehensive creative briefs, brand guidelines, and visual systems 
                        tailored to your brand, product, and target audience.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-red-400 font-medium">Error:</span>
                            <span className="text-red-300 ml-2">{error}</span>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Top Bar */}
                <MoodboardTopBar
                    brand={brand}
                    product={product}
                    targetAudience={targetAudience}
                    campaignGoal={campaignGoal}
                    onUpdateBrand={setBrand}
                    onUpdateProduct={setProduct}
                    onUpdateAudience={setTargetAudience}
                    onUpdateGoal={setCampaignGoal}
                    onGenerate={() => handleGenerateMoodboard()}
                    isLoading={isLoading}
                />

                {/* Main Content */}
                {!moodboard ? (
                    <div className="mt-6 text-slate-400">Fill the context in the top bar and click Generate to create a professional moodboard.</div>
                ) : (
                    <div className="space-y-6">
                        {/* Action Bar */}
                        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <div className="flex items-center space-x-4">
                                <span className="text-slate-400">Generated Moodboard:</span>
                                <span className="text-white font-medium">
                                    {moodboard.briefEssentials.campaignGoal}
                                </span>
                            </div>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Generate New Moodboard
                            </button>
                        </div>

                        {/* Moodboard Display */}
                        <MoodboardDisplay moodboard={moodboard} />
                    </div>
                )}

                {/* Features Overview */}
                {!moodboard && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl font-bold">🎯</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Strategic Brief</h3>
                            <p className="text-slate-400">
                                Get comprehensive campaign goals, KPIs, and channel strategies 
                                tailored to your specific objectives.
                            </p>
                        </div>
                        
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl font-bold">🎨</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Creative Direction</h3>
                            <p className="text-slate-400">
                                Explore multiple creative routes with visual styles, 
                                color palettes, and typography systems.
                            </p>
                        </div>
                        
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl font-bold">⚡</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Production Ready</h3>
                            <p className="text-slate-400">
                                Access export specs, file naming conventions, 
                                and handoff guidelines for seamless production.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}