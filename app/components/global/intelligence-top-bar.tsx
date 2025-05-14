'use client';

// imports
import { Rocket } from "lucide-react";
import { Search } from "lucide-react";
import { ListFilter } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Pencil } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Video } from "lucide-react";
import { Image } from "lucide-react";


export default function IntelligenceTopBar() {
    
    // initialise state
    const [ search, setSearch ] = useState( '' );
    const [ filterOpen, setFilterOpen ] = useState( false );
    const [ sortOpen, setSortOpen ] = useState( false );
    const [ createOpen, setCreateOpen ] = useState( false );

    console.log( filterOpen );
    console.log( sortOpen );


    return (

        // the parent div bg-slate-900
        <div className=" sticky top-0 z-10 flex items-center px-12 py-3 pt-8 pb-4 bg-slate-950 shadow-lg"> 

            {/* the left side of the top bar */}
            <div className="flex-1 flex gap-8 text-left relative items-center">

                {/* the search input */}
                <input type="search" placeholder="Search" className="hidden lg:flex bg-slate-900 lg:w-1/4 border pl-12 border-slate-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-white transition-colors duration-300" />
                <Search className="hidden lg:flex w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                {/* the filter button */}
                <div className="relative">
                    <button className='hidden md:flex items-center gap-2 cursor-pointer' onClick={ () => setFilterOpen( !filterOpen ) }><ListFilter className="w-4 h-4" />Filter<ChevronDown className={`w-4 h-4 transition-transform duration-300 ${ filterOpen ? 'rotate-180' : 'opacity-50' }`} /></button>
                    {
                        filterOpen && (
                            <div className="absolute flex flex-col border mt-4 md:w-60 bg-slate-900 border-slate-700 text-white rounded-md">
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Number One</a> 
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Number Two</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Number Three</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Number Four</a>
                            </div>
                        )
                    } 
                </div>

                {/* the sort button */}
                <div className="relative">
                    <button className='hidden md:flex items-center gap-2 cursor-pointer' onClick={ () => setSortOpen( !sortOpen ) }><ArrowDownUp className="w-4 h-4 " />Sort<ChevronDown className={`w-4 h-4 transition-transform duration-300 ${ sortOpen ? 'rotate-180' : 'opacity-50' }`} /></button>
                    {
                        sortOpen && (
                            <div className="absolute flex flex-col border mt-4 md:w-60 bg-slate-900 border-slate-700 text-white rounded-md">
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Sort Number One</a>
                                <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Sort Number Two</a>
                            </div>
                        )
                    }
                </div>

            </div>

            {/* the right side of the top bar */}
            <div className="flex flex-1 gap-4 justify-end sm:flex-none">
                <button className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                <button 
                    className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer relative"
                    onClick={ () => setCreateOpen( !createOpen ) }
                >
                    Create
                    <Plus className="w-4 h-4 mr-2" />
                </button>
                {
                    createOpen && (
                        <div className="absolute flex flex-col border mt-14 md:w-60 bg-slate-900 border-slate-700 text-white rounded-md shadow-xl">
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Image <Image className="w-5 h-5 stroke-slate-600" /></a>
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Video <Video className="w-5 h-5 stroke-slate-600" /></a>
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Brief <FileText className="w-5 h-5 stroke-slate-600" /></a>
                        </div>
                    )
                }
            </div>
            
            
        </div>
    )
} 