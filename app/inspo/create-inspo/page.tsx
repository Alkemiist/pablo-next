'use client'

// imports
import { useInspoContext } from "@/app/context/inspoContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ImageUpload } from "@/components/ui/image-upload";
import { validateContext } from "@/lib/api/tactics";
import { Tactic } from "@/lib/types/tactics";
import { Download, Share, RotateCcw, Save } from "lucide-react";

// Helper functions for image handling
const getImageFormat = (base64String: string): string => {
    if (base64String.startsWith('/9j/')) return 'jpeg';
    if (base64String.startsWith('iVBORw0KGgo')) return 'png';
    if (base64String.startsWith('R0lGODlh')) return 'gif';
    if (base64String.startsWith('UklGR')) return 'webp';
    return 'png'; // default
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
    const [tempGoalMessage, setTempGoalMessage] = useState('');
    const [tempVisualStyle, setTempVisualStyle] = useState('');
    const [tempVisualConstraints, setTempVisualConstraints] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    // Intent options for goal modal
    const intentOptions = [
        'Brand awareness',
        'Consideration/Education',
        'Acquisition/Lead Generation',
        'Conversion/Sales',
        'Retention/Loyalty',
        'Advocacy/Community Building',
        'Market Expansion / Entry',
        'Product or Service Launch',
        'Reputation/Trust Building',
        'Cultural or Social Relevance',
        'Customer Insight/Experimentation',
        'Crisis Response/Damage Control'
    ];

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
    const [currentGenerationType, setCurrentGenerationType] = useState<'audience-journey' | 'social-post' | 'caption-pack' | 'blog-outline' | 'email-campaign' | 'influencer-brief' | 'evergreen-plan' | 'script' | 'agent-chat' | null>(null);
    const [frameGenerationError, setFrameGenerationError] = useState<string | null>(null);
    const [isRegeneratingCaption, setIsRegeneratingCaption] = useState(false);

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
        const goalText = `Intent: ${tempGoalIntent}\nKey Message: ${tempGoalMessage}`;
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
    const handleGenerateFrames = async (type: 'audience-journey' | 'social-post' | 'caption-pack' | 'blog-outline' | 'email-campaign' | 'influencer-brief' | 'evergreen-plan' | 'script' | 'agent-chat', sectionIdToReplace?: number) => {
        if (!selectedTactic) return;

        setIsGeneratingFrames(true);
        setCurrentGenerationType(type);
        setFrameGenerationError(null);

        try {
            // Always use mock data for now
            console.log('Generating', type, 'using mock data');
            const frames = await generateMockFrames(type, selectedTactic);

            // Create a new section with generated frames
            const getSectionTitle = (type: string) => {
                switch(type) {
                    case 'audience-journey': return 'Audience Journey Map';
                    case 'social-post': return 'Social Media Posts';
                    // case 'caption-pack': return 'Caption Pack'; // This is the one that we are changing to agent chat
                    case 'blog-outline': return 'Blog/Article Outline';
                    case 'email-campaign': return 'Email Campaign';
                    case 'influencer-brief': return 'Influencer Brief';
                    case 'evergreen-plan': return 'Evergreen Content Plan';
                    case 'script': return '30-Second Ad Script';
                    case 'agent-chat': return 'AI Agent Assistant';
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
                    case 'social-posts': return 'Social Media Content';
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

    // Function to regenerate caption only
    const regenerateCaption = async (sectionId: number) => {
        if (!selectedTactic) return;

        setIsRegeneratingCaption(true);
        
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate new caption variations
            const captionVariations = [
                {
                    hook: `${selectedTactic.oneLinerSummary} ✨`,
                    body: `${selectedTactic.coreMessage}\n\nCrafted for visionaries who demand excellence.`,
                    cta: `Discover ${product} → Link in bio`,
                    hashtags: `#${brand.replace(/\s+/g, '')} #${product.replace(/\s+/g, '')} #luxury #premium #innovation #trending #viral #aesthetic #lifestyle #quality #excellence #exclusive`
                },
                {
                    hook: `${selectedTactic.oneLinerSummary} 🔥`,
                    body: `${selectedTactic.coreMessage}\n\nFor those who choose extraordinary over average.`,
                    cta: `Shop ${product} now → Bio link`,
                    hashtags: `#${brand.replace(/\s+/g, '')} #${product.replace(/\s+/g, '')} #exclusive #premium #luxury #trending #viral #innovation #lifestyle #quality #excellence #aesthetic`
                },
                {
                    hook: `${selectedTactic.oneLinerSummary} ⭐`,
                    body: `${selectedTactic.coreMessage}\n\nElevating standards. Exceeding expectations.`,
                    cta: `Experience ${product} → Link below`,
                    hashtags: `#${brand.replace(/\s+/g, '')} #${product.replace(/\s+/g, '')} #innovation #premium #trending #viral #luxury #aesthetic #lifestyle #quality #excellence #exclusive`
                }
            ];

            // Select a random variation
            const newCaption = captionVariations[Math.floor(Math.random() * captionVariations.length)];

            // Update the section with new caption
            setGeneratedSections(prev => 
                prev.map(section => 
                    section.id === sectionId 
                        ? {
                            ...section,
                            frames: [{
                                ...section.frames[0],
                                content: {
                                    ...section.frames[0].content,
                                    caption: newCaption
                                }
                            }]
                        }
                        : section
                )
            );

        } catch (error) {
            console.error('Error regenerating caption:', error);
        } finally {
            setIsRegeneratingCaption(false);
        }
    };

    // AI-powered frame generation - replaces hard-coded mock data
    const generateMockFrames = async (type: 'audience-journey' | 'social-post' | 'caption-pack' | 'blog-outline' | 'email-campaign' | 'influencer-brief' | 'evergreen-plan' | 'script' | 'agent-chat', tactic: Tactic): Promise<any[]> => {
        try {
            // Call the new content generation API
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    tactic,
                    brand,
                    product,
                    persona,
                    goal,
                    visualGuide
                }),
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to generate content');
            }

            // Return the generated content in the expected format
            return [{
                id: 1,
                type: type,
                title: getTitleForType(type),
                content: data.content
            }];

        } catch (error) {
            console.error(`Error generating ${type} content:`, error);
            
            // Fallback to basic structure if generation fails
            return [{
                id: 1,
                type: type,
                title: getTitleForType(type),
                content: {
                    error: 'Content generation failed. Please try again.',
                    fallbackMessage: `Unable to generate ${type} content at this time.`
                }
            }];
        }
    };

    // Helper function to get display titles for different content types
    const getTitleForType = (type: string): string => {
        const titles = {
            'audience-journey': 'Audience Journey Map',
            'social-post': 'Social Media Posts',
            'caption-pack': 'Caption Pack - 5 Variations',
            'blog-outline': 'Blog/Article Outline',
            'email-campaign': 'Email Campaign',
            'influencer-brief': 'Influencer Brief',
            'script': '30-Second Ad Script',
            'evergreen-plan': 'Evergreen Content Plan',
            'agent-chat': 'AI Agent Assistant'
        };
        return titles[type as keyof typeof titles] || 'Generated Content';
    };

    return (

        <div>
            
            {/* Component Bar */}
            <div className="flex justify-between items-center border-b border-neutral-800 bg-neutral-950 py-4 px-8 sticky top-0 z-10 h-[80px]">

                {/* Left Side: User selects/ adds all of the context we need in order to generate the inspo -------------------------------- */}
                <div className="flex gap-4">

                    {/* Select Brand */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(brand) ? 'border-neutral-800' : 'border-neutral-800'}`}
                        onClick={() => setIsBrandOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(brand) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(brand) ? brand : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Brand</p>
                        </div>
                    </div>

                    {/* Select Product */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(product) ? 'border-neutral-800' : 'border-neutral-800'}`}
                        onClick={() => setIsProductOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(product) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(product) ? product : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Product</p>
                        </div>
                    </div>

                    {/* Select Persona */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(persona) ? 'border-neutral-800' : 'border-neutral-800'}`}
                        onClick={() => setIsPersonaOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(persona) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(persona) ? 'Persona Set' : 'Select'}</p>
                            <p className="text-sm text-neutral-500">Persona</p>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(goal) ? 'border-neutral-800' : 'border-neutral-800'}`}
                        onClick={() => setIsGoalOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(goal) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(goal) ? 'Goal Set' : 'Add'}</p>
                            <p className="text-sm text-neutral-500">Goal</p>
                        </div>
                    </div>

                    {/* Add Visual Guide */}
                    <div 
                        className={`flex items-center gap-4 rounded-xl px-8 py-2 border cursor-pointer hover:bg-neutral-800 transition-colors ${isCompleted(visualGuide) ? 'border-neutral-800' : 'border-neutral-800'}`}
                        onClick={() => setIsVisualGuideOpen(true)}
                    >
                        <div className={`w-4 h-4 rounded-sm border transition-all duration-300 ${isCompleted(visualGuide) ? 'bg-green-500 border-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-neutral-800 border-neutral-700'}`}>
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">{isCompleted(visualGuide) ? 'Guide Set' : 'Add'}</p>
                            <p className="text-sm text-neutral-500">Visual Guide</p>
                        </div>
                    </div>

                </div>

                
                {/* Right Side: Is the "imagine" button that triggers the generative to start with all of the added context -------------------------------- */}
                    <button 
                     className={`relative px-8 h-12 rounded-xl border text-sm font-semibold transition-all duration-500 ease-in-out flex items-center gap-3 overflow-hidden ${
                         isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)
                             ? 'border-transparent text-white group' + (isGenerating ? ' cursor-wait' : ' cursor-pointer')
                             : 'bg-neutral-800 border-neutral-700 text-neutral-400 cursor-not-allowed'
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

            {/* Inspo Card Section: The generated inspo cards are displayed here -------------------------------- */}
            <div className='mx-8 h-[calc(100vh-80px)] grid grid-cols-2 grid-rows-2 gap-4 p-8'>
                
                {/* Generated Card 1 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[0] && handleTacticClick(tactics[0])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
                >
                    {cardLoadingStates[0].isLoading ? (

                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-neutral-950 border-2 border-dashed border-neutral-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div className="text-white text-sm font-medium font-mono tracking-wider">
                                    <TypewriterText 
                                        text={cardLoadingStates[0].stage}
                                        speed={30}
                                    />
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-neutral-300 text-xs">{tactics[0].platform}</p>
                                    </div>

                                </div>
                                
                                {/* Bottom Section */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                                    <h3 className="text-white font-bold text-lg">{tactics[0].title}</h3>
                                    <p className="text-neutral-300 text-xs leading-relaxed">{tactics[0].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-neutral-950 border-2 border-dashed border-neutral-700">
                            <p className="text-neutral-500 text-sm">Inspo will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 2 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[1] && handleTacticClick(tactics[1])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
                >
                    {cardLoadingStates[1].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-neutral-950 border-2 border-dashed border-neutral-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '0.5s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div className="text-white text-sm font-medium font-mono tracking-wider">
                                    <TypewriterText 
                                        text={cardLoadingStates[1].stage}
                                        speed={30}
                                    />
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-neutral-300 text-xs">{tactics[1].platform}</p>
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
                                    <p className="text-neutral-300 text-xs leading-relaxed">{tactics[1].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-neutral-950 border-2 border-dashed border-neutral-700">
                            <p className="text-neutral-500 text-sm">Inspo will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 3 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[2] && handleTacticClick(tactics[2])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
                >
                    {cardLoadingStates[2].isLoading ? (
                        /* Individual Loading State with Dark Background */
                            <div className="h-full flex flex-col bg-neutral-950 border-2 border-dashed border-neutral-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div className="text-white text-sm font-medium font-mono tracking-wider">
                                    <TypewriterText 
                                        text={cardLoadingStates[2].stage}
                                        speed={30}
                                    />
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-neutral-300 text-xs">{tactics[2].platform}</p>
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
                                    <p className="text-neutral-300 text-xs leading-relaxed">{tactics[2].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-neutral-950 border-2 border-dashed border-neutral-700">
                            <p className="text-neutral-500 text-sm">Inspo will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 4 */}
                <div 
                    className="relative rounded-lg overflow-hidden shadow-lg bg-neutral-100 group cursor-pointer hover:scale-[1.02] transition-transform duration-200 focus:outline-none outline-none ring-0 focus:ring-0"
                    onClick={() => tactics[3] && handleTacticClick(tactics[3])}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    tabIndex={-1}
                >
                    {cardLoadingStates[3].isLoading ? (
                        /* Individual Loading State with Dark Background */
                        <div className="h-full flex flex-col bg-neutral-950 border-2 border-dashed border-neutral-700">
                            {/* Animated Shimmer Background - Dark Theme */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}}></div>
                            
                            {/* Loading Content */}
                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div className="text-white text-sm font-medium font-mono tracking-wider">
                                    <TypewriterText 
                                        text={cardLoadingStates[3].stage}
                                        speed={30}
                                    />
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

                                    {/* Platform Label: Invisible at the moment */}
                                    <div className="invisible bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                                        <p className="text-white text-sm font-medium">Tactic:</p>
                                        <p className="text-neutral-300 text-xs">{tactics[3].platform}</p>
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
                                    <p className="text-neutral-300 text-xs leading-relaxed">{tactics[3].oneLinerSummary}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-neutral-950 border-2 border-dashed border-neutral-700">
                            <p className="text-neutral-500 text-sm">Inspo will appear here</p>
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
                            className="mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsBrandOpen(false)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('brand', tempBrand, setBrand, setIsBrandOpen)}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white"
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
                            className="mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsProductOpen(false)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('product', tempProduct, setProduct, setIsProductOpen)}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white"
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
                            className="resize-none mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsPersonaOpen(false)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('persona', tempPersona, setPersona, setIsPersonaOpen)}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white"
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
                        <Label className="text-white">What is the intent?</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {intentOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setTempGoalIntent(option)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                                        tempGoalIntent === option
                                            ? 'border-purple-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                            : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="goal-message" className="text-white">What is the key message?</Label>
                        <Textarea
                            id="goal-message"
                            value={tempGoalMessage}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempGoalMessage(e.target.value)}
                            placeholder="Ex. Show how the product eliminates repetitive tasks so users can focus on what matters, making their workflow feel effortless and smart"
                            className="mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsGoalOpen(false)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleGoalSubmit}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white"
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
                            className="mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div>
                        <Label htmlFor="visual-constraints" className="text-white">Are there any constraints?</Label>
                        <Textarea
                            id="visual-constraints"
                            value={tempVisualConstraints}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTempVisualConstraints(e.target.value)}
                            placeholder="Ex. Avoid black and white as dominant colors and steer clear of any harsh, high-contrast visuals to keep the tone warm and inviting."
                            className="mt-2 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-neutral-500 min-h-[100px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setIsVisualGuideOpen(false)}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleVisualGuideSubmit}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white"
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
                    <button title="Save Tactic" className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Save className="w-4 h-4 text-white" />
                    </button>
                    <button title="Download Tactic" className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="w-8 h-8 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                        <Share className="w-4 h-4 text-white" />
                    </button>
                </div>

                {selectedTactic && (
                    <div className="max-h-[80vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 [&::-webkit-scrollbar-corner]:bg-neutral-800">
                        <div className="flex gap-10 mb-8 items-stretch">
                            {/* Left Side - Image */}
                            <div className="w-2/5 flex-shrink-0 shadow-lg">
                                <div className="relative w-full h-full rounded-lg overflow-hidden bg-neutral-800">
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
                                        <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-neutral-400/30 border-t-neutral-400 rounded-full animate-spin"></div>
                                                <p className="text-neutral-400 text-sm font-medium">Regenerating image...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Regenerate Image Button */}
                                    <button 
                                        className={`absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10 ${
                                            isRegeneratingImage 
                                                ? 'bg-neutral-600 cursor-wait' 
                                                : 'bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
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
                            <div className="w-3/5 flex flex-col justify-between pr-2">
                                <div className="space-y-6">
                                    {/* Key Information Stack */}
                                    <div className="space-y-4">
                                        {/* Primary Tactic */}
                                        {/* <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Primary Tactic:</p>
                                            <p className="text-neutral-500 text-sm">{selectedTactic.platform}</p>
                                        </div> */}

                                        {/* Description Section */}
                                        <div>
                                            <h4 className="text-white font-semibold mb-3">Description:</h4>
                                            <p className="text-neutral-500 text-sm leading-relaxed">{selectedTactic.fullDescription}</p>
                                        </div>

                                        {/* Why This Works Section */}
                                        <div>
                                            <h4 className="text-white font-semibold mb-3">Øpus POV:</h4>
                                            <p className="text-neutral-500 text-sm leading-relaxed">{selectedTactic.whyItWorks}</p>
                                        </div>
                                    </div>

                                    {/* divider */}
                                    <div className="h-px bg-neutral-800 w-full"></div>

                                        {/* Hook */}
                                        <div className="flex gap-2  ">
                                            <p className="text-white text-sm font-semibold">Hook:</p>
                                            <p className="text-neutral-500 text-sm">{selectedTactic.oneLinerSummary}</p>
                                        </div>

                                        {/* Goal */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Goal:</p>
                                            <p className="text-neutral-500 text-sm">{selectedTactic.goal}</p>
                                        </div>

                                        {/* Core Message */}
                                        <div className="flex gap-2">
                                            <p className="text-white text-sm font-semibold">Core Message:</p>
                                            <p className="text-neutral-500 text-sm">{selectedTactic.coreMessage}</p>
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
                            <div key={section.id} className="mt-8 pt-8 border-t border-neutral-800">
                                {/* Section Header with Controls */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-neutral-500 rounded-full animate-pulse"></div>
                                        <h3 className="text-white text-lg font-semibold">{section.title}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center"
                                            onClick={() => {
                                                console.log('Regenerating section:', section.type, section.id);
                                                handleGenerateFrames(section.type as 'audience-journey' | 'social-post' | 'caption-pack' | 'blog-outline' | 'email-campaign' | 'influencer-brief' | 'evergreen-plan' | 'script' | 'agent-chat', section.id);
                                            }}
                                            title="Regenerate section"
                                        >
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        </button>
                                        <button 
                                            className="w-8 h-8 bg-neutral-800 hover:bg-red-600 rounded-lg flex items-center justify-center"
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
                                {section.frames[0]?.type === 'audience-journey' ? (
                                    /* Audience Journey Map Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h3 className="text-white font-semibold mb-3">Journey Overview</h3>
                                            <p className="text-neutral-300 text-sm mb-4">Target Audience: {section.frames[0].content.targetAudience}</p>
                                        </div>

                                        {/* Journey Stages */}
                                        <div className="space-y-4">
                                            {(section.frames[0].content.stages as any[]).map((stage: any, index: number) => (
                                                <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">{index + 1}</span>
                                                        </div>
                                                        <h4 className="text-white font-semibold text-lg">{stage.stage}</h4>
                                                    </div>
                                                    <p className="text-neutral-300 text-sm mb-4">{stage.description}</p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div>
                                                            <h5 className="text-neutral-400 font-medium mb-2">Touchpoints</h5>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
                                                                {(stage.touchpoints as string[]).map((point: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-neutral-400 mt-1">•</span>
                                                                        {point}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-green-400 font-medium mb-2">Emotions</h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(stage.emotions as string[]).map((emotion: string, i: number) => (
                                                                    <span key={i} className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded">
                                                                        {emotion}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-purple-400 font-medium mb-2">Actions</h5>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
                                                                {(stage.actions as string[]).map((action: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-purple-400 mt-1">•</span>
                                                                        {action}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-red-400 font-medium mb-2">Barriers</h5>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
                                                                {(stage.barriers as string[]).map((barrier: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-red-400 mt-1">•</span>
                                                                        {barrier}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Key Insights & Opportunities */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Key Insights</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.keyInsights as string[]).map((insight: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-yellow-400 mt-1">💡</span>
                                                            {insight}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Optimization Opportunities</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.optimizationOpportunities as string[]).map((opportunity: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">🎯</span>
                                                            {opportunity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'social-post' ? (
                                    /* Social Posts Layout */
                                    <div className="space-y-6">
                                        {/* Platform Posts */}
                                        <div className="space-y-4">
                                            {(section.frames[0].content.platforms as any[]).map((platform: any, index: number) => (
                                                <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 bg-neutral-600 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">{platform.platform[0]}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold">{platform.platform}</h4>
                                                            <p className="text-neutral-400 text-sm">{platform.format}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                                                        <pre className="text-neutral-300 text-sm whitespace-pre-wrap font-sans">{platform.caption}</pre>
                                                        <div className="mt-3 pt-3 border-t border-neutral-700">
                                                            <p className="text-neutral-400 text-sm font-medium">{platform.cta}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-green-400 font-medium">Best Times:</span>
                                                            <span className="text-neutral-300 ml-2">{platform.bestTimes}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-purple-400 font-medium">Considerations:</span>
                                                            <span className="text-neutral-300 ml-2">{platform.considerations}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Content Strategy */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Content Pillars</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.contentPillars as string[]).map((pillar: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-neutral-400 mt-1">•</span>
                                                            {pillar}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Engagement Strategy</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.engagementStrategy as string[]).map((strategy: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">•</span>
                                                            {strategy}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'caption-pack' ? (
                                    /* Caption Pack Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h3 className="text-white font-semibold mb-2">Caption Variations</h3>
                                            <p className="text-neutral-300 text-sm">Concept: {section.frames[0].content.concept}</p>
                                        </div>

                                        {/* Caption Variations */}
                                        <div className="space-y-4">
                                            {(section.frames[0].content.variations as any[]).map((variation: any, index: number) => (
                                                <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-white font-semibold">Variation {index + 1}: {variation.style}</h4>
                                                        <span className="bg-neutral-900/30 text-neutral-300 text-xs px-2 py-1 rounded">{variation.tone}</span>
                                                    </div>
                                                    
                                                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                                                        <pre className="text-neutral-300 text-sm whitespace-pre-wrap font-sans">{variation.caption}</pre>
                                                    </div>
                                                    
                                                    <p className="text-neutral-400 text-sm"><span className="text-green-400 font-medium">Best for:</span> {variation.bestFor}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Testing & Metrics */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">A/B Testing Guide</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.abTestingGuide as string[]).map((guide: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-purple-400 mt-1">•</span>
                                                            {guide}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Performance Metrics</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.performanceMetrics as string[]).map((metric: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-orange-400 mt-1">•</span>
                                                            {metric}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'script' ? (
                                    /* Script Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h2 className="text-xl font-bold text-white mb-2">{section.frames[0].content.scriptTitle}</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-neutral-400 font-medium">Duration:</span>
                                                    <span className="text-neutral-300 ml-2">{section.frames[0].content.duration}</span>
                                                </div>
                                                <div>
                                                    <span className="text-purple-400 font-medium">Target:</span>
                                                    <span className="text-neutral-300 ml-2">{section.frames[0].content.targetAudience}</span>
                                                </div>
                                                <div>
                                                    <span className="text-green-400 font-medium">Objective:</span>
                                                    <span className="text-neutral-300 ml-2">{section.frames[0].content.objective}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Script Breakdown */}
                                        <div className="space-y-4">
                                            {Object.entries(section.frames[0].content.script).map(([key, scene]: [string, any], index: number) => (
                                                <div key={key} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-white font-semibold text-lg capitalize">{key === 'cta' ? 'Call to Action' : key}</h4>
                                                        <span className="bg-orange-900/30 text-orange-300 text-xs px-2 py-1 rounded">{scene.timeframe}</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div>
                                                            <h5 className="text-neutral-400 font-medium mb-2">Visual</h5>
                                                            <p className="text-neutral-300 text-sm">{scene.visual}</p>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-green-400 font-medium mb-2">Voiceover</h5>
                                                            <p className="text-neutral-300 text-sm italic">"{scene.voiceover}"</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                                        <p className="text-neutral-400 text-xs"><span className="text-purple-400 font-medium">Note:</span> {scene.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Production Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Production Notes</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-neutral-400 font-medium text-sm">Tone:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.productionNotes.tone}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-green-400 font-medium text-sm">Pacing:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.productionNotes.pacing}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-purple-400 font-medium text-sm">Music:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.productionNotes.music}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-orange-400 font-medium text-sm">Voiceover Style:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.productionNotes.voiceoverStyle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Technical Specs</h4>
                                                <div className="space-y-2 text-sm">
                                                    {Object.entries(section.frames[0].content.technicalSpecs).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                            <span className="text-neutral-300 text-right max-w-[60%]">
                                                                {Array.isArray(value) ? (value as string[]).join(', ') : value as string}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Call to Action & Performance */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Call to Action Strategy</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(section.frames[0].content.callToAction).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-neutral-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                            <span className="text-green-400 text-sm font-medium">{value as string}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Success Metrics</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.measurableGoals as string[]).map((goal: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">🎯</span>
                                                            {goal}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Target Platforms */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h4 className="text-white font-semibold mb-3">Target Platforms</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {(section.frames[0].content.targetPlatforms as string[]).map((platform: string, i: number) => (
                                                    <span key={i} className="bg-neutral-900/30 text-neutral-300 text-xs px-3 py-1 rounded-full">
                                                        {platform}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'document' ? (
                                    /* Document Layout for Creative & Marketing Briefs */
                                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                        {section.type === 'creative-brief' ? (
                                            /* Creative Brief Document */
                                            <div className="space-y-6">
                                                <div className="border-b border-neutral-700 pb-4">
                                                    <h2 className="text-xl font-bold text-white mb-2">{section.frames[0].content.projectName}</h2>
                                                    <p className="text-neutral-300 text-sm leading-relaxed">{section.frames[0].content.briefOverview}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Objective</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.objective}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Target Audience</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.targetAudience}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Key Message</h4>
                                                            <p className="text-neutral-300 text-sm font-medium italic">"{section.frames[0].content.keyMessage}"</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Creative Concept</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.creativeConcept}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Tone & Style</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.toneAndStyle}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Platform Considerations</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.platformConsiderations}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-neutral-700 pt-4">
                                                    <div className="mb-4">
                                                        <h4 className="text-white font-semibold mb-2">Why This Works</h4>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.whyThisWorks}</p>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Mandatory Elements</h4>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
                                                                                                                                 {(section.frames[0].content.mandatoryElements as string[]).map((element: string, index: number) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="text-neutral-400 mt-1">•</span>
                                                                        {element}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Success Criteria</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.successCriteria}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Marketing Brief Document */
                                            <div className="space-y-6">
                                                <div className="border-b border-neutral-700 pb-4">
                                                    <h2 className="text-xl font-bold text-white mb-1">{section.frames[0].content.projectTitle}</h2>
                                                    <h3 className="text-lg text-neutral-400 mb-3">Campaign: {section.frames[0].content.campaignName}</h3>
                                                    <p className="text-neutral-300 text-sm leading-relaxed">{section.frames[0].content.executiveSummary}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Brand Overview</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p><span className="text-neutral-400">Brand:</span> <span className="text-neutral-300">{section.frames[0].content.brandOverview.brand}</span></p>
                                                                <p><span className="text-neutral-400">Product:</span> <span className="text-neutral-300">{section.frames[0].content.brandOverview.product}</span></p>
                                                                <p className="text-neutral-300">{section.frames[0].content.brandOverview.positioning}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Marketing Objectives</h4>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
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
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.targetAudienceProfile}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Key Insight</h4>
                                                            <p className="text-neutral-300 text-sm italic">{section.frames[0].content.keyInsight}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Strategic Approach</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.strategicApproach}</p>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Core Messaging</h4>
                                                            <div className="space-y-2">
                                                                <p className="text-neutral-300 text-sm"><span className="text-purple-400 font-medium">Primary:</span> "{section.frames[0].content.coreMessaging.primaryMessage}"</p>
                                                                <div>
                                                                    <p className="text-purple-400 font-medium text-sm mb-1">Supporting Messages:</p>
                                                                    <ul className="text-neutral-300 text-sm space-y-1">
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

                                                <div className="border-t border-neutral-700 pt-4 space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Channel Strategy</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.channelStrategy}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Creative Direction</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.creativeDirection}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Success Metrics</h4>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
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
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.timeline}</p>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-white font-semibold mb-2">Budget</h4>
                                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.budget}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : section.frames[0]?.type === 'blog-outline' ? (
                                    /* Blog Outline Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h2 className="text-xl font-bold text-white mb-2">{section.frames[0].content.title}</h2>
                                            <h3 className="text-md text-neutral-400">{section.frames[0].content.subtitle}</h3>
                                        </div>

                                        {/* Article Outline */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-white font-semibold text-lg">Article:</h4>
                                            </div>

                                            <div className="text-neutral-300 text-sm space-y-3">
                                                {(section.frames[0].content.body as any[]).map((outlineSection: any, index: number) => (
                                                    <p key={index}>{outlineSection.paragraph}</p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SEO & Content Upgrades */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">SEO Strategy</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-neutral-400 font-medium text-sm">Primary Keyword:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.seoStrategy.primaryKeyword}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-green-400 font-medium text-sm">Secondary Keywords:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {(section.frames[0].content.seoStrategy.secondaryKeywords as string[]).map((keyword: string, i: number) => (
                                                                <span key={i} className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded">{keyword}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-purple-400 font-medium text-sm">Meta Description:</span>
                                                        <p className="text-neutral-300 text-sm">{section.frames[0].content.seoStrategy.metaDescription}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Content Upgrades</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.contentUpgrades as string[]).map((upgrade: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-orange-400 mt-1">📎</span>
                                                            {upgrade}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'email-campaign' ? (
                                    /* Email Campaign Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h3 className="text-white font-semibold mb-2">{section.frames[0].content.campaignName}</h3>
                                            <p className="text-neutral-300 text-sm">Objective: {section.frames[0].content.objective}</p>
                                        </div>

                                        {/* Email Sequence */}
                                        <div className="space-y-4">
                                            {(section.frames[0].content.emails as any[]).map((email: any, index: number) => (
                                                <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-white font-semibold">Email {index + 1}: {email.type}</h4>
                                                        <div className="text-right">
                                                            <p className="text-green-400 text-sm font-medium">{email.sendTime}</p>
                                                            <p className="text-neutral-400 text-xs">Expected: {email.expectedOpenRate}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <span className="text-neutral-400 font-medium text-sm">Subject:</span>
                                                            <p className="text-neutral-300 text-sm">{email.subject}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-purple-400 font-medium text-sm">Preview:</span>
                                                            <p className="text-neutral-300 text-sm">{email.preview}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-neutral-800 rounded-lg p-4">
                                                        <h5 className="text-white font-medium mb-3">Email Content:</h5>
                                                        <div className="space-y-2 text-sm">
                                                            {Object.entries(email.content).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                                    <p className="text-neutral-300 ml-2">{value as string}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Campaign Metrics & Strategy */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Expected Metrics</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(section.frames[0].content.campaignMetrics).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-neutral-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                            <span className="text-green-400 text-sm font-medium">{value as string}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Follow-up Strategy</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.followUpStrategy as string[]).map((strategy: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-neutral-400 mt-1">•</span>
                                                            {strategy}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'influencer-brief' ? (
                                    /* Influencer Brief Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h3 className="text-white font-semibold mb-2">{section.frames[0].content.campaignName}</h3>
                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.briefOverview}</p>
                                        </div>

                                        {/* Campaign Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Campaign Objectives</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.campaignObjectives as string[]).map((objective: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">•</span>
                                                            {objective}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Target Influencers</h4>
                                                <div className="space-y-2 text-sm">
                                                    {Object.entries(section.frames[0].content.targetInfluencers).map(([key, value]) => (
                                                        <div key={key}>
                                                            <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                            <p className="text-neutral-300 ml-2">{Array.isArray(value) ? (value as string[]).join(', ') : value as string}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Requirements & Deliverables */}
                                        <div className="space-y-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Content Requirements</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h5 className="text-green-400 font-medium mb-2">Mandatory Elements</h5>
                                                        <ul className="text-neutral-300 text-sm space-y-1">
                                                            {(section.frames[0].content.contentRequirements.mandatoryElements as string[]).map((element: string, i: number) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-green-400 mt-1">•</span>
                                                                    {element}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-neutral-400 font-medium mb-2">Creative Freedom</h5>
                                                        <ul className="text-neutral-300 text-sm space-y-1">
                                                            {(section.frames[0].content.contentRequirements.creativeFreedom as string[]).map((freedom: string, i: number) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-neutral-400 mt-1">•</span>
                                                                    {freedom}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Deliverables</h4>
                                                <div className="space-y-4">
                                                    {(section.frames[0].content.deliverables as any[]).map((deliverable: any, index: number) => (
                                                        <div key={index} className="border-l-2 border-purple-400 pl-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className="text-white font-medium">{deliverable.platform} - {deliverable.format}</h5>
                                                                <span className="text-orange-400 text-xs">{deliverable.timeline}</span>
                                                            </div>
                                                            <p className="text-neutral-300 text-sm mb-1">{deliverable.specifications}</p>
                                                            <p className="text-neutral-400 text-xs">{deliverable.requirements}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Success Metrics */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h4 className="text-white font-semibold mb-3">Success Metrics</h4>
                                            <ul className="text-neutral-300 text-sm space-y-2">
                                                {(section.frames[0].content.successMetrics as string[]).map((metric: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-orange-400 mt-1">📊</span>
                                                        {metric}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'evergreen-plan' ? (
                                    /* Evergreen Content Plan Layout */
                                    <div className="space-y-6">
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h3 className="text-white font-semibold mb-2">{section.frames[0].content.planName}</h3>
                                            <p className="text-neutral-300 text-sm">{section.frames[0].content.conceptOverview}</p>
                                        </div>

                                        {/* Content Series */}
                                        <div className="space-y-4">
                                            {(section.frames[0].content.contentSeries as any[]).map((series: any, index: number) => (
                                                <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-white font-semibold">{series.seriesName}</h4>
                                                        <div className="text-right">
                                                            <span className="text-green-400 text-sm font-medium">{series.frequency}</span>
                                                            <p className="text-neutral-400 text-xs">{series.duration}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-neutral-300 text-sm mb-4">{series.description}</p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h5 className="text-neutral-400 font-medium mb-2">Content Types</h5>
                                                            <ul className="text-neutral-300 text-sm space-y-1">
                                                                {(series.contentTypes as string[]).map((type: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-neutral-400 mt-1">•</span>
                                                                        {type}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-purple-400 font-medium mb-2">Platforms</h5>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(series.platforms as string[]).map((platform: string, i: number) => (
                                                                    <span key={i} className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded">{platform}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Content Calendar & Strategy */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Content Calendar</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(section.frames[0].content.contentCalendar).map(([key, value]) => (
                                                        key !== 'notes' && (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="text-neutral-400 text-sm capitalize">{key}:</span>
                                                                <span className="text-neutral-300 text-sm">{value as string}</span>
                                                            </div>
                                                        )
                                                    ))}
                                                    {section.frames[0].content.contentCalendar.notes && (
                                                        <p className="text-neutral-400 text-xs mt-3 italic">{section.frames[0].content.contentCalendar.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                <h4 className="text-white font-semibold mb-3">Success Metrics</h4>
                                                <ul className="text-neutral-300 text-sm space-y-2">
                                                    {(section.frames[0].content.successMetrics as string[]).map((metric: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">📈</span>
                                                            {metric}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : section.frames[0]?.type === 'social-posts' ? (
                                    /* Social Posts Layout */
                                    <div className="space-y-6">
                                        {/* Campaign Overview */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <div className="mb-4">
                                                <h3 className="text-white font-semibold mb-2">{section.frames[0].content.campaign}</h3>
                                                <p className="text-neutral-300 text-sm leading-relaxed">{section.frames[0].content.overview}</p>
                                            </div>
                                        </div>

                                        {/* Format Examples */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(section.frames[0].content.formats as any[]).map((format: any) => (
                                                <div key={format.id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
                                                    {/* Format Header */}
                                                    <div className="p-4 border-b border-neutral-800">
                                                        <h4 className="text-white font-semibold text-sm">{format.format}</h4>
                                                        <p className="text-neutral-400 text-xs">{format.dimensions}</p>
                                                    </div>
                                                    
                                                    {/* Generated Image */}
                                                    <div className={`${format.format.includes('9:16') ? 'aspect-[9/16] max-w-sm' : 'aspect-[16/9] max-w-lg'} bg-neutral-800 relative mx-auto`}>
                                                        <img 
                                                            src={format.image} 
                                                            alt={format.format}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
                                                        <div className={`absolute ${format.format.includes('9:16') ? 'top-4 left-4' : 'top-4 right-4'}`}>
                                                            <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                                                <span className="text-white text-xs font-semibold">{section.frames[0].content.campaign.split(' - ')[0]}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`absolute ${format.format.includes('9:16') ? 'bottom-4 left-4 right-4' : 'top-1/2 left-4 right-4 -tranneutral-y-1/2'}`}>
                                                            <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                                                                <div className="text-white text-sm font-semibold mb-1">{section.frames[0].content.caption.hook}</div>
                                                                <div className="text-neutral-300 text-xs">{section.frames[0].content.caption.cta}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Post Caption */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-white font-semibold">Post Caption</h4>
                                                <button
                                                    onClick={() => regenerateCaption(section.id)}
                                                    disabled={isRegeneratingCaption}
                                                    className="flex items-center gap-2 px-3 py-1 bg-neutral-600 hover:bg-neutral-500 disabled:bg-neutral-600/50 rounded-lg text-white text-xs font-medium transition-colors"
                                                >
                                                    {isRegeneratingCaption ? (
                                                        <>
                                                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>Regenerating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            <span>Regenerate</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="bg-neutral-800 rounded-lg p-4 font-mono text-sm">
                                                <div className="text-white mb-2">{section.frames[0].content.caption.hook}</div>
                                                <div className="text-neutral-300 whitespace-pre-line mb-3">{section.frames[0].content.caption.body}</div>
                                                <div className="text-neutral-400 mb-3">{section.frames[0].content.caption.cta}</div>
                                                <div className="text-purple-400 text-xs">{section.frames[0].content.caption.hashtags}</div>
                                            </div>
                                        </div>

                                        {/* Performance Optimization */}
                                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                            <h4 className="text-white font-semibold mb-4">Performance Optimization</h4>
                                            <ul className="text-neutral-300 text-sm space-y-2">
                                                {(section.frames[0].content.performanceOptimization as string[]).map((item: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <span className="text-green-400 mt-1">✓</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard User Experience Frame Layout */
                                    <div className="space-y-6">
                                        {section.frames.map((frame: any, index: number) => (
                                            <div key={frame.id} className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                                                {/* Frame Header */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 bg-neutral-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold text-base">
                                                            🎬 Frame {index + 1}: {frame.title}
                                                        </h4>
                                                        <p className="text-neutral-400 text-sm">{frame.role}</p>
                                                    </div>
                                                </div>

                                                {/* Frame Details Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Visual */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="text-neutral-400 text-sm font-medium">Visual:</span>
                                                        </div>
                                                        <p className="text-neutral-300 text-sm leading-relaxed">{frame.visual}</p>
                                                    </div>

                                                    {/* Audio */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V8a1 1 0 011-1h1m0 0a1 1 0 011 1v3a1 1 0 01-1 1H9m0 0H6m3 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1m1 0H5" />
                                                            </svg>
                                                            <span className="text-green-400 text-sm font-medium">Audio:</span>
                                                        </div>
                                                        <p className="text-neutral-300 text-sm leading-relaxed">{frame.audio}</p>
                                                    </div>

                                                    {/* Text */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                            </svg>
                                                            <span className="text-purple-400 text-sm font-medium">Text:</span>
                                                        </div>
                                                        <p className="text-neutral-300 text-sm leading-relaxed">{frame.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}



                        {/* All Generation Options - Always Visible at Bottom */}
                        <div className="mt-8 pt-8 border-t border-neutral-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                                <h3 className="text-white text-lg font-semibold">Generation Options</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { type: 'audience-journey', label: 'Audience Journey Map', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                                    { type: 'social-post', label: 'Social Posts', icon: 'M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2M7 4h10M7 4l-1 14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2L17 4M10 9v6M14 9v6' },
                                    // { type: 'caption-pack', label: 'Generate Caption Pack', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
                                    { type: 'blog-outline', label: 'Blog/Article', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                    { type: 'email-campaign', label: 'Email Campaign', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                                    { type: 'influencer-brief', label: 'Influencer Brief', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                                    { type: 'evergreen-plan', label: 'Evergreen Content Plan', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                                    { type: 'script', label: 'Commercial Script', icon: 'M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2m3 6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4c0 1.1.9 2 2 2h1m0 0v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4m-6 0h6' },
                                    { type: 'agent-chat', label: 'Agent Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
                                ].map(option => {
                                    const isAlreadyGenerated = generatedSections.some(section => section.type === option.type);
                                    return (
                                        <button 
                                            key={option.type}
                                            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                                                isAlreadyGenerated 
                                                    ? 'bg-green-900/30 border border-green-700/50 text-green-300' 
                                                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                            }`}
                                            onClick={() => handleGenerateFrames(option.type as 'audience-journey' | 'social-post' | 'blog-outline' | 'email-campaign' | 'influencer-brief' | 'evergreen-plan' | 'script')}
                                            disabled={isGeneratingFrames}
                                        >
                                            {isGeneratingFrames && currentGenerationType === option.type ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="hidden sm:inline">Generating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                                                    </svg>
                                                    <span className="text-center leading-tight text-xs sm:text-sm">{option.label}</span>
                                                    {isAlreadyGenerated && (
                                                        <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    )
}