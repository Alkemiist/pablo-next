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
import { Bookmark, Download, Share, Bubbles, RotateCcw } from "lucide-react";

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
    
    // Image regeneration state
    const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

    // Guided generation state
    const [generatedSections, setGeneratedSections] = useState<any[]>([]);
    const [isGeneratingFrames, setIsGeneratingFrames] = useState(false);
    const [currentGenerationType, setCurrentGenerationType] = useState<'user-experience' | 'creative-brief' | 'moodboard' | 'marketing-brief' | null>(null);
    const [frameGenerationError, setFrameGenerationError] = useState<string | null>(null);

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
        // Clear any existing generated sections when opening a new tactic
        setGeneratedSections([]);
        setCurrentGenerationType(null);
        setFrameGenerationError(null);
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
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    updateCardLoadingState(cardIndex, 'Analyzing target demographics', 15);
                    
                    await new Promise(resolve => setTimeout(resolve, 1400));
                    updateCardLoadingState(cardIndex, 'Cross-referencing brand data', 25);
                    
                    await new Promise(resolve => setTimeout(resolve, 1200));
                    updateCardLoadingState(cardIndex, 'Generating tactical concept', 40);
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    updateCardLoadingState(cardIndex, 'Requesting visual asset', 55);
                    
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

                    updateCardLoadingState(cardIndex, 'Rendering high-res image', 75);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const tacticsData = await tacticsResponse.json();
                    const finalTactic = tacticsData.tactics[0]; // Get the single tactic with image

                    updateCardLoadingState(cardIndex, 'Compiling final intelligence', 90);
                    await new Promise(resolve => setTimeout(resolve, 800));

                    updateCardLoadingState(cardIndex, 'Tactical brief complete!', 100);
                    
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

    // Function to regenerate image for selected tactic
    const handleRegenerateImage = async () => {
        if (!selectedTactic) return;

        setIsRegeneratingImage(true);
        setGenerationError(null);

        try {
            // Find the index of the selected tactic in the tactics array
            const tacticIndex = tactics.findIndex(tactic => tactic.title === selectedTactic.title);
            
            if (tacticIndex === -1) {
                throw new Error('Tactic not found in current tactics array');
            }

            // Generate new image for this specific tactic
            const response = await fetch('/api/generate-tactics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brand,
                    product,
                    persona,
                    goal,
                    visualGuide,
                    cardIndex: tacticIndex,
                    generateSingle: true,
                    regenerateImageOnly: true // Add flag to indicate we only want new image
                })
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate image');
            }

            const data = await response.json();
            const updatedTactic = { ...selectedTactic, image: data.tactics[0].image };

            // Update the tactics array
            setTactics(prev => {
                const newTactics = [...prev];
                newTactics[tacticIndex] = updatedTactic;
                return newTactics;
            });

            // Update the selected tactic in the modal
            setSelectedTactic(updatedTactic);

        } catch (error) {
            console.error('Error regenerating image:', error);
            setGenerationError('Failed to regenerate image. Please try again.');
        } finally {
            setIsRegeneratingImage(false);
        }
    };

    // Function to generate guided frame breakdown
    const handleGenerateFrames = async (type: 'user-experience' | 'creative-brief' | 'moodboard' | 'marketing-brief', sectionIdToReplace?: number) => {
        if (!selectedTactic) return;

        setIsGeneratingFrames(true);
        setCurrentGenerationType(type);
        setFrameGenerationError(null);

        try {
            // For moodboard and marketing-brief, always use mock data for now
            let frames;
            if (type === 'moodboard' || type === 'marketing-brief') {
                console.log('Generating', type, 'using mock data');
                frames = await generateMockFrames(type, selectedTactic);
            } else {
                // Try API call for other types
                const response = await fetch('/api/generate-frames', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tactic: selectedTactic,
                        brand,
                        product,
                        persona,
                        goal,
                        visualGuide,
                        generationType: type
                    })
                });

                if (!response.ok) {
                    // For now, generate mock data if API doesn't exist
                    frames = await generateMockFrames(type, selectedTactic);
                } else {
                    const data = await response.json();
                    frames = data.frames || [];
                }
            }

            // Create a new section with generated frames
            const getSectionTitle = (type: string) => {
                switch(type) {
                    case 'user-experience': return 'User Experience Breakdown';
                    case 'creative-brief': return 'Creative Brief Framework';
                    case 'moodboard': return 'Visual Moodboard';
                    case 'marketing-brief': return 'Marketing Brief';
                    default: return 'Generated Content';
                }
            };

            const newSection = {
                id: sectionIdToReplace || Date.now(),
                type,
                frames,
                title: getSectionTitle(type)
            };

            if (sectionIdToReplace) {
                // Replace existing section
                console.log('Replacing section with ID:', sectionIdToReplace);
                console.log('New section:', newSection);
                setGeneratedSections(prev => {
                    console.log('Previous sections:', prev);
                    const updated = prev.map(section => 
                        section.id === sectionIdToReplace ? newSection : section
                    );
                    console.log('Updated sections:', updated);
                    return updated;
                });
            } else {
                // Add new section
                console.log('Adding new section:', newSection);
                setGeneratedSections(prev => [...prev, newSection]);
            }

        } catch (error) {
            console.error('Error generating frames:', error);
            // Generate mock data as fallback
            const mockFrames = await generateMockFrames(type, selectedTactic);
            
            const getSectionTitle = (type: string) => {
                switch(type) {
                    case 'user-experience': return 'User Experience Breakdown';
                    case 'creative-brief': return 'Creative Brief Framework';
                    case 'moodboard': return 'Visual Moodboard';
                    case 'marketing-brief': return 'Marketing Brief';
                    default: return 'Generated Content';
                }
            };

            const newSection = {
                id: sectionIdToReplace || Date.now(),
                type,
                frames: mockFrames,
                title: getSectionTitle(type)
            };

            if (sectionIdToReplace) {
                // Replace existing section (catch block)
                console.log('Replacing section with ID (catch):', sectionIdToReplace);
                console.log('New section (catch):', newSection);
                setGeneratedSections(prev => {
                    console.log('Previous sections (catch):', prev);
                    const updated = prev.map(section => 
                        section.id === sectionIdToReplace ? newSection : section
                    );
                    console.log('Updated sections (catch):', updated);
                    return updated;
                });
            } else {
                // Add new section
                console.log('Adding new section (catch):', newSection);
                setGeneratedSections(prev => [...prev, newSection]);
            }
        } finally {
            setIsGeneratingFrames(false);
            setCurrentGenerationType(null);
        }
    };

    // Mock frame generation for demonstration - now uses specific tactic data
    const generateMockFrames = async (type: 'user-experience' | 'creative-brief' | 'moodboard' | 'marketing-brief', tactic: Tactic): Promise<any[]> => {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (type === 'user-experience') {
            return [
                {
                    id: 1,
                    title: "Opening Hook",
                    role: "Attention Grabber", 
                    visual: `${tactic.platform} video opens with: ${tactic.oneLinerSummary}. Focus on ${brand} ${product} in context relevant to the target persona.`,
                    audio: `Background music that matches ${tactic.platform} trends and resonates with the target demographic`,
                    text: `Hook text: "${tactic.oneLinerSummary}"`
                },
                {
                    id: 2,
                    title: "Core Message Delivery",
                    role: "Value Proposition",
                    visual: `Show ${product} in action, demonstrating: ${tactic.coreMessage}. Visual storytelling emphasizes the key benefits.`,
                    audio: "Music builds to emphasize the core message delivery",
                    text: `"${tactic.coreMessage}"`
                },
                {
                    id: 3,
                    title: "Call to Action",
                    role: "Conversion Driver",
                    visual: `Clear visual of ${product} with ${brand} branding. End frame optimized for ${tactic.platform} with clear next steps.`,
                    audio: "Music outro that leaves memorable impression",
                    text: `"Learn more about ${product}" or platform-specific CTA`
                }
            ];
        } else if (type === 'creative-brief') {
            return [{
                id: 1,
                type: 'document',
                title: "Creative Brief",
                content: {
                    projectName: `${brand} ${product} - ${tactic.title}`,
                    briefOverview: `This creative brief outlines the strategic direction for ${brand}'s ${product} campaign, specifically designed for ${tactic.platform} to achieve ${tactic.goal}.`,
                    
                    objective: `${tactic.goal}`,
                    
                    targetAudience: `${persona}`,
                    
                    keyMessage: `${tactic.coreMessage}`,
                    
                    creativeConcept: `${tactic.fullDescription}`,
                    
                    toneAndStyle: `The creative should embody ${tactic.oneLinerSummary}. ${visualGuide}`,
                    
                    platformConsiderations: `Optimized for ${tactic.platform} with content that leverages platform-specific features and user behaviors.`,
                    
                    whyThisWorks: `${tactic.whyItWorks}`,
                    
                    mandatoryElements: [
                        `${brand} branding integration`,
                        `${product} feature highlights`,
                        `Clear call-to-action`,
                        `Platform-appropriate format for ${tactic.platform}`
                    ],
                    
                    successCriteria: `Campaign success will be measured by ${tactic.goal} achievement, with content performance optimized for ${tactic.platform} engagement metrics.`
                }
            }];
        } else if (type === 'moodboard') {
            return [{
                id: 1,
                type: 'moodboard',
                title: "Visual Moodboard",
                content: {
                    overview: `Visual direction for ${brand} ${product} campaign emphasizing ${tactic.oneLinerSummary}`,
                    
                    colorPalette: {
                        primary: "#2563eb", // Professional blue
                        secondary: "#7c3aed", // Creative purple  
                        accent: "#059669", // Success green
                        neutral: "#64748b" // Sophisticated gray
                    },
                    
                    toneAndStyle: `${tactic.whyItWorks} The visual language should feel premium, aspirational, and authentic to resonate with ${persona}.`,
                    
                    visualElements: [
                        {
                            id: 1,
                            title: "Hero Composition",
                            category: "Primary Visual",
                            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop&crop=center",
                            description: `Main campaign visual showcasing ${brand} ${product} in premium lifestyle context`,
                            attributes: ["Premium feel", "Aspirational lifestyle", "Clean composition", "Strong brand presence"]
                        },
                        {
                            id: 2,
                            title: "Color & Atmosphere",
                            category: "Mood & Tone",
                            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center",
                            description: `Atmospheric elements that support ${tactic.coreMessage} and platform optimization for ${tactic.platform}`,
                            attributes: ["Warm undertones", "Natural lighting", "Emotional resonance", "Platform-optimized"]
                        },
                        {
                            id: 3,
                            title: "Product Integration",
                            category: "Brand Elements",
                            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop&crop=center",
                            description: `Strategic product placement emphasizing key benefits and features`,
                            attributes: ["Clear product focus", "Benefit demonstration", "Quality emphasis", "Brand integration"]
                        },
                        {
                            id: 4,
                            title: "Lifestyle Context",
                            category: "Audience Connection",
                            image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=400&fit=crop&crop=center",
                            description: `Target audience lifestyle representation supporting the campaign narrative`,
                            attributes: ["Authentic moments", "Relatable scenarios", "Aspirational lifestyle", "Emotional connection"]
                        }
                    ],
                    
                    designPrinciples: [
                        "Clean, uncluttered compositions",
                        "Consistent color temperature",
                        "Premium materials and textures",
                        "Natural, authentic moments",
                        `Optimized for ${tactic.platform} format`
                    ],
                    
                    applicationNotes: `${visualGuide} Apply this visual direction consistently across all campaign touchpoints to maintain brand coherence and maximize ${tactic.goal} achievement.`
                }
            }];
        } else { // marketing-brief
            return [{
                id: 1,
                type: 'document',
                title: "Marketing Brief",
                content: {
                    projectTitle: `${brand} ${product} Marketing Campaign`,
                    campaignName: `${tactic.title}`,
                    
                    executiveSummary: `This marketing brief presents a comprehensive strategy for ${brand}'s ${product} campaign. The initiative focuses on ${tactic.goal} through strategic ${tactic.platform} content that leverages ${tactic.oneLinerSummary} to drive meaningful engagement with our target audience.`,
                    
                    brandOverview: {
                        brand: `${brand}`,
                        product: `${product}`,
                        positioning: `${brand} positions ${product} as a premium solution that delivers exceptional value and experience.`
                    },
                    
                    marketingObjectives: [
                        `Primary: ${tactic.goal}`,
                        `Platform Focus: Drive engagement on ${tactic.platform}`,
                        `Brand Awareness: Increase ${brand} recognition`,
                        `Product Adoption: Encourage ${product} consideration`
                    ],
                    
                    targetAudienceProfile: `${persona}`,
                    
                    keyInsight: `${tactic.whyItWorks}`,
                    
                    strategicApproach: `${tactic.fullDescription}`,
                    
                    coreMessaging: {
                        primaryMessage: `${tactic.coreMessage}`,
                        supportingMessages: [
                            `${tactic.oneLinerSummary}`,
                            `Quality and reliability of ${product}`,
                            `${brand}'s commitment to customer satisfaction`
                        ]
                    },
                    
                    channelStrategy: `Primary channel: ${tactic.platform}. Content will be optimized for platform-specific engagement patterns and user behaviors.`,
                    
                    creativeDirection: `${visualGuide}`,
                    
                    successMetrics: [
                        `${tactic.goal} achievement`,
                        `${tactic.platform} engagement rates`,
                        `Brand awareness lift`,
                        `Conversion tracking`,
                        `Content performance optimization`
                    ],
                    
                    timeline: "Campaign launch aligned with strategic marketing calendar and platform optimization windows.",
                    
                    budget: "Resource allocation optimized for maximum ROI on primary channel with supporting cross-platform amplification."
                }
            }];
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
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(brand) ? 'border-slate-800' : 'border-slate-800'}`}
                        onClick={() => setIsBrandOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(brand) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-800 border-slate-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(brand) ? brand : 'Select'}</p>
                            <p className="text-sm text-slate-500">Brand</p>
                        </div>
                    </div>

                    {/* Select Product */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(product) ? 'border-slate-800' : 'border-slate-800'}`}
                        onClick={() => setIsProductOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(product) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-800 border-slate-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(product) ? product : 'Select'}</p>
                            <p className="text-sm text-slate-500">Product</p>
                        </div>
                    </div>

                    {/* Select Persona */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(persona) ? 'border-slate-800' : 'border-slate-800'}`}
                        onClick={() => setIsPersonaOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(persona) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-800 border-slate-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(persona) ? 'Persona Set' : 'Select'}</p>
                            <p className="text-sm text-slate-500">Persona</p>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(goal) ? 'border-slate-800' : 'border-slate-800'}`}
                        onClick={() => setIsGoalOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(goal) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-800 border-slate-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(goal) ? 'Goal Set' : 'Add'}</p>
                            <p className="text-sm text-slate-500">Goal</p>
                        </div>
                    </div>

                    {/* Add Visual Guide */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-slate-800 transition-colors ${isCompleted(visualGuide) ? 'border-slate-800' : 'border-slate-800'}`}
                        onClick={() => setIsVisualGuideOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(visualGuide) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-800 border-slate-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(visualGuide) ? 'Guide Set' : 'Add'}</p>
                            <p className="text-sm text-slate-500">Visual Guide</p>
                        </div>
                    </div>

                </div>

                
                {/* Right Side: Is the "imagine" button that triggers the generative to start with all of the added context -------------------------------- */}
                                 <button 
                     className={`relative px-8 h-12 rounded-xl border text-sm font-semibold transition-all duration-500 ease-in-out flex items-center gap-3 overflow-hidden ${
                         isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)
                             ? 'border-transparent text-white group' + (isGenerating ? ' cursor-wait' : ' cursor-pointer')
                             : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                     }`}
                     disabled={!(isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)) || isGenerating}
                     onClick={handleGenerateTacticsProgressively}
                 >
                     {/* Animated Background for enabled state */}
                     {isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide) && (
                         <>
                             {/* Base gradient layer */}
                             <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-pulse opacity-90"></div>
                             
                             {/* Rotating gradient layer */}
                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-spin opacity-40" style={{animationDuration: '8s'}}></div>
                             
                             {/* Pulsing outer glow */}
                             <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 via-cyan-400 to-blue-500 rounded-xl blur-xl animate-pulse opacity-50" style={{animationDuration: '2s'}}></div>
                             
                             {/* Secondary rotating glow */}
                             <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg animate-spin opacity-30" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
                         </>
                     )}
                     <div className="relative z-10 flex items-center gap-3 transition-all duration-500 ease-in-out">
                         {isGenerating ? (
                             <>
                                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                 <span className="font-mono tracking-wider transition-all duration-500 ease-in-out">Dreaming Ideas</span>
                             </>
                         ) : (
                             <>
                                 {/* <Bubbles className="w-4 h-4" /> */}
                                 <span className="font-mono tracking-wider transition-all duration-500 ease-in-out">Imagine</span>
                             </>
                         )}
                     </div>
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
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[0] && handleTacticClick(tactics[0])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
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
                                {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div> */}
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[0].platform}</p>
                                    </div>

                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-lg">{tactics[0].title}</h3>
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
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[1] && handleTacticClick(tactics[1])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
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
                                {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div> */}
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[1].platform}</p>
                                    </div>
                                    
                                    {/* share button: Invisible at the moment */}
                                    {/* <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/30 border border-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div> */}

                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-lg">{tactics[1].title}</h3>
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
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[2] && handleTacticClick(tactics[2])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
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
                                {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div> */}
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[2].platform}</p>
                                    </div>
                                    
                                    {/* share button: Invisible at the moment */}
                                    {/* <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/30 border border-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div> */}

                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-lg">{tactics[2].title}</h3>
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
                    className="relative rounded-lg overflow-hidden shadow-lg bg-slate-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[3] && handleTacticClick(tactics[3])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
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
                                {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                                    <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-white/20 rounded mb-1"></div>
                                    <div className="h-4 w-2/3 bg-white/20 rounded"></div>
                                </div> */}
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-slate-300 text-xs">{tactics[3].platform}</p>
                                    </div>
                                    
                                    {/* share button: Invisible at the moment */}
                                    {/* <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-black/30 border border-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </div>
                                    </div> */}

                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-lg">{tactics[3].title}</h3>
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
                onClose={() => {
                    setIsTacticModalOpen(false);
                    // Clear generated sections when closing modal
                    setGeneratedSections([]);
                    setCurrentGenerationType(null);
                    setFrameGenerationError(null);
                    setIsGeneratingFrames(false);
                }}
                title={selectedTactic?.title ? `"${selectedTactic.title}"` : "Tactic Details"}
                // description="Complete marketing tactic breakdown and next steps"
                maxWidth="max-w-[80vw]"
            >
                {/* Action Button Stack - Positioned next to close button */}
                <div className="absolute top-6 right-16 z-50 flex gap-2">
                    <button className="w-8 h-8 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Bookmark className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Share className="w-4 h-4 text-white" />
                    </button>
                </div>

                {selectedTactic && (
                    <div className="max-h-[80vh] overflow-y-auto pr-2">
                        <div className="flex gap-10 mb-8">
                            {/* Left Side - Image */}
                            <div className="w-2/5 flex-shrink-0 shadow-lg">
                                <div className="relative h-[600px] rounded-lg overflow-hidden bg-slate-800">
                                    <img 
                                        src={validateAndSanitizeImageData(selectedTactic.image) 
                                            ? getImageSrc(selectedTactic.image)! 
                                            : `https://via.placeholder.com/600x400/64748b/ffffff?text=Tactic+Image`} 
                                        alt={selectedTactic.title}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                                            isRegeneratingImage ? 'opacity-50' : 'opacity-100'
                                        }`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/600x400/64748b/ffffff?text=Image+Error';
                                        }}
                                    />
                                    
                                    {/* Loading Overlay */}
                                    {isRegeneratingImage && (
                                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                                                <p className="text-blue-400 text-sm font-medium">Regenerating image...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Regenerate Image Button */}
                                    <button 
                                        className={`absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10 ${
                                            isRegeneratingImage 
                                                ? 'bg-blue-600 cursor-wait' 
                                                : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
                                        }`}
                                        onClick={handleRegenerateImage}
                                        disabled={isRegeneratingImage}
                                        title={isRegeneratingImage ? "Regenerating..." : "Regenerate Image"}
                                    >
                                        {isRegeneratingImage ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right Side - Information */}
                            <div className="w-3/5 flex flex-col justify-between overflow-y-auto pr-2">
                                <div className="space-y-6">
                                    {/* Key Information Stack */}
                                    <div className="space-y-4">
                                        {/* Primary Tactic */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Primary Tactic:</p>
                                            <p className="text-slate-500 text-sm">{selectedTactic.platform}</p>
                                        </div>

                                        {/* Hook */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Hook:</p>
                                            <p className="text-slate-500 text-sm">{selectedTactic.oneLinerSummary}</p>
                                        </div>

                                        {/* Goal */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Goal:</p>
                                            <p className="text-slate-500 text-sm">{selectedTactic.goal}</p>
                                        </div>

                                        {/* Core Message */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Core Message:</p>
                                            <p className="text-slate-500 text-sm">{selectedTactic.coreMessage}</p>
                                        </div>
                                    </div>

                                    {/* divider */}
                                    <div className="h-px bg-slate-800 w-full"></div>

                                    {/* Description Section */}
                                    <div>
                                        <h4 className="text-white font-semibold mb-3">Description:</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{selectedTactic.fullDescription}</p>
                                    </div>

                                    {/* Why This Works Section */}
                                    <div>
                                        <h4 className="text-white font-semibold mb-3">Øpus POV:</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{selectedTactic.whyItWorks}</p>
                                    </div>
                                </div>

                                {/* Action Buttons at Bottom */}
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleGenerateFrames('user-experience')}
                                            disabled={isGeneratingFrames}
                                        >
                                            {isGeneratingFrames && currentGenerationType === 'user-experience' ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Generating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Generate User Experience
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleGenerateFrames('creative-brief')}
                                            disabled={isGeneratingFrames}
                                        >
                                            {isGeneratingFrames && currentGenerationType === 'creative-brief' ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Generating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Generate Creative Brief
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Display for Frame Generation */}
                        {frameGenerationError && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{frameGenerationError}</p>
                            </div>
                        )}

                        {/* Generated Sections */}
                        {generatedSections.map((section, sectionIndex) => (
                            <div key={section.id} className="mt-8 pt-8 border-t border-slate-800">
                                {/* Section Header with Controls */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <h3 className="text-white text-lg font-semibold">{section.title}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center"
                                            onClick={() => {
                                                console.log('Regenerating section:', section.type, section.id);
                                                handleGenerateFrames(section.type as 'user-experience' | 'creative-brief' | 'moodboard' | 'marketing-brief', section.id);
                                            }}
                                            title="Regenerate section"
                                        >
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        </button>
                                        <button 
                                            className="w-8 h-8 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center"
                                            onClick={() => setGeneratedSections(prev => prev.filter(s => s.id !== section.id))}
                                            title="Remove section"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Content Display Based on Type */}
                                {section.frames[0]?.type === 'document' ? (
                                    /* Document Layout for Creative & Marketing Briefs */
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                                        {section.type === 'creative-brief' ? (
                                            /* Creative Brief Document */
                                            <div className="space-y-6">
                                                <div className="border-b border-slate-700 pb-4">
                                                    <h2 className="text-xl font-bold text-white mb-2">{section.frames[0].content.projectName}</h2>
                                                    <p className="text-slate-300 text-sm leading-relaxed">{section.frames[0].content.briefOverview}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Objective</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.objective}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Target Audience</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.targetAudience}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Key Message</h4>
                                                            <p className="text-slate-300 text-sm font-medium italic">"{section.frames[0].content.keyMessage}"</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Creative Concept</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.creativeConcept}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Tone & Style</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.toneAndStyle}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Platform Considerations</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.platformConsiderations}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-700 pt-4">
                                                    <div className="mb-4">
                                                        <h4 className="text-white font-semibold mb-2">Why This Works</h4>
                                                        <p className="text-slate-300 text-sm">{section.frames[0].content.whyThisWorks}</p>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Mandatory Elements</h4>
                                                            <ul className="text-slate-300 text-sm space-y-1">
                                                                                                                                 {(section.frames[0].content.mandatoryElements as string[]).map((element: string, index: number) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-blue-400 mt-1">•</span>
                                                                        {element}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Success Criteria</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.successCriteria}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Marketing Brief Document */
                                            <div className="space-y-6">
                                                <div className="border-b border-slate-700 pb-4">
                                                    <h2 className="text-xl font-bold text-white mb-1">{section.frames[0].content.projectTitle}</h2>
                                                    <h3 className="text-lg text-blue-400 mb-3">Campaign: {section.frames[0].content.campaignName}</h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed">{section.frames[0].content.executiveSummary}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Brand Overview</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><span className="text-blue-400">Brand:</span> <span className="text-slate-300">{section.frames[0].content.brandOverview.brand}</span></p>
                                                                <p><span className="text-blue-400">Product:</span> <span className="text-slate-300">{section.frames[0].content.brandOverview.product}</span></p>
                                                                <p className="text-slate-300">{section.frames[0].content.brandOverview.positioning}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Marketing Objectives</h4>
                                                            <ul className="text-slate-300 text-sm space-y-1">
                                                                                                                                 {(section.frames[0].content.marketingObjectives as string[]).map((objective: string, index: number) => (
                                                                     <li key={index} className="flex items-start gap-2">
                                                                         <span className="text-green-400 mt-1">•</span>
                                                                         {objective}
                                                                     </li>
                                                                 ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Target Audience</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.targetAudienceProfile}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Key Insight</h4>
                                                            <p className="text-slate-300 text-sm italic">{section.frames[0].content.keyInsight}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Strategic Approach</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.strategicApproach}</p>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Core Messaging</h4>
                                                            <div className="space-y-2">
                                                                <p className="text-slate-300 text-sm"><span className="text-purple-400 font-medium">Primary:</span> "{section.frames[0].content.coreMessaging.primaryMessage}"</p>
                                                                <div>
                                                                    <p className="text-purple-400 font-medium text-sm mb-1">Supporting Messages:</p>
                                                                    <ul className="text-slate-300 text-sm space-y-1">
                                                                                                                                                 {(section.frames[0].content.coreMessaging.supportingMessages as string[]).map((message: string, index: number) => (
                                                                             <li key={index} className="flex items-start gap-2">
                                                                                 <span className="text-purple-400 mt-1">•</span>
                                                                                 {message}
                                                                             </li>
                                                                         ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-700 pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Channel Strategy</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.channelStrategy}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Creative Direction</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.creativeDirection}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Success Metrics</h4>
                                                            <ul className="text-slate-300 text-sm space-y-1">
                                                                {section.frames[0].content.successMetrics.map((metric: string, index: number) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-orange-400 mt-1">•</span>
                                                                        {metric}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Timeline</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.timeline}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Budget</h4>
                                                            <p className="text-slate-300 text-sm">{section.frames[0].content.budget}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : section.frames[0]?.type === 'moodboard' ? (
                                    /* Moodboard Layout */
                                    <div className="space-y-6">
                                        {/* Moodboard Overview */}
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <div className="mb-6">
                                                <h3 className="text-white font-semibold mb-2">Visual Direction</h3>
                                                <p className="text-slate-300 text-sm mb-4">{section.frames[0].content.overview}</p>
                                                <p className="text-slate-300 text-sm italic">{section.frames[0].content.toneAndStyle}</p>
                                            </div>

                                            {/* Color Palette */}
                                            <div className="mb-6">
                                                <h4 className="text-white font-semibold mb-3">Color Palette</h4>
                                                <div className="flex gap-4">
                                                    {Object.entries(section.frames[0].content.colorPalette).map(([name, color]) => (
                                                        <div key={name} className="flex flex-col items-center">
                                                            <div 
                                                                className="w-12 h-12 rounded-lg border border-slate-600 mb-2"
                                                                style={{ backgroundColor: color as string }}
                                                            ></div>
                                                            <span className="text-slate-400 text-xs capitalize">{name}</span>
                                                            <span className="text-slate-500 text-xs font-mono">{color}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Design Principles */}
                                            <div>
                                                <h4 className="text-white font-semibold mb-2">Design Principles</h4>
                                                <ul className="text-slate-300 text-sm space-y-1">
                                                    {section.frames[0].content.designPrinciples.map((principle: string, index: number) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-blue-400 mt-1">•</span>
                                                            {principle}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Visual Elements - Horizontal Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {section.frames[0].content.visualElements.map((element: any) => (
                                                <div key={element.id} className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
                                                    {/* Horizontal Image */}
                                                    <div className="aspect-[2/1] bg-slate-800 relative">
                                                        <img 
                                                            src={element.image} 
                                                            alt={element.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                                            <h5 className="text-white font-semibold text-sm">{element.title}</h5>
                                                            <p className="text-slate-300 text-xs">{element.category}</p>
                                                        </div>
                                                    </div>
                                                    {/* Element Details */}
                                                    <div className="p-4">
                                                        <p className="text-slate-300 text-xs leading-relaxed mb-3">{element.description}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {element.attributes.map((attr: string, index: number) => (
                                                                <span key={index} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                                                                    {attr}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Application Notes */}
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                            <h4 className="text-white font-semibold mb-2">Application Notes</h4>
                                            <p className="text-slate-300 text-sm leading-relaxed">{section.frames[0].content.applicationNotes}</p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard User Experience Frame Layout */
                                    <div className="space-y-6">
                                        {section.frames.map((frame: any, index: number) => (
                                            <div key={frame.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                                {/* Frame Header */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold text-base">
                                                            🎬 Frame {index + 1}: {frame.title}
                                                        </h4>
                                                        <p className="text-slate-400 text-sm">{frame.role}</p>
                                                    </div>
                                                </div>

                                                {/* Frame Details Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Visual */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="text-blue-400 text-sm font-medium">Visual:</span>
                                                        </div>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{frame.visual}</p>
                                                    </div>

                                                    {/* Audio */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V8a1 1 0 011-1h1m0 0a1 1 0 011 1v3a1 1 0 01-1 1H9m0 0H6m3 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1m1 0H5" />
                                                            </svg>
                                                            <span className="text-green-400 text-sm font-medium">Audio:</span>
                                                        </div>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{frame.audio}</p>
                                                    </div>

                                                    {/* Text */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                            </svg>
                                                            <span className="text-purple-400 text-sm font-medium">Text:</span>
                                                        </div>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{frame.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Bottom CTA Buttons - Always at the bottom */}
                        {(() => {
                            // Get existing section types
                            const existingTypes = generatedSections.map(section => section.type);
                            
                            // Define all available options
                            const allOptions = [
                                {
                                    type: 'user-experience',
                                    label: 'User Experience',
                                    icon: 'M12 4v16m8-8H4'
                                },
                                {
                                    type: 'creative-brief',
                                    label: 'Creative Brief', 
                                    icon: 'M12 4v16m8-8H4'
                                },
                                {
                                    type: 'moodboard',
                                    label: 'Generate Moodboard',
                                    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                },
                                {
                                    type: 'marketing-brief',
                                    label: 'Marketing Brief',
                                    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                }
                            ];

                            // Filter out already generated types
                            const availableOptions = allOptions.filter(option => !existingTypes.includes(option.type));

                            return (generatedSections.length > 0 || isGeneratingFrames) && availableOptions.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        <h3 className="text-white text-lg font-semibold">Continue Building</h3>
                                    </div>
                                    <div className={`grid gap-4 ${availableOptions.length === 1 ? 'grid-cols-1' : availableOptions.length === 2 ? 'grid-cols-2' : availableOptions.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                        {availableOptions.map(option => (
                                            <button 
                                                key={option.type}
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleGenerateFrames(option.type as 'user-experience' | 'creative-brief' | 'moodboard' | 'marketing-brief')}
                                                disabled={isGeneratingFrames}
                                            >
                                                {isGeneratingFrames && currentGenerationType === option.type ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span>Generating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                                                        </svg>
                                                        {option.label}
                                                    </>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </Modal>

        </div>
    )
}