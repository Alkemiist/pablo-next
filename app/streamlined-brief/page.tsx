'use client'

// imports
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown, Plus, FileText, Calendar, User, Loader2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BriefMetadata } from "@/lib/brief-storage"

// The full component
export default function StreamlinedBriefPage() {
    const router = useRouter();

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const [sortValue, setSortValue] = useState("")
    const [savedBriefs, setSavedBriefs] = useState<BriefMetadata[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load briefs from API
    useEffect(() => {
        const loadBriefs = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/briefs')
                
                if (!response.ok) {
                    throw new Error('Failed to load briefs')
                }
                
                const data = await response.json()
                setSavedBriefs(data.briefs || [])
            } catch (err) {
                console.error('Error loading briefs:', err)
                setError(err instanceof Error ? err.message : 'Failed to load briefs')
            } finally {
                setIsLoading(false)
            }
        }

        loadBriefs()
    }, [])

    // Refresh briefs function
    const refreshBriefs = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/briefs')
            
            if (!response.ok) {
                throw new Error('Failed to load briefs')
            }
            
            const data = await response.json()
            setSavedBriefs(data.briefs || [])
        } catch (err) {
            console.error('Error loading briefs:', err)
            setError(err instanceof Error ? err.message : 'Failed to load briefs')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle brief card click
    const handleBriefClick = (briefId: string) => {
        router.push(`/streamlined-brief/${briefId}`);
    };

    // Handle brief deletion
    const handleDeleteBrief = async (briefId: string, briefTitle: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card click when clicking delete button
        
        const confirmed = window.confirm(`Are you sure you want to delete "${briefTitle}"? This action cannot be undone.`);
        
        if (!confirmed) return;
        
        try {
            console.log(`Attempting to delete brief: ${briefId}`);
            const response = await fetch(`/api/briefs/${briefId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.details || errorData.error || 'Failed to delete brief';
                throw new Error(errorMessage);
            }
            
            // Remove the brief from the local state
            setSavedBriefs(prevBriefs => prevBriefs.filter(brief => brief.id !== briefId));
            
            console.log('Brief deleted successfully');
        } catch (error) {
            console.error('Error deleting brief:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete brief. Please try again.';
            alert(errorMessage);
        }
    };

    // Filter and sort logic
    const filteredBriefs = savedBriefs.filter(brief => {
        const matchesSearch = brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            brief.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            brief.author.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesFilter = filterValue === "" || filterValue === "all" || brief.status.toLowerCase() === filterValue.toLowerCase()
        
        return matchesSearch && matchesFilter
    })

    const sortedBriefs = [...filteredBriefs].sort((a, b) => {
        switch (sortValue) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case "name":
                return a.title.localeCompare(b.title)
            case "name-desc":
                return b.title.localeCompare(a.title)
            default:
                return 0
        }
    })

    // return component
    return (
        <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto">
            
            {/* the top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-neutral-950 shadow-lg h-[60px] border-b border-neutral-800">
                
                {/* Left side - Search, Filter, Sort */}
                <div className="flex items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search briefs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 h-9 w-96 bg-transparent border border-neutral-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <Select value={filterValue} onValueChange={setFilterValue}>
                        <SelectTrigger className="w-32 border-none cursor-pointer">
                            <Filter className="size-4 mr-2 stroke-neutral-500 " />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-950 border border-neutral-700">
                            <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Status</SelectItem>
                            <SelectItem value="draft" className="cursor-pointer hover:bg-neutral-800">Draft</SelectItem>
                            <SelectItem value="in review" className="cursor-pointer hover:bg-neutral-800">In Review</SelectItem>
                            <SelectItem value="approved" className="cursor-pointer hover:bg-neutral-800">Approved</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort Dropdown */}
                    <Select value={sortValue} onValueChange={setSortValue}>
                        <SelectTrigger className="w-32 border-none cursor-pointer">
                                <ArrowUpDown className="size-4 mr-2 stroke-neutral-500" />
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-950 border border-neutral-700">
                            <SelectItem value="newest" className="cursor-pointer hover:bg-neutral-800">Newest</SelectItem>
                            <SelectItem value="oldest" className="cursor-pointer hover:bg-neutral-800">Oldest</SelectItem>
                            <SelectItem value="name" className="cursor-pointer hover:bg-neutral-800">Name A-Z</SelectItem>
                            <SelectItem value="name-desc" className="cursor-pointer hover:bg-neutral-800">Name Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Right side - Create Button */}
                <Link href="/streamlined-brief/create">
                    <Button 
                        className="gap-2 bg-blue-800 hover:bg-blue-700 cursor-pointer w-32 shadow-[0_0_12px_blue]"
                        >
                        <Plus className="size-4" />
                        Create
                    </Button>
                </Link>
            </div>

            {/* Briefs Grid */}
            <div className="p-6">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="size-8 text-blue-400 animate-spin mx-auto mb-4" />
                            <p className="text-neutral-400">Loading briefs...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <div className="text-red-400 mb-4">
                            <FileText className="size-16 mx-auto mb-2" />
                            <p className="text-lg font-semibold">Error loading briefs</p>
                            <p className="text-sm text-neutral-500">{error}</p>
                        </div>
                        <Button 
                            onClick={refreshBriefs}
                            className="gap-2 bg-red-800 hover:bg-red-700"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Briefs Grid */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedBriefs.map((brief) => (
                            <div 
                                key={brief.id} 
                                onClick={() => handleBriefClick(brief.id)}
                                className="flex flex-col justify-between bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors cursor-pointer group relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {/* <FileText className="size-5 text-blue-400" /> */}
                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                            {brief.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Status */}
                                        {/* <span className={`px-2 py-1 text-xs rounded-full ${
                                            brief.status === 'Approved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                            brief.status === 'In Review' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                                            'bg-gray-900/30 text-gray-400 border border-gray-800'
                                        }`}>
                                            {brief.status}
                                        </span> */}
                                        <button
                                            onClick={(e) => handleDeleteBrief(brief.id, brief.title, e)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-900/30 rounded-md text-red-400 hover:text-red-300"
                                            title="Delete brief"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-neutral-400 text-sm mb-4 line-clamp-2 bg-neutral-800/60 rounded-md px-4 py-2 h-24 border border-neutral-800">
                                    {brief.description}
                                </p>
                                
                                {/* Author and Date */}
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    {/* <div className="flex items-center gap-1">
                                        <User className="size-3" />
                                        <span>{brief.author}</span>
                                    </div> */}
                                    

                                    {/* Date */}
                                    <div className="flex items-center gap-1">
                                        <span className="mt-2">Created {new Date(brief.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && sortedBriefs.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="size-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-300 mb-2">No briefs found</h3>
                        <p className="text-neutral-500 mb-6">
                            {searchQuery || filterValue !== "" ? 
                                "Try adjusting your search or filter criteria" : 
                                "Get started by creating your first brief"
                            }
                        </p>
                        {!searchQuery && filterValue === "" && (
                            <Link href="/streamlined-brief/create">
                                <Button className="gap-2 bg-blue-800 hover:bg-blue-700">
                                    <Plus className="size-4" />
                                    Create Your First Brief
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}