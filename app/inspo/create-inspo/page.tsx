'use client'

// imports
import { useInspoContext } from "@/app/context/inspoContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ImageUpload } from "@/components/ui/image-upload";
import { validateContext } from "@/lib/api/tactics";
import { Tactic } from "@/lib/types/tactics";
import { Bookmark, Download, Share } from "lucide-react";

// Helper functions for image handling
const getImageFormat = (base64String: string): string => {
    if (base64String.startsWith('/9j/')) return 'jpeg';
    if (base64String.startsWith('iVBORw0KGgo')) return 'png';
    if (base64String.startsWith('R0lGODlh')) return 'gif';
    if (base64String.startsWith('UklGR')) return 'webp';
    return 'png'; // default
};

const createBlobUrl = (base64String: string, mimeType: string = 'image/png'): string => {
    try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error creating blob URL:', error);
        return '';
    }
};

const getImageSrc = (imageData: string | null): string | null => {
    if (!imageData) return null;
    
    // If it's already a complete URL or data URL, return as-is
    if (imageData.startsWith('http') || imageData.startsWith('data:')) {
        return imageData;
    }
    
    // If it's a base64 string, create data URL
    if (imageData.length > 100) { // Rough check for base64 string
        const format = getImageFormat(imageData);
        return `data:image/${format};base64,${imageData}`;
    }
    
    return null;
};

const validateAndSanitizeImageData = (imageData: string | null): boolean => {
    if (!imageData) return false;
    
    try {
        // Check if it's a valid URL
        if (imageData.startsWith('http')) {
            new URL(imageData);
            return true;
        }
        
        // Check if it's a valid data URL
        if (imageData.startsWith('data:image/')) {
            const base64Part = imageData.split(',')[1];
            if (base64Part && base64Part.length > 0) {
                // Try to decode base64 to validate it
                atob(base64Part);
                return true;
            }
        }
        
        // Check if it's a raw base64 string
        if (imageData.length > 100) {
            atob(imageData);
            return true;
        }
        
        return false;
    } catch (error) {
        console.warn('Invalid image data:', error);
        return false;
    }
};

// Typewriter component for intelligence-style text reveal
interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50, className = "" }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, text, speed]);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    return (
        <span className={className}>
            {displayedText}
            {currentIndex < text.length && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    );
};

// The full component
export default function CreateInspoPage() {

    // react context state 
    const { brand, setBrand, product, setProduct, persona, setPersona, goal, setGoal, visualGuide, setVisualGuide } = useInspoContext();
    
    // Local state for form inputs
    const [tempBrand, setTempBrand] = useState(brand);
    const [tempProduct, setTempProduct] = useState(product);
    const [tempPersona, setTempPersona] = useState(persona);
    const [tempGoalIntent, setTempGoalIntent] = useState('');
    const [tempGoalMedium, setTempGoalMedium] = useState('');
    const [tempGoalMessage, setTempGoalMessage] = useState('');
    const [tempVisualStyle, setTempVisualStyle] = useState('');
    const [tempVisualConstraints, setTempVisualConstraints] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    // Modal open states
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isPersonaOpen, setIsPersonaOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);
    const [isVisualGuideOpen, setIsVisualGuideOpen] = useState(false);
    
    // Tactic detail modal state
    const [selectedTactic, setSelectedTactic] = useState<Tactic | null>(null);
    const [isTacticModalOpen, setIsTacticModalOpen] = useState(false);

    // Generated tactics state
    const [tactics, setTactics] = useState<Tactic[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // Individual card loading states
    const [cardLoadingStates, setCardLoadingStates] = useState<{
        [key: number]: {
            isLoading: boolean;
            stage: string;
            progress: number;
        }
    }>({
        0: { isLoading: false, stage: '', progress: 0 },
        1: { isLoading: false, stage: '', progress: 0 },
        2: { isLoading: false, stage: '', progress: 0 },
        3: { isLoading: false, stage: '', progress: 0 },
    });

    // Helper function to update individual card loading state
    const updateCardLoadingState = (cardIndex: number, stage: string, progress: number) => {
        setCardLoadingStates(prev => ({
            ...prev,
            [cardIndex]: {
                isLoading: true,
                stage,
                progress
            }
        }));
    };

    // Helper function to complete card loading
    const completeCardLoading = (cardIndex: number, tactic: Tactic) => {
        setCardLoadingStates(prev => ({
            ...prev,
            [cardIndex]: {
                isLoading: false,
                stage: 'completed',
                progress: 100
            }
        }));
        
        // Update tactics array
        setTactics(prev => {
            const newTactics = [...prev];
            newTactics[cardIndex] = tactic;
            return newTactics;
        });
    };

    // Cleanup function for blob URLs (memory management)
    useEffect(() => {
        return () => {
            // Clean up any blob URLs when component unmounts
            tactics.forEach((tactic, index) => {
                if (tactic?.image && tactic.image.startsWith('blob:')) {
                    URL.revokeObjectURL(tactic.image);
                    console.log(`Cleaned up blob URL for tactic ${index + 1}`);
                }
            });
        };
    }, [tactics]);

    // Helper function to handle form submission
    const handleSubmit = (type: string, value: string, setter: (value: string) => void, setIsOpen: (value: boolean) => void) => {
        setter(value);
        setIsOpen(false);
    };

    // Helper function to handle goal submission
    const handleGoalSubmit = () => {
        const goalText = `Intent: ${tempGoalIntent}\nMedium: ${tempGoalMedium}\nKey Message: ${tempGoalMessage}`;
        setGoal(goalText);
        setIsGoalOpen(false);
    };

    // Helper function to handle visual guide submission
    const handleVisualGuideSubmit = () => {
        const visualGuideText = `Style: ${tempVisualStyle}\nConstraints: ${tempVisualConstraints}${uploadedImage ? '\nImage uploaded: Yes' : ''}`;
        setVisualGuide(visualGuideText);
        setIsVisualGuideOpen(false);
    };

    // Helper function to check if a section is completed
    const isCompleted = (value: string) => value.trim().length > 0;

    // Helper function to open tactic detail modal
    const handleTacticClick = (tactic: Tactic) => {
        setSelectedTactic(tactic);
        setIsTacticModalOpen(true);
    };

    // Function to generate tactics progressively
    const handleGenerateTacticsProgressively = async () => {
        if (!validateContext({ brand, product, persona, goal, visualGuide })) {
            setGenerationError('Please complete all sections before generating tactics');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);
        setTactics([]); // Clear previous results

        try {
            // Start all 4 cards in loading state
            for (let i = 0; i < 4; i++) {
                updateCardLoadingState(i, 'INITIALIZING INTELLIGENCE PROTOCOLS...', 5);
            }

            // Generate each tactic individually
            const generateSingleTactic = async (cardIndex: number) => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    updateCardLoadingState(cardIndex, 'Analyzing target demographics...', 15);
                    
                    await new Promise(resolve => setTimeout(resolve, 1200));
                    updateCardLoadingState(cardIndex, 'Cross-referencing brand data...', 25);
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    updateCardLoadingState(cardIndex, 'Generating tactical concept...', 40);
                    
                    await new Promise(resolve => setTimeout(resolve, 800));
                    updateCardLoadingState(cardIndex, 'Requesting visual asset...', 55);
                    
                    // Generate the tactic with image
                    const tacticsResponse = await fetch('/api/generate-tactics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            brand,
                            product,
                            persona,
                            goal,
                            visualGuide,
                            cardIndex, 
                            generateSingle: true 
                        })
                    });

                    if (!tacticsResponse.ok) {
                        throw new Error('Failed to generate tactic');
                    }

                    updateCardLoadingState(cardIndex, 'Rendering high-res image...', 75);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const tacticsData = await tacticsResponse.json();
                    const finalTactic = tacticsData.tactics[0]; // Get the single tactic with image

                    updateCardLoadingState(cardIndex, 'Compiling final intelligence...', 90);
                    await new Promise(resolve => setTimeout(resolve, 800));

                    updateCardLoadingState(cardIndex, 'Tactical brief complete', 100);
                    
                    // Small delay for smooth transition
                    setTimeout(() => {
                        completeCardLoading(cardIndex, finalTactic);
                    }, 1000);

                } catch (error) {
                    console.error(`Error generating tactic ${cardIndex}:`, error);
                    setCardLoadingStates(prev => ({
                        ...prev,
                        [cardIndex]: {
                            isLoading: false,
                            stage: 'Intelligence protocol failed',
                            progress: 0
                        }
                    }));
                }
            };

            // Start all 4 generations in parallel
            const generationPromises = Array.from({ length: 4 }, (_, i) => generateSingleTactic(i));
            
            // Wait for all to complete
            await Promise.all(generationPromises);

        } catch (error) {
            console.error('Error in progressive generation:', error);
            setGenerationError('Failed to generate tactics');
        } finally {
            setIsGenerating(false);
        }
    };

    return (

        <div>
            
            {/* Component Bar */}
            <div className="flex justify-between items-center border-b border-slate-700 bg-slate-900 py-4 px-8 sticky top-0 z-10 h-[80px]">

                {/* Left Side: User selects/ adds all of the context we need in order to generate the inspo -------------------------------- */}
                <div className="flex gap-4">

                    {/* Select Brand */}
                    <div 
                        className={`flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(brand) ? 'border-green-500 bg-green-500/10' : ''}`}
                        onClick={() => setIsBrandOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border ${isCompleted(brand) ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isCompleted(brand) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(brand) ? brand : 'Select'}</p>
                            <p className="text-sm text-slate-500">Brand</p>
                        </div>
                    </div>

                    {/* Select Product */}
                    <div 
                        className={`flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(product) ? 'border-green-500 bg-green-500/10' : ''}`}
                        onClick={() => setIsProductOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border ${isCompleted(product) ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isCompleted(product) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(product) ? product : 'Select'}</p>
                            <p className="text-sm text-slate-500">Product</p>
                        </div>
                    </div>

                    {/* Select Persona */}
                    <div 
                        className={`flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(persona) ? 'border-green-500 bg-green-500/10' : ''}`}
                        onClick={() => setIsPersonaOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border ${isCompleted(persona) ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isCompleted(persona) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(persona) ? 'Persona Set' : 'Select'}</p>
                            <p className="text-sm text-slate-500">Persona</p>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div 
                        className={`flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(goal) ? 'border-green-500 bg-green-500/10' : ''}`}
                        onClick={() => setIsGoalOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border ${isCompleted(goal) ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isCompleted(goal) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(goal) ? 'Goal Set' : 'Add'}</p>
                            <p className="text-sm text-slate-500">Goal</p>
                        </div>
                    </div>

                    {/* Add Visual Guide */}
                    <div 
                        className={`flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(visualGuide) ? 'border-green-500 bg-green-500/10' : ''}`}
                        onClick={() => setIsVisualGuideOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border ${isCompleted(visualGuide) ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isCompleted(visualGuide) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(visualGuide) ? 'Guide Set' : 'Add'}</p>
                            <p className="text-sm text-slate-500">Visual Guide</p>
                        </div>
                    </div>

                </div>

                
                {/* Right Side: Is the "imagine" button that triggers the generative to start with all of the added context -------------------------------- */}
                                 <button 
                     className={`px-8 h-12 rounded-lg border text-sm font-semibold transition-all duration-200 flex items-center gap-3 ${
                         isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)
                             ? isGenerating 
                                 ? 'bg-blue-600 border-blue-500 text-white cursor-wait'
                                 : 'bg-blue-600 border-blue-500 hover:bg-blue-700 cursor-pointer text-white'
                             : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                     }`}
                     disabled={!(isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)) || isGenerating}
                     onClick={handleGenerateTacticsProgressively}
                 >
                     {isGenerating ? (
                         <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span className="font-mono tracking-wider">INTEL GATHERING...</span>
                         </>
                     ) : (
                         <>
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                             </svg>
                             <span className="font-mono tracking-wider">Imagine</span>
                         </>
                     )}
                 </button>

            </div>

            {/* Error Display */}
            {generationError && (
                <div className="mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{generationError}</p>
                </div>
            )}

            {/* Inpo Card Section: The generated inspo cards are displayed here -------------------------------- */}
            <div className='mx-8 h-[calc(100vh-80px)] grid grid-cols-2 grid-rows-2 gap-4 p-8'>
                
                {/* Generated Card 1 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => tactics[0] && handleTacticClick(tactics[0])}
                >
                    {cardLoadingStates[0].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-slate-950 border-2 border-dashed border-slate-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section Loading */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label Skeleton */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 animate-pulse">
                                        <div className="h-4 w-12 bg-white/20 rounded mb-1"></div>
                                        <div className="h-3 w-16 bg-white/20 rounded"></div>
                                    </div>
                                    
                                    {/* Action Icons Skeleton */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Center Loading Spinner with Progress */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white text-sm font-medium font-mono tracking-wider">
                                                <TypewriterText 
                                                    text={cardLoadingStates[0].stage}
                                                    speed={30}
                                                />
                                            </div>
                                            <div className="w-48 bg-slate-800 rounded-full h-2">
                                                <div 
                                                    className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${cardLoadingStates[0].progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section Loading */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : tactics[0] ? (
                        <>
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src={validateAndSanitizeImageData(tactics[0].image) 
                                        ? getImageSrc(tactics[0].image)! 
                                        : `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+1`} 
                                    alt={tactics[0].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/1792x1024/64748b/ffffff?text=Image+Error';
                                        console.warn('Image failed to load for Tactic 1');
                                    }}
                                    onLoad={() => {
                                        console.log('Tactic 1 image loaded successfully');
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            
                            {/* Content Overlay */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label */}
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[0].platform}</p>
                                    </div>
                                    
                                    {/* Action Icons */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{tactics[0].title}</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed">{tactics[0].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-950 border-2 border-dashed border-slate-700">
                            <p className="text-slate-500 text-sm">Tactic 1 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 2 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => tactics[1] && handleTacticClick(tactics[1])}
                >
                    {cardLoadingStates[1].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-slate-950 border-2 border-dashed border-slate-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '0.5s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section Loading */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label Skeleton */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 animate-pulse">
                                        <div className="h-4 w-12 bg-white/20 rounded mb-1"></div>
                                        <div className="h-3 w-16 bg-white/20 rounded"></div>
                                    </div>
                                    
                                    {/* Action Icons Skeleton */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Center Loading Spinner with Progress */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white text-sm font-medium font-mono tracking-wider">
                                                <TypewriterText 
                                                    text={cardLoadingStates[1].stage}
                                                    speed={30}
                                                />
                                            </div>
                                            <div className="w-48 bg-slate-800 rounded-full h-2">
                                                <div 
                                                    className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${cardLoadingStates[1].progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section Loading */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : tactics[1] ? (
                        <>
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src={getImageSrc(tactics[1].image) || `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+2`} 
                                    alt={tactics[1].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/1792x1024/64748b/ffffff?text=Image+Error';
                                    }}
                                    onLoad={() => {
                                        console.log('Tactic 2 image loaded successfully');
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            
                            {/* Content Overlay */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label */}
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[1].platform}</p>
                                    </div>
                                    
                                    {/* Action Icons */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{tactics[1].title}</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed">{tactics[1].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-950 border-2 border-dashed border-slate-700">
                            <p className="text-slate-500 text-sm">Tactic 2 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 3 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => tactics[2] && handleTacticClick(tactics[2])}
                >
                    {cardLoadingStates[2].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-slate-950 border-2 border-dashed border-slate-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section Loading */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label Skeleton */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 animate-pulse">
                                        <div className="h-4 w-12 bg-white/20 rounded mb-1"></div>
                                        <div className="h-3 w-16 bg-white/20 rounded"></div>
                                    </div>
                                    
                                    {/* Action Icons Skeleton */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Center Loading Spinner with Progress */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white text-sm font-medium font-mono tracking-wider">
                                                <TypewriterText 
                                                    text={cardLoadingStates[2].stage}
                                                    speed={30}
                                                />
                                            </div>
                                            <div className="w-48 bg-slate-800 rounded-full h-2">
                                                <div 
                                                    className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${cardLoadingStates[2].progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section Loading */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : tactics[2] ? (
                        <>
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src={getImageSrc(tactics[2].image) || `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+3`} 
                                    alt={tactics[2].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/1792x1024/64748b/ffffff?text=Image+Error';
                                    }}
                                    onLoad={() => {
                                        console.log('Tactic 3 image loaded successfully');
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            
                            {/* Content Overlay */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label */}
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[2].platform}</p>
                                    </div>
                                    
                                    {/* Action Icons */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{tactics[2].title}</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed">{tactics[2].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-950 border-2 border-dashed border-slate-700">
                            <p className="text-slate-500 text-sm">Tactic 3 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 4 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => tactics[3] && handleTacticClick(tactics[3])}
                >
                    {cardLoadingStates[3].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-slate-950 border-2 border-dashed border-slate-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section Loading */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label Skeleton */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 animate-pulse">
                                        <div className="h-4 w-12 bg-white/20 rounded mb-1"></div>
                                        <div className="h-3 w-16 bg-white/20 rounded"></div>
                                    </div>
                                    
                                    {/* Action Icons Skeleton */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Center Loading Spinner with Progress */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-white text-sm font-medium font-mono tracking-wider">
                                                <TypewriterText 
                                                    text={cardLoadingStates[3].stage}
                                                    speed={30}
                                                />
                                            </div>
                                            <div className="w-48 bg-slate-800 rounded-full h-2">
                                                <div 
                                                    className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${cardLoadingStates[3].progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section Loading */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ) : tactics[3] ? (
                        <>
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src={getImageSrc(tactics[3].image) || `https://via.placeholder.com/1792x1024/64748b/ffffff?text=Tactic+4`} 
                                    alt={tactics[3].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/1792x1024/64748b/ffffff?text=Image+Error';
                                    }}
                                    onLoad={() => {
                                        console.log('Tactic 4 image loaded successfully');
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                            
                            {/* Content Overlay */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="flex justify-between items-start">
                                    {/* Platform Label */}
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[3].platform}</p>
                                    </div>
                                    
                                    {/* Action Icons */}
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                                    <h3 className="text-white font-bold text-lg mb-2">{tactics[3].title}</h3>
                                    <p className="text-slate-300 text-xs leading-relaxed">{tactics[3].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-950 border-2 border-dashed border-slate-700">
                            <p className="text-slate-500 text-sm">Tactic 4 will appear here</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Brand Modal */}
            <Modal 
                isOpen={isBrandOpen} 
                onClose={() => setIsBrandOpen(false)}
                title="Add Brand Information"
                description="Enter the brand name and any relevant details about the brand."
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="brand" className="text-white">Brand Name</Label>
                        <Textarea
                            id="brand"
                            value={tempBrand}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempBrand(e.target.value)}
                            placeholder="Enter brand name and details..."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsBrandOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('brand', tempBrand, setBrand, setIsBrandOpen)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Product Modal */}
            <Modal 
                isOpen={isProductOpen} 
                onClose={() => setIsProductOpen(false)}
                title="Add Product Information"
                description="Enter the product name and description."
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="product" className="text-white">Product Name</Label>
                        <Textarea
                            id="product"
                            value={tempProduct}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempProduct(e.target.value)}
                            placeholder="Enter product name and description..."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsProductOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('product', tempProduct, setProduct, setIsProductOpen)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Persona Modal */}
            <Modal 
                isOpen={isPersonaOpen} 
                onClose={() => setIsPersonaOpen(false)}
                title="Define Target Persona"
                description="Describe the target audience persona for this project."
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="persona" className="text-white">Persona Description</Label>
                        <Textarea
                            id="persona"
                            value={tempPersona}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempPersona(e.target.value)}
                            placeholder="Describe the target persona (age, interests, behavior, etc.)..."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsPersonaOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('persona', tempPersona, setPersona, setIsPersonaOpen)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Goal Modal */}
            <Modal 
                isOpen={isGoalOpen} 
                onClose={() => setIsGoalOpen(false)}
                title="Define Project Goal"
                description="What is the main objective for this creative project?"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="goal-intent" className="text-white">What is the intent?</Label>
                        <Textarea
                            id="goal-intent"
                            value={tempGoalIntent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempGoalIntent(e.target.value)}
                            placeholder="Ex. brand awareness, increase sales, ....."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[80px]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="goal-medium" className="text-white">On what medium?</Label>
                        <Textarea
                            id="goal-medium"
                            value={tempGoalMedium}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempGoalMedium(e.target.value)}
                            placeholder="Ex. TikTok"
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[80px]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="goal-message" className="text-white">What is the key message?</Label>
                        <Textarea
                            id="goal-message"
                            value={tempGoalMessage}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempGoalMessage(e.target.value)}
                            placeholder="Ex. Show how the product eliminates repetitive tasks so users can focus on what matters, making their workflow feel effortless and smart"
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsGoalOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleGoalSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Visual Guide Modal */}
            <Modal 
                isOpen={isVisualGuideOpen} 
                onClose={() => setIsVisualGuideOpen(false)}
                title="Add Visual Guide"
                description="Describe the visual style, mood, or reference images for the project."
            >
                <div className="space-y-6">
                    <div>
                        <Label className="text-white">Upload an image for visual reference</Label>
                        <ImageUpload 
                            onImageUpload={setUploadedImage}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="visual-style" className="text-white">What style are you looking for?</Label>
                        <Textarea
                            id="visual-style"
                            value={tempVisualStyle}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempVisualStyle(e.target.value)}
                            placeholder="Ex. This will be a short-form vertical video designed for Instagram Reels and TikTok, blending motion, color, and storytelling to capture attention fast."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="visual-constraints" className="text-white">Are there any constraints?</Label>
                        <Textarea
                            id="visual-constraints"
                            value={tempVisualConstraints}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempVisualConstraints(e.target.value)}
                            placeholder="Ex. Avoid black and white as dominant colors and steer clear of any harsh, high-contrast visuals to keep the tone warm and inviting."
                            className="mt-2 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsVisualGuideOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleVisualGuideSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Tactic Detail Modal */}
            {/*  */}
            <Modal 
                isOpen={isTacticModalOpen} 
                onClose={() => setIsTacticModalOpen(false)}
                title={selectedTactic?.title || "Tactic Details"}
                // description="Complete marketing tactic breakdown and next steps"
                maxWidth="max-w-[80vw]"
            >
                {/* Action Button Stack - Positioned next to close button */}
                <div className="absolute top-6 right-16 z-50 flex gap-2">
                    <button className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Bookmark className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Share className="w-4 h-4 text-white" />
                    </button>
                </div>

                {selectedTactic && (
                    <div className="flex gap-10 max-h-[70vh] overflow-hidden">
                        {/* Left Side - Image */}
                        <div className="w-2/5 flex-shrink-0 shadow-lg">
                            <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden bg-slate-800">
                                <img 
                                    src={validateAndSanitizeImageData(selectedTactic.image) 
                                        ? getImageSrc(selectedTactic.image)! 
                                        : `https://via.placeholder.com/600x400/64748b/ffffff?text=Tactic+Image`} 
                                    alt={selectedTactic.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/600x400/64748b/ffffff?text=Image+Error';
                                    }}
                                />
                                {/* Platform Label */}
                                {/* <div className="absolute top-4 right-4 ">
                                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Platform:</p>
                                        <p className="text-slate-300 text-xs">{selectedTactic.platform}</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* Right Side - Information */}
                        <div className="w-3/5 flex flex-col justify-between overflow-y-auto pr-2">
                            <div className="space-y-6">
                                {/* Title */}
                                {/* <div>
                                    <h2 className="text-white text-2xl font-bold mb-2">"{selectedTactic.title}"</h2>
                                </div> */}

                                {/* Key Information Stack */}
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <p className="text-white text-sm font-semibold">Hook:</p>
                                        <p className="text-slate-300 text-sm">{selectedTactic.oneLinerSummary}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <p className="text-white text-sm font-semibold">Core Message:</p>
                                        <p className="text-slate-400 text-sm">{selectedTactic.coreMessage}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <p className="text-white text-sm font-semibold">Goal:</p>
                                        <p className="text-slate-300 text-sm">{selectedTactic.goal}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <p className="text-white text-sm font-semibold">Primary Tactic:</p>
                                        <p className="text-slate-300 text-sm">{selectedTactic.platform}</p>
                                    </div>
                                </div>

                                {/* divider */}
                                <div className="h-px bg-slate-800 w-full"></div>

                                {/* Description Section */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3">Description:</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedTactic.fullDescription}</p>
                                </div>

                                {/* Why This Works Section */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3">Why This Works:</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedTactic.whyItWorks}</p>
                                </div>
                            </div>

                            {/* Action Buttons at Bottom */}
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generate User Experience
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generate Creative Brief
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    )
}