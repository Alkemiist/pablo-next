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
        
        const displayTitle = briefTitle || 'Untitled Brief';
        const confirmed = window.confirm(`Are you sure you want to delete "${displayTitle}"? This action cannot be undone.`);
        
        if (!confirmed) return;
        
        try {
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
        } catch (error) {
            console.error('Error deleting brief:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete brief. Please try again.';
            alert(errorMessage);
        }
    };

    // Filter and sort logic
    const filteredBriefs = savedBriefs.filter(brief => {
        const matchesSearch = (brief.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (brief.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (brief.author || '').toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesFilter = filterValue === "" || filterValue === "all" || (brief.status || '').toLowerCase() === filterValue.toLowerCase()
        
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
        <div className="h-[calc(100vh-60px)] overflow-y-auto">
            
            {/* the top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-neutral-950 px-6 py-3 shadow-lg h-[60px] border-b border-neutral-800 w-full">
                
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
            <div className="px-6 py-6">
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
                                className="bg-neutral-900 rounded-2xl border border-green-800/30 overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 ease-out hover:border-green-400 hover:ring-1 hover:ring-green-400/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] cursor-pointer group relative"
                            >
                                {/* Visual Preview */}
                                <div className="h-48 w-full overflow-hidden relative">
                                    {brief.visualPreview ? (
                                        brief.visualPreview.includes('blob:') || brief.visualPreview.startsWith('data:') ? (
                                            <img
                                                src={brief.visualPreview}
                                                alt={brief.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                            />
                                        ) : (
                                            <img
                                                src={brief.visualPreview}
                                                alt={brief.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                            />
                                        )
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-green-900/20 via-neutral-800 to-blue-900/20 flex items-center justify-center">
                                            <FileText className="size-16 text-neutral-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                                    
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => handleDeleteBrief(brief.id, brief.title, e)}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300"
                                        title="Delete brief"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                                
                                {/* Content */}
                                <div className="p-5">
                                    <div className="text-xl font-semibold leading-tight text-white group-hover:text-green-300 transition-colors mb-2">
                                        {brief.title || 'Untitled Brief'}
                                    </div>
                                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                                        {brief.description || 'No description available'}
                                    </p>
                                    
                                    {/* Date */}
                                    {/* <div className="flex items-center justify-between text-xs text-neutral-500">
                                        <span>Created {new Date(brief.createdAt).toLocaleDateString()}</span>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && sortedBriefs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h- border border-neutral-700 rounded-2xl text-center py-12">
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