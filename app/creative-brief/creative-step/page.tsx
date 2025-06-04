'use client'

// imports 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowLeft, ArrowRight, Rocket, X } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useState } from 'react';


export default function ContextStep() {

    // image picker functionality
    // image picker functionality
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ fileName, setFileName ] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    return (
        <form className='flex flex-col gap-4 max-w-3xl mx-auto justify-center items-center h-screen'>

            {/* Title Section */}
            <div className='flex flex-col items-center justify-center'>
                <div className="text-2xl font-bold text-center px-4">
                    Step 3: Define Your Creative Direction
                </div>

                <p className='text-sm text-center px-4 py-4 max-w-3xl text-slate-500'>
                    Style, tone, and strategic context make all the difference.
                    We’ll use these inputs to shape content that’s not just relevant—but resonant.

                </p>
            </div>

            {/* Tone or Voice */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>Tone or Voice</label>
                <TextareaAutosize 
                placeholder="Ex. Confident but playful, Conversational and real, Minimalist and bold" 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={1}
                maxRows={10}
            />
            </div>

            {/* Platform or Channel */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>Platform or Channel</label>
                <TextareaAutosize 
                placeholder="Ex. Instagram Reels, TikTok, YouTube Shorts, Meta Ads" 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={1}
                maxRows={10}
            />
            </div>

            {/* Visual Style or mood */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>Visual Style or Mood</label>
                <TextareaAutosize 
                placeholder="Ex. Vibrant and fast-paced, Lo-fi home-shot feel, Moody and cinematic" 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={1}
                maxRows={10}
            />
            </div>

            {/* References or Inspiration */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>References or Inspiration</label>
                <TextareaAutosize 
                placeholder="Ex. Like a mix between Duolingo TikToks and Notion product shots" 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={1}
                maxRows={10}
            />
            </div>

            {/* Image Picker */}
            <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="productImage" className='text-sm font-medium'>Upload a Reference Image (Optional)</label>
                    <div 
                        className='flex justify-between items-center gap-2 border border-slate-700 w-full text-sm rounded-lg px-4 py-4 text-left border-dashed cursor-pointer hover:border-indigo-700 transition-all duration-300' 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {fileName ? fileName : 'Upload Reference Image'}
                        <X 
                            className='w-4 h-4 stroke-slate-500 cursor-pointer' 
                            onClick={(e) => {
                                setFileName(null);
                                e.stopPropagation();
                            }} 
                        />
                    </div>

                    {/* Hidden file input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className='hidden' 
                    />
                </div>

            {/* Exit and Continue Buttons */}   
            <div className='flex items-center justify-center gap-2 w-full max-w-3xl mt-8'>
                <Link 
                    href='/creative-brief/context-step' 
                    className='flex items-center justify-center gap-2 border border-slate-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-slate-800 transition-all duration-300 cursor-pointer'
                    >
                    <ArrowLeft className='w-4 h-4' />
                    Back
                    </Link>
                <Link 
                    href='/creative-brief/creative-step'
                    className='flex items-center justify-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-indigo-800 transition-all duration-300 cursor-pointer disabled:opacity-50'
                >
                    Create Brief <Rocket className='w-4 h-4' />
                </Link>
            </div>

        </form>
    )
}