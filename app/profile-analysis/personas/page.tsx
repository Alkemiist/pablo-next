"use client"

// imports 
import { PersonaChart } from "@/app/components/ui/personas-chart/persona-chart";    
import { Bookmark } from "lucide-react";
import { personaChartInfo } from "@/lib/persona-chart-info";

export default function PersonasPage() {

    // get personas from personaChartInfo
    const personas = personaChartInfo.personas;

    return (
        <div className="flex">
            
            {/* Left Side: Persona Chart */}
            <div className="w-[60%]">
                <PersonaChart />
            </div>

            {/* Right Side: Persona Description */}
            <div className="w-[40%] border-l border-slate-700">
                
                {/* Section Title + Save Icon */}
                <div className="flex justify-between items-center px-8 py-4">
                    <h1 className="text-xl font-bold">Persona Name goes here</h1>
                    <button className="text-2xl border border-slate-700 rounded-lg p-2 hover:bg-slate-700 transition-colors duration-100 cursor-pointer">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>

                {/* Persona: Summary */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-sm font-bold">Summary:</div>
                    <div className="text-sm text-slate-500">
                        A storyteller at heart, this persona centers their content on family gatherings, 
                        personal milestones, and everyday celebrations that underscore community and warmth.
                    </div>
                </div>

                {/* Persona: Lifestyle and Behavior */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-sm font-bold">Lifestyle and Behavior:</div>
                    <div className="text-sm text-slate-500">
                        This persona is a family-oriented individual who values traditions, community, and shared experiences. 
                        They are likely to be active in local events, church activities, and family gatherings.
                    </div>
                </div>

                {/* Persona: Common interests */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-sm font-bold">Common interests:</div>
                    <div className="text-sm text-slate-500">
                        This persona is interested in family, community, and shared experiences. 
                        They are likely to be active in local events, church activities, and family gatherings.
                    </div>
                </div>

                {/* Persona Demographics and Characteristics */}
                <div className="flex flex-col gap-2 px-8 py-4">
                    <div className="text-sm font-bold">Demographics and Characteristics:</div>
                    <div className="text-sm text-slate-500">
                        This persona is a family-oriented individual who values traditions, community, and shared experiences. 
                        They are likely to be active in local events, church activities, and family gatherings.
                    </div>
                </div>

            </div>

        </div   >
    )
}