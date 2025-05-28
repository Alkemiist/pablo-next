'use client';

// imports
import TextareaAutosize from 'react-textarea-autosize';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { useState } from 'react';

export default function CreativeBrief() {

    // the return statement
    return (

        <div className='ml-2 flex flex-col gap-4 items-center justify-center px-4 h-screen'>

            {/* Title Section */}
            <div className='flex flex-col gap-2 items-center justify-center mb-4'>
                <div className="text-2xl font-bold text-center px-4">
                    Describe your project in detail
                </div>

                <p className='text-sm text-center px-4 py-4 max-w-3xl text-slate-500'>
                    Think of this as your creative brief—what you say here guides the tone, style, and story we generate.
                </p>
            </div>

            {/* Description Section */}
            <TextareaAutosize 
                placeholder="Ex. 30s commercial for 'Chromatique'—a makeup-inspired electric car brand. Show bold color, sleek design, and self-expression. Target creative, fashion-forward drivers. Tone: stylish, modern, and empowering. End with a CTA to book a test drive." 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700' 
                minRows={5}
                maxRows={10}
            />

            {/* Creative Type Section */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                    <label htmlFor="brandAffiliation" className='text-sm font-medium'></label>
                    <Select>
                        <SelectTrigger className='border-slate-700 w-full rounded-lg text-left px-4 py-6 hover:border-indigo-700 cursor-pointer'>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-950 border border-slate-700'>
                            <SelectItem value="image" className='bg-slate-950 hover:bg-slate-900 h-12'>Image</SelectItem>
                            <SelectItem value="text" className='bg-slate-950 hover:bg-slate-900 h-12'>Text</SelectItem>
                            <SelectItem value="video" className='bg-slate-950 hover:bg-slate-900 h-12'>Video</SelectItem>
                            <SelectItem value="hybrid" className='bg-slate-950 hover:bg-slate-900 h-12'>Image + Text</SelectItem>
                            <SelectItem value="video" className='bg-slate-950 hover:bg-slate-900 h-12'>Video + Text</SelectItem>
                        </SelectContent>
                    </Select>
            </div>

            <button className='bg-indigo-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-indigo-800 transition-all duration-300 cursor-pointer'>Continue</button>

        </div>
    )
}