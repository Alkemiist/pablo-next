'use client'

// imports
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpDown, Plus, Lightbulb, Calendar, User, Loader2, Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { InspoCardMetadata } from "@/lib/types/inspo-card"

// The full component
export default function InspoLibraryPage() {
    const router = useRouter();

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("")
    const [sortValue, setSortValue] = useState("")
    const [savedCards, setSavedCards] = useState<InspoCardMetadata[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load inspo cards from API
    useEffect(() => {
        const loadCards = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/inspo-cards')
                
                if (!response.ok) {
                    throw new Error('Failed to load inspo cards')
                }
                
                const data = await response.json()
                setSavedCards(data.cards || [])
            } catch (err) {
                console.error('Error loading inspo cards:', err)
                setError(err instanceof Error ? err.message : 'Failed to load inspo cards')
            } finally {
                setIsLoading(false)
            }
        }

        loadCards()
    }, [])

    // Refresh cards function
    const refreshCards = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/inspo-cards')
            
            if (!response.ok) {
                throw new Error('Failed to load inspo cards')
            }
            
            const data = await response.json()
            setSavedCards(data.cards || [])
        } catch (err) {
            console.error('Error loading inspo cards:', err)
            setError(err instanceof Error ? err.message : 'Failed to load inspo cards')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle card click - view details
    const handleCardClick = (cardId: string) => {
        router.push(`/inspo/card/${cardId}`);
    };

    // Handle card deletion
    const handleDeleteCard = async (cardId: string, cardTitle: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card click when clicking delete button
        
        const confirmed = window.confirm(`Are you sure you want to delete "${cardTitle}"? This action cannot be undone.`);
        
        if (!confirmed) return;
        
        try {
            console.log(`Attempting to delete inspo card: ${cardId}`);
            const response = await fetch(`/api/inspo-cards/${cardId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.details || errorData.error || 'Failed to delete inspo card';
                throw new Error(errorMessage);
            }
            
            // Remove the card from the local state
            setSavedCards(prevCards => prevCards.filter(card => card.id !== cardId));
            
            console.log('Inspo card deleted successfully');
        } catch (error) {
            console.error('Error deleting inspo card:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete inspo card. Please try again.';
            alert(errorMessage);
        }
    };

    // Filter and sort logic
    const filteredCards = savedCards.filter(card => {
        const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            card.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            card.product.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesFilter = filterValue === "" || filterValue === "all" || card.status.toLowerCase() === filterValue.toLowerCase()
        
        return matchesSearch && matchesFilter
    })

    const sortedCards = [...filteredCards].sort((a, b) => {
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
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-neutral-950 shadow-lg h-[60px] border-b border-neutral-800">
                
                {/* Left side - Search, Filter, Sort */}
                <div className="flex items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search inspo cards"
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
                            <SelectItem value="saved" className="cursor-pointer hover:bg-neutral-800">Saved</SelectItem>
                            <SelectItem value="archived" className="cursor-pointer hover:bg-neutral-800">Archived</SelectItem>
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
                <Link href="/inspo/create-inspo">
                    <Button 
                        className="gap-2 bg-blue-800 hover:bg-blue-700 cursor-pointer w-32 shadow-[0_0_12px_blue]"
                        >
                        <Plus className="size-4" />
                        Create
                    </Button>
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="p-6">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="size-8 text-blue-400 animate-spin mx-auto mb-4" />
                            <p className="text-neutral-400">Loading inspo cards...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <div className="text-red-400 mb-4">
                            <Lightbulb className="size-16 mx-auto mb-2" />
                            <p className="text-lg font-semibold">Error loading inspo cards</p>
                            <p className="text-sm text-neutral-500">{error}</p>
                        </div>
                        <Button 
                            onClick={refreshCards}
                            className="gap-2 bg-red-800 hover:bg-red-700"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Cards Grid */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCards.map((card) => (
                            <div 
                                key={card.id} 
                                onClick={() => handleCardClick(card.id)}
                                className="flex flex-col justify-between bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-colors cursor-pointer group relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="size-5 text-yellow-400" />
                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Status */}
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            card.status === 'saved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                            card.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                                            'bg-gray-900/30 text-gray-400 border border-gray-800'
                                        }`}>
                                            {card.status}
                                        </span>
                                        <button
                                            onClick={(e) => handleDeleteCard(card.id, card.title, e)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-900/30 rounded-md text-red-400 hover:text-red-300"
                                            title="Delete inspo card"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-neutral-400 text-sm mb-4 line-clamp-2 bg-neutral-800/60 rounded-md px-4 py-2 h-24 border border-neutral-800">
                                    {card.description}
                                </p>
                                
                                {/* Brand & Product */}
                                <div className="mb-4 space-y-1">
                                    <div className="text-xs text-neutral-500">
                                        <span className="font-medium">Brand:</span> {card.brand}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        <span className="font-medium">Product:</span> {card.product}
                                    </div>
                                </div>

                                {/* Tags */}
                                {card.tags && card.tags.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {card.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md border border-blue-700/50"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {card.tags.length > 3 && (
                                                <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md">
                                                    +{card.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <span>{card.tacticCount} tactics</span>
                                    </div>
                                    
                                    {/* Date */}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && sortedCards.length === 0 && (
                    <div className="text-center py-12">
                        <Lightbulb className="size-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-neutral-300 mb-2">No inspo cards found</h3>
                        <p className="text-neutral-500 mb-6">
                            {searchQuery || filterValue !== "" ? 
                                "Try adjusting your search or filter criteria" : 
                                "Get started by creating your first inspo card"
                            }
                        </p>
                        {!searchQuery && filterValue === "" && (
                            <Link href="/inspo/create-inspo">
                                <Button className="gap-2 bg-blue-800 hover:bg-blue-700">
                                    <Plus className="size-4" />
                                    Create Your First Card
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
