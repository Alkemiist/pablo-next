'use client'

// imports 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TextIcon, ImageIcon, VideoIcon, SendIcon, CheckIcon, Plus, SettingsIcon, UploadIcon, Spade, Settings2 } from "lucide-react";
import TextAreaAutosize from "react-textarea-autosize";

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

    // state
    const [contentType, setContentType] = useState("text")
    const [ textInput, setTextInput ] = useState("")
    
    // array to store the clicked suggestions
    const clickedSuggestions: string[] = [];

    // function to add a suggestion to the typed text + suggestion
    const addSuggestionToTextInput = (clickedSuggestion: string) => {
      
      // add the suggestion to the text input
      const newTextInput = textInput + " " + clickedSuggestion;
      // set the text input to the new text input
      setTextInput(newTextInput)

    }

    {/* placeholder text */}
    let placeholderText = `Ex. Write a press release addressing a new product I am releasing in Christmas. Make it fun but formal.`

    if (contentType === "text") {
      placeholderText = `Ex. Write a press release addressing a new product I am releasing in Christmas. Make it fun but formal.` 
    } else if (contentType === "image") {
      placeholderText = "Ex. Create an image of a cat in a Santa hat in the middle of a tornado trying to grab a slice of cake floating around."
    } else if (contentType === "video") {
      placeholderText = "Ex. Create a video of a cat in a Santa hat running around a Christmas tree. Make it fun, playful and cinematic. The cat should be running around the tree and trying to grab a slice of cake floating around."
    }

    return (

      <div>

        {/* Entire god Flow Component */}
        <div className="flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 bg-slate-900 rounded-2xl p-4 border border-slate-800 min-w-[500px] max-w-[500px]">

          {/* content type title // icon selector */}
            <div className="flex items-center justify-between">
              <p className='text-slate-400 text-sm'>Content Type:</p>
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

          {/* prompt box */}
          <div className="relative">
            <TextAreaAutosize
              className="resize-none w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-400 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder={placeholderText}
              value={textInput}
              minRows={16}
              maxRows={16}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button 
              className="absolute right-4 bottom-4 bg-blue-700 border border-slate-700 rounded-md px-2 py-2 hover:bg-blue-800 transition-all duration-300 cursor-pointer"
              onClick={() => console.log(textInput)}
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>

          {/* bubble suggestions */}
          <div className='border border-slate-800 rounded-lg h-65 overflow-y-auto w-full flex flex-wrap gap-2 p-2'>
            {
              suggestionObject[contentType as keyof typeof suggestionObject].map((suggestion, index) => (
                <div 
                  key={index}
                  className={`border border-slate-700 text-xs px-5 cursor-pointer hover:bg-slate-700 rounded-md p-2 w-fit flex items-center gap-2 transition-all duration-300 bg-slate-800`}
                  onClick={() => {
                    addSuggestionToTextInput(suggestion)
                    clickedSuggestions.push(suggestion)
                  }}
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                  {suggestion}
                </div>
              ))
            }
          </div>

          {/* Button stack bar */}
          <div className="flex items-center gap-2">
            <button className="bg-slate-900 border w-12 border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer">
              <Settings2 className="w-4 h-4" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-900 border border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer">
              <UploadIcon className="w-4 h-4" /> Upload Files
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-900 border border-slate-800 rounded-md px-4 py-2 text-slate-400 hover:bg-slate-700 transition-all duration-300 cursor-pointer">
              <Spade className="w-4 h-4" /> Use Assets
            </button>
          </div>

        </div>

      </div>
    );
}