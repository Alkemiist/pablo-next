'use client';

// imports
import { Rocket } from "lucide-react";
import { Search } from "lucide-react";
import { ListFilter } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";


export default function IntelligenceTopBar() {
    
    // initialise state
    const [ search, setSearch ] = useState( '' );
    const [ filterOpen, setFilterOpen ] = useState( false );
    const [ sortOpen, setSortOpen ] = useState( false );

    console.log( filterOpen );
    console.log( sortOpen );


    return (

        // the parent div
        <div className="bg-slate-900 flex items-center px-12 py-4 ">

            {/* the left side of the top bar */}
            <div className="flex-1 flex gap-8 text-left relative items-center">

                {/* the search input */}
                <input type="search" placeholder="Search" className="hidden md:flex bg-slate-800 w-full lg:w-1/2 border pl-12 border-slate-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-white transition-colors duration-300" />
                <Search className="hidden md:flex w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                {/* the filter button */}
                <div className="relative">
                    <button className='hidden md:flex items-center gap-2 cursor-pointer' onClick={ () => setFilterOpen( !filterOpen ) }><ListFilter className="w-4 h-4" />Filter<ChevronDown className="w-4 h-4 opacity-50" /></button>
                    {
                        filterOpen && (
                            <div className="absolute flex flex-col border mt-10 md:w-60 bg-slate-900 border-slate-700 text-white rounded-md">
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-300 rounded-md px-4 py-4">Filter Number One</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-300 rounded-md px-4 py-4">Filter Number Two</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-300 rounded-md px-4 py-4">Filter Number Three</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-300 rounded-md px-4 py-4">Filter Number Four</a>
                            </div>
                        )
                    }
                </div>

                {/* the sort button */}
                <div className="relative">
                    <button className='hidden md:flex items-center gap-2 cursor-pointer' onClick={ () => setSortOpen( !sortOpen ) }><ArrowDownUp className="w-4 h-4 " />Sort<ChevronDown className="w-4 h-4 opacity-50" /></button>
                </div>

            </div>

            {/* the right side of the top bar */}
            <div className="flex flex-1 justify-end">
                <button className="flex items-center gap-4 bg-slate-800 border border-slate-700 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer">Create<Plus className="w-4 h-4 mr-2" /></button>
            </div>
            
            
        </div>
    )
} 