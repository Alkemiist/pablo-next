'use client';

// imports
import { Search, ListFilter, ArrowDownUp, ChevronDown, Pencil, Plus, FileText, Video, Image } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 


export default function IntelligenceTopBar() {
    
    // initialise state
    const [ createOpen, setCreateOpen ] = useState( false );
    const createRef = useRef<HTMLDivElement>(null);
    

    // Click outside of create ref ( the create button )
    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {
            if (createRef.current && !createRef.current.contains(event.target as Node)) {
                setCreateOpen(false);
            }
        }

        // add event listener to document
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (

        // the parent div bg-slate-900
        <div className=" sticky top-0 z-10 flex items-center px-12 py-3 pt-8 pb-4 bg-slate-950 shadow-lg"> 

            {/* the left side of the top bar */}
            <div className="flex-1 flex gap-8 text-left relative items-center">

                {/* the search input */}
                <input type="search" placeholder="Search" className="hidden lg:flex bg-slate-900 lg:w-1/4 border pl-12 border-slate-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-white transition-colors duration-300" />
                <Search className="hidden lg:flex w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                {/* the filter select */}
                <Select>
                    <SelectTrigger className=" border-none text-white cursor-pointer outline-none">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 text-white rounded-md shadow-xl border border-slate-700 w-56 ">
                        <SelectItem value="Filter One" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter One</SelectItem>
                        <SelectItem value="Filter Two" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Two</SelectItem>
                        <SelectItem value="Filter Three" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Filter Three</SelectItem>
                    </SelectContent>
                </Select>

                {/* the sort select */}
                <Select>
                    <SelectTrigger className=" border-none text-white cursor-pointer outline-none">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 text-white rounded-md shadow-xl w-56 border border-slate-700">
                        <SelectItem value="date-created" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Date Created</SelectItem>
                        <SelectItem value="date-updated" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Date Updated</SelectItem>
                        <SelectItem value="name-asc" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Name A-Z</SelectItem>
                        <SelectItem value="name-desc" className="cursor-pointer hover:bg-slate-800 transition-colors duration-100 px-4 py-4">Name Z-A</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            {/* the right side of the top bar */}
            <div className="flex flex-1 gap-4 justify-end sm:flex-none">
                {/* <button className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"><Pencil className="w-4 h-4" /></button> */}
                <button 
                    className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer relative"
                    onClick={ () => setCreateOpen( !createOpen ) }
                >
                    Create
                    <Plus className="w-4 h-4 mr-2" />
                </button>
                {
                    createOpen && (
                        <div ref={createRef} className="absolute flex flex-col border mt-14 md:w-60 bg-slate-900 border-slate-700 text-white rounded-md shadow-xl">
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Thing One <Image className="w-5 h-5 stroke-slate-600" /></a>
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Thing Two <Video className="w-5 h-5 stroke-slate-600" /></a>
                            <a href="#" className="hover:bg-slate-800 transition-colors duration-100 px-4 py-4 flex items-center justify-between">New Thing Three <FileText className="w-5 h-5 stroke-slate-600" /></a>
                        </div>
                    )
                }
            </div>
            
            
        </div>
    )
} 