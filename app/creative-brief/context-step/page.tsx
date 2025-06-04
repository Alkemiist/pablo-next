'use client'

// imports 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TextareaAutosize from 'react-textarea-autosize';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function ContextStep() {
    return (
        <form className='flex flex-col gap-4 max-w-3xl mx-auto justify-center items-center h-screen'>

            {/* Title Section */}
            <div className='flex flex-col items-center justify-center'>
                <div className="text-2xl font-bold text-center px-4">
                    Step 2: Brand and Product Context
                </div>

                <p className='text-sm text-center px-4 py-4 max-w-3xl text-slate-500'>
                This helps define your voice and what you’re offering.
                A clear brand and product description guides the AI toward relevant, on-brand messaging.

                </p>
            </div>

            {/* Brand Select */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="brand" className='text-sm font-medium'>Select a Brand</label>
            <Select>
                <SelectTrigger className='border-slate-700 w-full rounded-lg text-left px-4 py-6 hover:border-indigo-700 cursor-pointer'>
                    <SelectValue placeholder="Select a Brand" />
                </SelectTrigger>
                <SelectContent className='bg-slate-950 border border-slate-700'>
                    <SelectItem value="home-base-1" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Brand One</SelectItem>
                    <SelectItem value="home-base-2" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Brand Two</SelectItem>
                    <SelectItem value="home-base-3" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Brand Three</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Product Select */}
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="product" className='text-sm font-medium'>Select a Product</label>
            <Select>
                <SelectTrigger className='border-slate-700 w-full rounded-lg text-left px-4 py-6 hover:border-indigo-700 cursor-pointer'>
                    <SelectValue placeholder="Select a Product" />
                </SelectTrigger>
                <SelectContent className='bg-slate-950 border border-slate-700'>
                    <SelectItem value="home-base-1" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Product One</SelectItem>
                    <SelectItem value="home-base-2" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Product Two</SelectItem>
                    <SelectItem value="home-base-3" className='bg-slate-950 hover:bg-slate-900 h-12 cursor-pointer'>Product Three</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Description Section */}
            <div className='w-full flex flex-col gap-2 max-w-3xl'>
                <label htmlFor="creativeBriefDescription" className='text-sm font-medium'>Describe the Desired Target Audience</label>
                <TextareaAutosize 
                placeholder="Ex. Our ideal user is a marketing manager (age 28–40) at a consumer tech or DTC brand, responsible for campaign execution. They’re data-driven, short on time, and need tools that streamline creative work, prove ROI, and reduce reliance on agencies. They value fast onboarding, intuitive UX, and integrations with Meta, TikTok, and Shopify. Success means higher-performing campaigns and faster creative output. " 
                className='w-full border px-4 py-4 resize-none border-slate-600 rounded-md max-w-3xl focus:border-indigo-700 focus:outline-none hover:border-indigo-700 animate-in fade-in-0 duration-300' 
                minRows={7}
                maxRows={10}
            />
            </div>

            {/* Exit and Continue Buttons */}   
            <div className='flex items-center justify-center gap-2 w-full max-w-3xl mt-8'>
                <Link 
                    href='/creative-brief' 
                    className='flex items-center justify-center gap-2 border border-slate-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-slate-800 transition-all duration-300 cursor-pointer'
                    >
                    <ArrowLeft className='w-4 h-4' />
                    Back
                    </Link>
                <Link 
                    href='/creative-brief/creative-step'
                    className='flex items-center justify-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-md w-full max-w-3xl mt-8 hover:bg-indigo-800 transition-all duration-300 cursor-pointer disabled:opacity-50'
                >
                    Continue <ArrowRight className='w-4 h-4' />
                </Link>
            </div>

        </form>
    )
}