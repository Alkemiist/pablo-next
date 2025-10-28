'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown, Plus, Sparkles, Calendar, Loader2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CoreIdeaMetadata } from "@/lib/types/core-idea"

export default function CoreIdeasPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const [sortValue, setSortValue] = useState("")
    const [savedIdeas, setSavedIdeas] = useState<CoreIdeaMetadata[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadIdeas = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/core-ideas')
                if (!response.ok) throw new Error('Failed to load core ideas')
                const data = await response.json()
                setSavedIdeas(data.ideas || [])
            } catch (err) {
                console.error('Error loading core ideas:', err)
                setError(err instanceof Error ? err.message : 'Failed to load core ideas')
            } finally {
                setIsLoading(false)
            }
        }
        loadIdeas()
    }, [])

    const refreshIdeas = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/core-ideas')
            if (!response.ok) throw new Error('Failed to load core ideas')
            const data = await response.json()
            setSavedIdeas(data.ideas || [])
        } catch (err) {
            console.error('Error loading core ideas:', err)
            setError(err instanceof Error ? err.message : 'Failed to load core ideas')
        } finally {
            setIsLoading(false)
        }
    }

    const handleIdeaClick = (ideaId: string) => {
        router.push(`/core-ideas/${ideaId}`);
    }

    const handleDeleteIdea = async (ideaId: string, ideaTitle: string, event: React.MouseEvent) => {
        event.stopPropagation();
        const confirmed = window.confirm(`Are you sure you want to delete "${ideaTitle}"? This action cannot be undone.`);
        if (!confirmed) return;
        try {
            const response = await fetch(`/api/core-ideas/${ideaId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete core idea');
            setSavedIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
        } catch (error) {
            console.error('Error deleting core idea:', error);
            alert('Failed to delete core idea. Please try again.');
        }
    }

    const filteredIdeas = savedIdeas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            idea.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            idea.product.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterValue === "" || filterValue === "all" || idea.status.toLowerCase() === filterValue.toLowerCase()
        return matchesSearch && matchesFilter
    })

    const sortedIdeas = [...filteredIdeas].sort((a, b) => {
        switch (sortValue) {
            case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case "name": return a.title.localeCompare(b.title)
            case "name-desc": return b.title.localeCompare(a.title)
            default: return 0
        }
    })

    return (
        <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-neutral-950 shadow-lg h-[60px] border-b border-neutral-800">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
                        <input type="text" placeholder="Search core ideas" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 h-9 w-96 bg-transparent border border-neutral-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                        />
                    </div>
                    <Select value={filterValue} onValueChange={setFilterValue}>
                        <SelectTrigger className="w-32 border-none cursor-pointer">
                            <Filter className="size-4 mr-2 stroke-neutral-500" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-950 border border-neutral-700">
                            <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Status</SelectItem>
                            <SelectItem value="draft" className="cursor-pointer hover:bg-neutral-800">Draft</SelectItem>
                            <SelectItem value="saved" className="cursor-pointer hover:bg-neutral-800">Saved</SelectItem>
                            <SelectItem value="archived" className="cursor-pointer hover:bg-neutral-800">Archived</SelectItem>
                        </SelectContent>
                    </Select>
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
                <Link href="/core-ideas/create">
                    <Button className="gap-2 bg-purple-800 hover:bg-purple-700 cursor-pointer w-32 shadow-[0_0_12px_rgba(147,51,234,0.5)]">
                        <Plus className="size-4" />
                        Create
                    </Button>
                </Link>
            </div>
            <div className="p-6">
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="size-8 text-purple-400 animate-spin mx-auto mb-4" />
                            <p className="text-neutral-400">Loading core ideas...</p>
                        </div>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <div className="text-red-400 mb-4">
                            <Sparkles className="size-16 mx-auto mb-2" />
                            <p className="text-lg font-semibold">Error loading core ideas</p>
                            <p className="text-sm text-neutral-500">{error}</p>
                        </div>
                        <Button onClick={refreshIdeas} className="gap-2 bg-red-800 hover:bg-red-700">Try Again</Button>
                    </div>
                )}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedIdeas.map((idea) => (
                            <div key={idea.id} onClick={() => handleIdeaClick(idea.id)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors cursor-pointer group relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-5 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{idea.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${idea.status === 'saved' ? 'bg-green-900/30 text-green-400 border border-green-800' : idea.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 'bg-gray-900/30 text-gray-400 border border-gray-800'}`}>{idea.status}</span>
                                        <button onClick={(e) => handleDeleteIdea(idea.id, idea.title, e)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-900/30 rounded-md text-red-400 hover:text-red-300" title="Delete core idea">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-neutral-400 text-sm mb-4 line-clamp-3 bg-neutral-800/60 rounded-md px-4 py-3 h-auto border border-neutral-800">{idea.description}</p>
                                <div className="mb-4 space-y-2">
                                    <div className="text-xs text-neutral-500"><span className="font-medium">Brand:</span> {idea.brand}</div>
                                    <div className="text-xs text-neutral-500"><span className="font-medium">Product:</span> {idea.product}</div>
                                    <div className="text-xs text-neutral-500"><span className="font-medium">Trend:</span> {idea.trend}</div>
                                </div>
                                {idea.tags && idea.tags.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {idea.tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-md border border-purple-700/50">{tag}</span>
                                            ))}
                                            {idea.tags.length > 3 && <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md">+{idea.tags.length - 3} more</span>}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && !error && sortedIdeas.length === 0 && (
                    <div className="text-center py-12">
                        <Sparkles className="size-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-300 mb-2">No core ideas found</h3>
                        <p className="text-neutral-500 mb-6">{searchQuery || filterValue !== "" ? "Try adjusting your search or filter criteria" : "Get started by creating your first core idea"}</p>
                        {!searchQuery && filterValue === "" && (
                            <Link href="/core-ideas/create">
                                <Button className="gap-2 bg-purple-800 hover:bg-purple-700">
                                    <Plus className="size-4" />
                                    Create Your First Idea
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
