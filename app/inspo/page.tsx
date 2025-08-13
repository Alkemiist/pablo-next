'use client'

// imports
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown, Plus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// The full component
export default function InspoPage() {

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const [sortValue, setSortValue] = useState("")

    // return component
    return (
        <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto">
            
            {/* the top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-neutral-950 shadow-lg h-[60px]">
                
                {/* Left side - Search, Filter, Sort */}
                <div className="flex items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-slate-500" />
                        <input
                            type="text"
                            placeholder="Search inspo"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 h-9 w-96 bg-transparent border border-slate-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <Select value={filterValue} onValueChange={setFilterValue}>
                        <SelectTrigger className="w-32 border-none cursor-pointer">
                            <Filter className="size-4 mr-2 stroke-slate-500 " />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border border-slate-700">
                            <SelectItem value="all" className="cursor-pointer hover:bg-slate-800">All Types</SelectItem>
                            <SelectItem value="image" className="cursor-pointer hover:bg-slate-800">Images</SelectItem>
                            <SelectItem value="video" className="cursor-pointer hover:bg-slate-800">Videos</SelectItem>
                            <SelectItem value="article" className="cursor-pointer hover:bg-slate-800">Articles</SelectItem>
                            <SelectItem value="design" className="cursor-pointer hover:bg-slate-800">Designs</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort Dropdown */}
                    <Select value={sortValue} onValueChange={setSortValue}>
                        <SelectTrigger className="w-32 border-none cursor-pointer">
                            <ArrowUpDown className="size-4 mr-2 stroke-slate-500" />
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border border-slate-700">
                            <SelectItem value="newest" className="cursor-pointer hover:bg-slate-800">Newest</SelectItem>
                            <SelectItem value="oldest" className="cursor-pointer hover:bg-slate-800">Oldest</SelectItem>
                            <SelectItem value="popular" className="cursor-pointer hover:bg-slate-800">Most Popular</SelectItem>
                            <SelectItem value="name" className="cursor-pointer hover:bg-slate-800">Name A-Z</SelectItem>
                            <SelectItem value="name-desc" className="cursor-pointer hover:bg-slate-800">Name Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Right side - Create Button */}
                <Link href="/inspo/create-inspo">
                    <Button 
                        className="gap-2 bg-neutral-800 hover:bg-blue-700 cursor-pointer w-32 border-neutral-600 border-1 border-solid"
                        >
                        <Plus className="size-4" />
                        Create
                    </Button>
                </Link>
            </div>

        </div>
    )
}