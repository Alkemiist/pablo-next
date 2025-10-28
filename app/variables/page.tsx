'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, Plus, Loader2, Calendar, User, Component, Barcode, Brain, TrendingUp } from 'lucide-react';
import { VariableMetadata, VariableType, Brand, Product, Persona, Trend } from '@/lib/variables-types';
import { getAllVariables, getVariable } from '@/lib/variables-storage';
import { loadVariablesFromFiles, getVariableFromFile } from '@/lib/variables-file-storage';
import CreateVariableModal from '@/app/components/variables/create-variable-modal';
import VariableDetailModal from '@/app/components/variables/variable-detail-modal';

export default function VariablesPage() {
  const [variables, setVariables] = useState<VariableMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<{ variable: Brand | Product | Persona | Trend; type: VariableType } | null>(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  // Load variables function
  const loadVariables = async () => {
    try {
      console.log('Loading variables...');
      
      // Load from file storage
      const response = await fetch('/api/variables/files');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API result:', result);
        
        if (result.success && result.variables) {
          console.log('Setting variables:', result.variables);
          setVariables(result.variables);
        } else {
          console.error('API returned success: false or no variables');
          setError('Failed to load variables from API');
        }
      } else {
        console.error('API request failed with status:', response.status);
        setError(`API request failed with status: ${response.status}`);
      }
      
    } catch (err) {
      console.error('Error loading variables:', err);
      setError(err instanceof Error ? err.message : 'Failed to load variables');
    }
  };

  // Load variables from storage
  useEffect(() => {
    loadVariables();
  }, []);

  // Refresh variables when modal closes (after creation)
  const handleModalClose = async () => {
    setIsCreateModalOpen(false);
    
    // Reload variables from file storage
    try {
      const response = await fetch('/api/variables/files');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVariables(result.variables);
        }
      }
    } catch (error) {
      console.error('Error reloading variables:', error);
    }
  };

  // Handle variable card click
  const handleVariableClick = (variableId: string, type: VariableType) => {
    // First try localStorage
    let variable = getVariable(variableId, type);
    
    // If not found in localStorage, try file storage
    if (!variable) {
      fetch(`/api/variables/files?id=${variableId}&type=${type}`)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            setSelectedVariable({ variable: result.variable, type });
          }
        })
        .catch(error => {
          console.warn('Failed to get variable from file storage:', error);
        });
    } else {
      setSelectedVariable({ variable, type });
    }
  };

  // Handle detail modal close
  const handleDetailModalClose = async () => {
    setSelectedVariable(null);
    
    // Reload variables from file storage
    try {
      const response = await fetch('/api/variables/files');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVariables(result.variables);
        }
      }
    } catch (error) {
      console.error('Error reloading variables:', error);
    }
  };

  // Filter and sort logic
  const filteredVariables = variables.filter(variable => {
    const name = variable.name || '';
    const description = variable.description || '';
    const type = variable.type || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterValue === '' || filterValue === 'all' || variable.type === filterValue;
    
    return matchesSearch && matchesFilter;
  });

  const sortedVariables = [...filteredVariables].sort((a, b) => {
    switch (sortValue) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'type':
        return (a.type || '').localeCompare(b.type || '');
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: VariableType) => {
    switch (type) {
      case 'brand':
        return <Component className="size-4 text-blue-400" />;
      case 'product':
        return <Barcode className="size-4 text-green-400" />;
      case 'persona':
        return <Brain className="size-4 text-purple-400" />;
      case 'trend':
        return <TrendingUp className="size-4 text-orange-400" />;
      default:
        return <User className="size-4 text-neutral-400" />;
    }
  };

  const getTypeColor = (type: VariableType) => {
    switch (type) {
      case 'brand':
        return 'text-blue-400';
      case 'product':
        return 'text-green-400';
      case 'persona':
        return 'text-purple-400';
      case 'trend':
        return 'text-orange-400';
      default:
        return 'text-neutral-400';
    }
  };

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
                placeholder="Search variables..."
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
                <SelectItem value="all" className="cursor-pointer hover:bg-neutral-800">All Types</SelectItem>
                <SelectItem value="brand" className="cursor-pointer hover:bg-neutral-800">Brand</SelectItem>
                <SelectItem value="product" className="cursor-pointer hover:bg-neutral-800">Product</SelectItem>
                <SelectItem value="persona" className="cursor-pointer hover:bg-neutral-800">Persona</SelectItem>
                <SelectItem value="trend" className="cursor-pointer hover:bg-neutral-800">Trend</SelectItem>
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
                <SelectItem value="type" className="cursor-pointer hover:bg-neutral-800">Type</SelectItem>
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
              <p className="text-neutral-400">Loading variables...</p>
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
        {!isLoading && !error && sortedVariables.length === 0 && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <Component className="size-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-300 mb-2">No variables found</h3>
              <p className="text-neutral-500 mb-6">
                {searchQuery || filterValue !== "" ? 
                  "Try adjusting your search or filter criteria" : 
                  "Get started by creating your first variable"
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={loadVariables}
                  className="gap-2 bg-blue-800 hover:bg-blue-700"
                >
                  <Plus className="size-4" />
                  Load Variables
                </Button>
                {!searchQuery && filterValue === "" && (
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2 bg-green-800 hover:bg-green-700"
                  >
                    <Plus className="size-4" />
                    Create Your First Variable
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Variables Grid */}
        {!isLoading && !error && sortedVariables.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVariables.map((variable) => (
              <div 
                key={variable.id} 
                onClick={() => handleVariableClick(variable.id, variable.type)}
                className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative flex flex-col h-full"
              >
                {/* Header Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                        {variable.name}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                        {variable.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(variable.type)}
                        <span className={`text-sm font-medium capitalize ${getTypeColor(variable.type)}`}>
                          {variable.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Calendar className="size-3" />
                        <span>{new Date(variable.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Variable Modal */}
      {isCreateModalOpen && (
        <CreateVariableModal onClose={handleModalClose} />
      )}

      {/* Variable Detail Modal */}
      {selectedVariable && (
        <VariableDetailModal
          variable={selectedVariable.variable}
          type={selectedVariable.type}
          onClose={handleDetailModalClose}
          onEdit={handleDetailModalClose}
          onDelete={handleDetailModalClose}
        />
      )}
    </div>
  );
}