'use client'

// imports
import { useState } from "react"


// The full component
export default function CreateInspoPage() {

    // state of inputs
    const [brand, setBrand] = useState<string>('');
    const [product, setProduct] = useState<string>('');
    const [persona, setPersona] = useState<string>('');
    const [goal, setGoal] = useState<string>('');
    const [visualGuide, setVisualGuide] = useState<string>('');

    
    return (

        <div>
            
            {/* Component Bar */}
            <div className="flex justify-between items-center border-b border-slate-700 bg-slate-900 py-4 px-8 sticky top-0 z-10 h-[80px]">

                {/* Left Side: User selects/ adds all of the context we need in order to generate the inspo -------------------------------- */}
                <div className="flex gap-4">

                    {/* Select Brand */}
                    <div className="flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700">
                        <div className="w-4 h-4 bg-slate-800 rounded-sm border border-slate-700">
                            {/* This will be filled in when the brand is selected */}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">Select</p>
                            <p className="text-sm text-slate-500">Brand</p>
                        </div>
                    </div>

                    {/* Select Product */}
                    <div className="flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700">
                        <div className="w-4 h-4 bg-slate-800 rounded-sm border border-slate-700">
                            {/* This will be filled in when the brand is selected */}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">Select</p>
                            <p className="text-sm text-slate-500">Product</p>
                        </div>
                    </div>

                    {/* Select Persona */}
                    <div className="flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700">
                        <div className="w-4 h-4 bg-slate-800 rounded-sm border border-slate-700">
                            {/* This will be filled in when the brand is selected */}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">Select</p>
                            <p className="text-sm text-slate-500">Persona</p>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div className="flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700">
                        <div className="w-4 h-4 bg-slate-800 rounded-sm border border-slate-700">
                            {/* This will be filled in when the brand is selected */}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">Add</p>
                            <p className="text-sm text-slate-500">Goal</p>
                        </div>
                    </div>

                    {/* Add Visual Guide */}
                    <div className="flex items-center gap-4 rounded-lg px-8 py-2 border border-slate-700">
                        <div className="w-4 h-4 bg-slate-800 rounded-sm border border-slate-700">
                            {/* This will be filled in when the brand is selected */}
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold">Add</p>
                            <p className="text-sm text-slate-500">Visual Guide</p>
                        </div>
                    </div>

                </div>

                
                {/* Right Side: Is the "imagine" button that triggers the generative to start with all of the added context -------------------------------- */}
                <button className="bg-slate-800 px-8 h-12 rounded-lg border border-slate-700 hover:bg-blue-700 cursor-pointer text-sm font-semibold">
                    Generate Inspo
                </button>

            </div>

            {/* Inpo Card Section: The generated inspo cards are displayed here -------------------------------- */}
            <div className='mx-8 h-[calc(100vh-80px)] grid grid-cols-2 grid-rows-2 gap-4 p-8'>
                
                {/* Generated Card 1 */}
                <div className="rounded-lg p-4 border-dashed border-slate-700 border-1 shadow-lg">
                    {/* This will be filled in when the inspo is generated */}
                </div>

                {/* Generated Card 2 */}
                <div className="rounded-lg p-4 border-dashed border-slate-700 border-1 shadow-lg">
                    {/* This will be filled in when the inspo is generated */}
                </div>

                {/* Generated Card 3 */}
                <div className="rounded-lg p-4 border-dashed border-slate-700 border-1 shadow-lg">
                    {/* This will be filled in when the inspo is generated */}
                </div>

                {/* Generated Card 4 */}
                <div className="rounded-lg p-4 border-dashed border-slate-700 border-1 shadow-lg">
                    {/* This will be filled in when the inspo is generated */}
                </div>

            </div>


        </div>
    )
}