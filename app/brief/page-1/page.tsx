'use client';

// imports
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ButtonStack } from '@/app/components/ui/button/button-stack';
import { useBriefData } from '@/app/context/briefcontext';


// this is the brief page 1 component
export default function BriefDetailsPage() {

    // variables & state
    const pathname = usePathname();

    // hooks
    const { briefName, setBriefName, brandDescription, setBrandDescription, productDescription, setProductDescription, targetAudience, setTargetAudience } = useBriefData();

    // this is the handle submit function
    const handleSubmit = () => {
        console.log('Form submitted');
    }


    return (

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-12 pt-12 pb-12 items-center overflow-y-auto h-screen">

            {/* This is the input for the brief name */}
            <div className="flex flex-col gap-4 container max-w-3xl mx-4">
                <label htmlFor="brief-name" className="block mb-1 font-medium">Brief Name</label>
                <input 
                type="text" 
                onChange={(e) => setBriefName(e.target.value)}
                id="brief-name" 
                name="brief-name" 
                placeholder="Ex. Next Great Campaign"
                className="border border-slate-700 rounded-lg px-4 py-2 text-sm text-left max-w-3xl" 
                />
            </div>

            {/* This is the input for the brand + brand description */}
            <div className="flex flex-col gap-6 container max-w-3xl mx-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="brief-name" className="block mb-1 font-medium">Tell us about your brand</label>
                    <p className="flex flex-col gap-2 flex-wrap w-auto text-sm text-left text-slate-500">
                        Your brand sets the creative tone. From coice and values to look and feel, everything stems from this choice. selecting the right brand ensures that every idea that follows is on-brand and strategically aligned. 
                    </p>
                </div>
                <textarea 
                id="about-brand" 
                name="about-brand" 
                onChange={(e) => setBrandDescription(e.target.value)}
                placeholder="Give us your brand name and a brief description"
                className="border border-slate-700 rounded-lg px-4 py-2 text-sm text-left align-top w-auto h-32 resize-none" 
                />
            </div>

            {/* This is the input for the product + product description */}
            <div className="flex flex-col gap-6 container max-w-3xl mx-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="brief-name" className="block mb-1 font-medium">Tell us about your product</label>
                    <p className="flex flex-col gap-2 flex-wrap w-auto text-sm text-left text-slate-500">
                    This is the centerpiece of your campaign. Choosing the product sharpens the focus of the creative—helping tailor messaging, visuals, and value props around what makes this specific item compelling. 
                    </p>
                </div>
                <textarea 
                id="about-product" 
                name="about-product" 
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Give us the product name and a brief description"
                className="border border-slate-700 rounded-lg px-4 py-2 text-sm text-left align-top w-auto h-32 resize-none" 
                />
            </div>

            {/* This is the input for target audience */}
            <div className="flex flex-col gap-6 container max-w-3xl mx-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="brief-name" className="block mb-1 font-medium">Who's your target audience?</label>
                    <p className="flex flex-col gap-2 flex-wrap w-auto text-sm text-left text-slate-500">
                    Your audience drives the direction. The persona you choose will shape how ideas are crafted—from tone and platform to style and emotional hook. The more dialed-in your audience, the more effective the creative. 
                    </p>
                </div>
                <textarea 
                id="about-product" 
                name="about-product" 
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Give us a brief description of your target audience"
                className="border border-slate-700 rounded-lg px-4 py-2 text-sm text-left align-top w-auto h-32 resize-none" 
                />
            </div>

            <Link href="/brief/page-2" className="bg-slate-800 text-white px-12 py-4 rounded-lg hover:bg-slate-700 transition-colors duration-300">Continue</Link>


        </form>
    )
}