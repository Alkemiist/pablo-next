'use client'

// imports
import { useInspoContext } from "@/app/context/inspoContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ImageUpload } from "@/components/ui/image-upload";
import { generateTactics, validateContext } from "@/lib/api/tactics";
import { Tactic } from "@/lib/types/tactics";

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

    // Generated tactics state
    const [tactics, setTactics] = useState<Tactic[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

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

    // Function to generate tactics
    const handleGenerateTactics = async () => {
        if (!validateContext({ brand, product, persona, goal, visualGuide })) {
            setGenerationError('Please complete all sections before generating tactics');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);

        try {
            const result = await generateTactics({
                brand,
                product,
                persona,
                goal,
                visualGuide
            });

            setTactics(result.tactics);
            console.log('Generated tactics:', result.tactics);
        } catch (error) {
            console.error('Error generating tactics:', error);
            setGenerationError(error instanceof Error ? error.message : 'Failed to generate tactics');
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
                    className={`px-8 h-12 rounded-lg border text-sm font-semibold transition-colors ${
                        isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)
                            ? 'bg-blue-600 border-blue-500 hover:bg-blue-700 cursor-pointer text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                    disabled={!(isCompleted(brand) && isCompleted(product) && isCompleted(persona) && isCompleted(goal) && isCompleted(visualGuide)) || isGenerating}
                    onClick={handleGenerateTactics}
                >
                    {isGenerating ? 'Generating...' : 'Generate Inspo'}
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
                <div className="rounded-lg p-4 border border-slate-700 shadow-lg bg-slate-900">
                    {tactics[0] ? (
                        <div className="space-y-3">
                            <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Image: {tactics[0].image}</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg">{tactics[0].title}</h3>
                            <p className="text-blue-400 text-sm font-medium">{tactics[0].oneLinerSummary}</p>
                            <p className="text-slate-300 text-sm">{tactics[0].fullDescription}</p>
                            <div className="pt-2 border-t border-slate-700">
                                <p className="text-slate-400 text-xs font-medium">Why it works:</p>
                                <p className="text-slate-300 text-xs">{tactics[0].whyItWorks}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500 text-sm">Tactic 1 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 2 */}
                <div className="rounded-lg p-4 border border-slate-700 shadow-lg bg-slate-900">
                    {tactics[1] ? (
                        <div className="space-y-3">
                            <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Image: {tactics[1].image}</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg">{tactics[1].title}</h3>
                            <p className="text-blue-400 text-sm font-medium">{tactics[1].oneLinerSummary}</p>
                            <p className="text-slate-300 text-sm">{tactics[1].fullDescription}</p>
                            <div className="pt-2 border-t border-slate-700">
                                <p className="text-slate-400 text-xs font-medium">Why it works:</p>
                                <p className="text-slate-300 text-xs">{tactics[1].whyItWorks}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500 text-sm">Tactic 2 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 3 */}
                <div className="rounded-lg p-4 border border-slate-700 shadow-lg bg-slate-900">
                    {tactics[2] ? (
                        <div className="space-y-3">
                            <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Image: {tactics[2].image}</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg">{tactics[2].title}</h3>
                            <p className="text-blue-400 text-sm font-medium">{tactics[2].oneLinerSummary}</p>
                            <p className="text-slate-300 text-sm">{tactics[2].fullDescription}</p>
                            <div className="pt-2 border-t border-slate-700">
                                <p className="text-slate-400 text-xs font-medium">Why it works:</p>
                                <p className="text-slate-300 text-xs">{tactics[2].whyItWorks}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500 text-sm">Tactic 3 will appear here</p>
                        </div>
                    )}
                </div>

                {/* Generated Card 4 */}
                <div className="rounded-lg p-4 border border-slate-700 shadow-lg bg-slate-900">
                    {tactics[3] ? (
                        <div className="space-y-3">
                            <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Image: {tactics[3].image}</span>
                            </div>
                            <h3 className="text-white font-semibold text-lg">{tactics[3].title}</h3>
                            <p className="text-blue-400 text-sm font-medium">{tactics[3].oneLinerSummary}</p>
                            <p className="text-slate-300 text-sm">{tactics[3].fullDescription}</p>
                            <div className="pt-2 border-t border-slate-700">
                                <p className="text-slate-400 text-xs font-medium">Why it works:</p>
                                <p className="text-slate-300 text-xs">{tactics[3].whyItWorks}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
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

        </div>
    )
}