'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, Plus, Loader2, Calendar, Sprout } from 'lucide-react';
import { SeedMetadata, Seed } from '@/lib/seed-ideas-types';
import { getSeed } from '@/lib/seed-ideas-storage';
import CreateSeedModal from '@/app/components/seed-ideas/create-seed-modal';
import SeedDetailModal from '@/app/components/seed-ideas/seed-detail-modal';

export default function SeedIdeasPage() {
  const [seeds, setSeeds] = useState<SeedMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  // Load seeds function
  const loadSeeds = async () => {
    try {
      console.log('Loading seeds...');
      
      // Load from file storage
      const response = await fetch('/api/seed-ideas/files');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API result:', result);
        
        if (result.success && result.seeds) {
          console.log('Setting seeds:', result.seeds);
          setSeeds(result.seeds);
        } else {
          console.error('API returned success: false or no seeds');
          setError('Failed to load seeds from API');
        }
      } else {
        console.error('API request failed with status:', response.status);
        setError(`API request failed with status: ${response.status}`);
      }
      
    } catch (err) {
      console.error('Error loading seeds:', err);
      setError(err instanceof Error ? err.message : 'Failed to load seeds');
    }
  };

  // Load seeds from storage
  useEffect(() => {
    loadSeeds();
  }, []);

  // Refresh seeds when modal closes (after creation)
  const handleModalClose = async () => {
    setIsCreateModalOpen(false);
    
    // Reload seeds from file storage
    try {
      const response = await fetch('/api/seed-ideas/files');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSeeds(result.seeds);
        }
      }
    } catch (error) {
      console.error('Error reloading seeds:', error);
    }
  };

  // Handle seed card click
  const handleSeedClick = (seedId: string) => {
    // First try localStorage
    let seed = getSeed(seedId);
    
    // If not found in localStorage, try file storage
    if (!seed) {
      fetch(`/api/seed-ideas/files?id=${seedId}`)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            setSelectedSeed(result.seed);
          }
        })
        .catch(error => {
          console.warn('Failed to get seed from file storage:', error);
        });
    } else {
      setSelectedSeed(seed);
    }
  };

  // Handle detail modal close
  const handleDetailModalClose = async () => {
    setSelectedSeed(null);
    
    // Reload seeds from file storage
    try {
      const response = await fetch('/api/seed-ideas/files');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSeeds(result.seeds);
        }
      }
    } catch (error) {
      console.error('Error reloading seeds:', error);
    }
  };

  // Filter and sort logic
  const filteredSeeds = seeds.filter(seed => {
    const name = seed.name || '';
    const description = seed.description || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const sortedSeeds = [...filteredSeeds].sort((a, b) => {
    switch (sortValue) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Controls */}
      <div className="px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          {/* Left side - Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search seed ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 w-64"
              />
            </div>

            {/* Filter Dropdown */}
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-32 border-none cursor-pointer">
                <Filter className="size-4 mr-2 stroke-neutral-500" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border border-neutral-700">
                <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Seeds</SelectItem>
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
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-green-800 hover:bg-green-700 cursor-pointer w-32 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          >
            <Plus className="size-4" />
            Create
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="size-8 text-neutral-400 animate-spin mx-auto mb-4" />
              <p className="text-neutral-400">Loading seed ideas...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedSeeds.length === 0 && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <Sprout className="size-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-300 mb-2">No seed ideas found</h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery ? 
                  "Try adjusting your search criteria" : 
                  "Get started by creating your first seed idea"
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={loadSeeds}
                  className="gap-2 bg-blue-800 hover:bg-blue-700"
                >
                  <Plus className="size-4" />
                  Load Seeds
                </Button>
                {!searchQuery && (
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2 bg-green-800 hover:bg-green-700"
                  >
                    <Plus className="size-4" />
                    Create Your First Seed
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Seeds Grid */}
        {!isLoading && !error && sortedSeeds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSeeds.map((seed) => (
              <div 
                key={seed.id} 
                onClick={() => handleSeedClick(seed.id)}
                className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
              >
                {/* Header Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="size-4 text-green-400" />
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                          {seed.name}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                        {seed.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-400 capitalize">
                          seed
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Calendar className="size-3" />
                        <span>{new Date(seed.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Seed Modal */}
      {isCreateModalOpen && (
        <CreateSeedModal onClose={handleModalClose} />
      )}

      {/* Seed Detail Modal */}
      {selectedSeed && (
        <SeedDetailModal
          seed={selectedSeed}
          onClose={handleDetailModalClose}
          onEdit={handleDetailModalClose}
          onDelete={handleDetailModalClose}
        />
      )}
    </div>
  );
}

