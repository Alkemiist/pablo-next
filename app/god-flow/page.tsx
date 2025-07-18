'use client'

// imports 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TextIcon, ImageIcon, VideoIcon, SendIcon, CheckIcon, Plus, SettingsIcon, UploadIcon, Spade, Settings2, X, Check, Loader2 } from "lucide-react";
import TextAreaAutosize from "react-textarea-autosize";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import axios from "axios";

// object that contains the suggestions
const suggestionObject = {
  text: [
    "Short and sweet",
    "Long and detailed",
    "Funny",
    "Formal",
    "Casual",
    "Professional",
    "Creative",
    "Technical",
    "Educational",
    "Motivational",
    "Inspiring",
    "Persuasive",
    "Narrative",
    "Poetic",
    "Satirical",
    "Philosophical",
    "Historical",
    "Biographical",
    "Descriptive",
    "Expository",
    "Explanatory",
    "Technical",
    "Educational",
    "Motivational",
    "Inspiring",
    "Persuasive",
    "Narrative",
    "Poetic",
  ],
  image: [
    "Photorealistic",
    "Cartoonish",
    "Abstract",
    "Minimalist",
    "Colorful",
    "Black and white",
    "High contrast",
    "Low contrast",
    "High saturation",
    "Low saturation",
    "High brightness",
    "Low brightness",
    "High contrast",
    "Low contrast",
    "Anime-ish",
    "Realistic",
    "Digital art",
    "Hand-drawn",
    "3D",
    "2D",
    "Vector",
    "Pixel art",
    "Low poly",
    "High poly",
    "Low detail",
    "High detail",
    "Low resolution",
    "High resolution",
    "Low quality",
  ],
  video: [
    "Cinematic",
    "Documentary",
    "Narrative",
    "Educational",
    "Motivational",
    "Inspiring",
    "Narrative",
    "Orange & Teal",
    "Animation",
    "Diffused Lighting",
    "Backlit",
    "Handheld",
    "Wide Angle",
    "Low FPS",
    "Over the Shoulder",
    "50mm",
    "Realistic",
    "Digital art",
    "Hand-drawn",
    "3D",
    "2D",
    "Vector",
    "Pixel art",
    "Low poly",
    "High poly",
    "Low detail",
    "High detail",
    "Low resolution",
    "High resolution",
    "Low quality",
  ]
}


export default function GodFlow() {

    // State Variables
    const [contentType, setContentType] = useState("text")
    const [ textInput, setTextInput ] = useState("")
    const [clickedSuggestions, setClickedSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Function to add a suggestion to the prompt box
    const addSuggestionToTextInput = (clickedSuggestion: string) => {
      const newTextInput = textInput + " " + clickedSuggestion;
      setTextInput(newTextInput)
      setClickedSuggestions(prev => [...prev, clickedSuggestion]);
    }

    // Function to remove a suggestion from the prompt box
    const removeSuggestionFromTextInput = (clickedSuggestion: string) => {
      const newTextInput = textInput.replace(clickedSuggestion, "");
      setTextInput(newTextInput)
      setClickedSuggestions(prev => prev.filter(suggestion => suggestion !== clickedSuggestion));
    }

    // Function to generate content using OpenAI
    const generateContent = async () => {
      if (!textInput.trim()) {
        setError("Please enter a prompt");
        return;
      }

      setIsLoading(true);
      setError(null);
      setGeneratedContent(null);

      try {
        const response = await axios.post('/api/generate', {
          prompt: textInput,
          contentType: contentType,
          model: "gpt-image-3.5-turbo",
        });

        if (response.data.success) {
          if (contentType === 'text') {
            setGeneratedContent(response.data.data.choices[0].message.content);
          } else if (contentType === 'image') {
            setGeneratedContent(response.data.data.data[0].url);
          }
        } else {
          setError(response.data.error || 'Failed to generate content');
        }
      } catch (err: any) {
        console.error('Generation error:', err);
        setError(err.response?.data?.error || 'Failed to generate content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Placeholder variables for the prompt box
    let placeholderText = ``;

    if (contentType === "text") {
      placeholderText = `Ex. Write a press release addressing a new product I am releasing in Christmas. Make it fun but formal. Make it 1000 words` 
    } else if (contentType === "image") {
      placeholderText = "Ex. Create an image of a cat in a Santa hat in the middle of a tornado trying to grab a slice of cake floating around."
    } else if (contentType === "video") {
      placeholderText = "Ex. Create a video of a cat in a Santa hat running around a Christmas tree. Make it fun, playful and cinematic. The cat should be running around the tree and trying to grab a slice of cake floating around."
    }

    return (

      <div className="flex gap-4 w-full">

        {/* Left Side: Output UI ------------------------------------------------------------ */}
        <div className="flex justify-center items-center border border-slate-800 p-4 flex-1 h-screen mx-2">
          <div className="w-full h-full flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-400">Generating your {contentType}...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-400 text-center mb-4">{error}</p>
                <button 
                  onClick={generateContent}
                  className="bg-blue-700 border border-slate-700 rounded-md px-4 py-2 text-slate-200 hover:bg-blue-800 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : generatedContent ? (
              <div className="w-full h-full overflow-auto">
                {contentType === 'text' ? (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                ) : contentType === 'image' ? (
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={generatedContent} 
                      alt="Generated content" 
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="text-slate-400">Generated content will appear here</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400">Generated content will appear here</p>
            )}
          </div>
        </div>

        {/* Right Side: God Flow Component ------------------------------------------------------------ */}
        <div className="flex flex-col gap-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 w-[500px] my-auto mr-4">

          {/* content type title // icon selector ------------------------------------------------------------ */}
            <div className="flex items-center justify-between">
              <p className='text-slate-400 text-sm ml-2'>Content Type:</p>
              <Tabs defaultValue="text" className="flex">
                  <TabsList className='bg-slate-900 border border-slate-800 rounded-lg px-2 gap-8'>
                    <TabsTrigger 
                      value="text" 
                      className={`${contentType === 'text' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('text')}
                    >
                        <TextIcon />
                    </TabsTrigger>
                    <TabsTrigger 
                      value="image" 
                      className={`${contentType === 'image' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('image')}
                    >
                        <ImageIcon />
                    </TabsTrigger>
                    <TabsTrigger 
                      value="video" 
                      className={`${contentType === 'video' ? 'bg-slate-800 border border-slate-700' : ''} cursor-pointer rounded-md px-2 transition-all duration-300`}
                      onClick={() => setContentType('video')}
                    >
                        <VideoIcon />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
            </div>

          {/* Prompt box ------------------------------------------------------------ */}
          <div className="relative">
            <TextAreaAutosize
              className="resize-none w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-400 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder={placeholderText}
              value={textInput}
              minRows={14}
              maxRows={14}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button 
              className="absolute right-4 bottom-4 bg-blue-700 border border-slate-700 rounded-md px-2 py-2 hover:bg-blue-800 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateContent}
              disabled={isLoading || !textInput.trim()}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-800 my-2"></div>

          {/* Bubble suggestions ------------------------------------------------------------ */}
          <div className='border border-slate-800 rounded-lg h-65 overflow-y-auto w-full flex flex-wrap gap-2 p-2'>
            {
              suggestionObject[contentType as keyof typeof suggestionObject].map((suggestion, index) => (
                <div 
                  key={index}
                  className={`${clickedSuggestions.includes(suggestion) ? 'border border-blue-700 text-xs px-5 cursor-pointer hover:bg-slate-700 rounded-md p-2 w-fit flex items-center gap-2 transition-all duration-0 bg-blue-800' : 'border border-slate-700 text-xs px-5 cursor-pointer hover:bg-slate-700 rounded-md p-2 w-fit flex items-center gap-2 transition-all duration-0 bg-slate-800'}`}
                  onClick={() => {
                    if (clickedSuggestions.includes(suggestion)) {
                      removeSuggestionFromTextInput(suggestion);
                    } else {
                      addSuggestionToTextInput(suggestion);

                    }
                  }}
                >
                  {clickedSuggestions.includes(suggestion) ? <Check className="w-4 h-4 text-slate-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
                  {suggestion}
                </div>
              ))
            }
          </div>

          {/* Button stack bar ------------------------------------------------------------ */}
          <div className="flex items-center gap-2">
            {/* Settings button */}
            {/* <button 
              className="bg-slate-900 border w-12 border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
            </button> */}
            {/* Upload Files button */}
            <button 
              className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-900 border border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer">
              <UploadIcon className="w-4 h-4" /> Upload Files
            </button>
            {/* Use Assets button */}
            <button 
              className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-900 border border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer">
              <Spade className="w-4 h-4" /> Use Assets
            </button>
          </div>

        </div>

      </div>
    );
}