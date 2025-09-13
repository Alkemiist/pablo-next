"use client"

// imports 
import { PersonaChart } from "@/app/components/ui/personas-chart/persona-chart";    
import { Bookmark } from "lucide-react";
import { personaChartInfo } from "@/lib/persona-chart-info";
import { useState, useMemo } from "react";

export default function PersonasPage() {

    // get personas from personaChartInfo
    const personas = personaChartInfo.personas;
    
    // Lift state up - manage activePersona at the parent level
    const [activePersona, setActivePersona] = useState(personas[0].name);
    
    // Find the active persona data based on the selected persona name
    const activePersonaData = useMemo(() => {
        return personas.find(persona => persona.name === activePersona) || personas[0];
    }, [activePersona, personas]);

    // Get top brands
    const topBrands = activePersonaData.topBrands;

    return (
        <div className="flex h-[calc(100vh-60px)]">
            
            {/* Left Side: Persona Chart */}
            <div className="w-[60%] h-full">
                <PersonaChart 
                    activePersona={activePersona}
                    setActivePersona={setActivePersona}
                />
            </div>

            {/* Right Side: Persona Description */}  
            <div className="w-[40%] border-l border-green-800/30 h-full overflow-y-auto relative pb-8">

                {/* Persona: Persona Image Banner */}
                <div className="flex justify-center items-center px-8 py-4 h-[500px] rounded-xl overflow-hidden">
                    <img src={activePersonaData.imageUrl} alt={activePersonaData.name} className="w-full h-full object-cover rounded-xl border shadow-lg" />
                </div>
                
                {/* Section Title + Save Icon */}
                <div className="flex justify-between items-center px-8 pt-8 pb-4">
                    <h1 className="text-2xl font-bold">{activePersonaData.name}</h1>
                    <button title="Save Audience" className="flex items-center gap-2 px-4 text-xs border border-green-800/30 rounded-lg p-2 hover:bg-slate-700 transition-colors duration-100 cursor-pointer">
                        Save Audience <Bookmark className="w-4 h-4"  />
                    </button>
                </div>

                {/* Persona: Summary */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-md font-bold">Summary:</div>
                    <div className="text-sm text-slate-500">
                        {activePersonaData.summary}
                    </div>
                </div>

                {/* Persona: Lifestyle and Behavior */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-md font-bold">Lifestyle and Behavior:</div>
                    <div className="text-sm text-slate-500">
                        {activePersonaData.lifestyleAndBehavior}
                    </div>
                </div>

                {/* Persona: Common interests */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-md font-bold">Common interests:</div>
                    <div className="text-sm text-slate-500">
                        {activePersonaData.commonInterests}
                    </div>
                </div>

                {/* Persona Demographics and Characteristics */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-md font-bold">Demographics and Characteristics:</div>
                    <div className="text-sm text-slate-500">
                        {activePersonaData.demographicsAndCharacteristics}
                    </div>
                </div>

                { /* Persona: Top Brands */}
                <div className="flex flex-col gap-4 px-8 py-4">
                    <div className="text-md font-bold">Top Brands:</div>
                    <div className="text-sm text-slate-500 flex flex-wrap gap-2">
                        {topBrands.map((brand: string) => (
                            <div 
                                key={brand} 
                                className="text-sm text-slate-500 border border-slate-700 rounded-lg px-4 py-2"
                            >
                                    {brand}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Persona: CTA to see more */}
                {/* <div className="flex justify-center items-center px-8 py-2 absolute bottom-0 left-0 right-0 bg-blue-800 hover:bg-blue-900 cursor-pointer">
                    <button className="text-sm font-bold cursor-pointer">Save Audience</button>
                </div> */}

            </div>

        </div>
    )
}