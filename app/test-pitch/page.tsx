'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, Plus, FileText, Loader2, Calendar, User, Zap } from 'lucide-react';
import Link from 'next/link';
import TestPitchDocWizard from '@/app/components/pitch-doc/test-pitch-doc-wizard';
import { PitchDocIntake } from '@/lib/pitch-doc-types';
import { savePitchDoc, savePitchDocMetadata } from '@/lib/pitch-doc-storage';
import { Brand, Product, Persona } from '@/lib/variables-types';
import { getBrands, getProducts, getPersonas } from '@/lib/variables-storage';

type AppState = 'landing' | 'variable-selection' | 'wizard' | 'generating';

interface SelectedVariables {
  brand: Brand | null;
  product: Product | null;
  persona: Persona | null;
}

// Mock interface for pitch doc metadata - replace with actual type when available
interface PitchDocMetadata {
  id: string;
  title: string;
  description: string;
  brand: string;
  product: string;
  status: 'draft' | 'saved' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export default function TestPitchPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('landing');
  const [intakeData, setIntakeData] = useState<PitchDocIntake | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for variable selection
  const [selectedVariables, setSelectedVariables] = useState<SelectedVariables>({
    brand: null,
    product: null,
    persona: null,
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [savedPitchDocs, setSavedPitchDocs] = useState<PitchDocMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load pitch docs from storage/API
  useEffect(() => {
    const loadPitchDocs = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when available
        // For now, we'll use empty array to show empty state
        setSavedPitchDocs([]);
      } catch (err) {
        console.error('Error loading pitch docs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pitch docs');
      } finally {
        setIsLoading(false);
      }
    };

    loadPitchDocs();
  }, []);

  const handleStartWizard = () => {
    setAppState('variable-selection');
  };

  const handleVariableSelectionComplete = () => {
    setAppState('wizard');
  };

  const handleVariableSelectionClose = () => {
    setAppState('landing');
  };

  const handleWizardComplete = (data: PitchDocIntake) => {
    setIntakeData(data);
    setAppState('generating');
    generatePitchDoc(data);
  };

  const handleCloseWizard = () => {
    setAppState('landing');
  };

  const generatePitchDoc = async (data: PitchDocIntake) => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-test-pitch-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intakeData: data,
          selectedVariables,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pitch doc');
      }

      const result = await response.json();
      
      // Save the pitch doc to storage
      savePitchDoc(result.pitchDocId, result.pitchDoc);
      savePitchDocMetadata(result.metadata);
      
      // Navigate to the generated pitch doc page
      router.push(`/pitch-doc/${result.pitchDocId}`);
      
    } catch (error) {
      console.error('Error generating pitch doc:', error);
      // Handle error - maybe show error message
      setAppState('landing');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter and sort logic
  const filteredPitchDocs = savedPitchDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterValue === "" || filterValue === "all" || doc.status.toLowerCase() === filterValue.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const sortedPitchDocs = [...filteredPitchDocs].sort((a, b) => {
    switch (sortValue) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handlePitchDocClick = (docId: string) => {
    router.push(`/pitch-doc/${docId}`);
  };

  // Render different states
  if (appState === 'variable-selection') {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <VariableSelectionScreen 
            onComplete={handleVariableSelectionComplete} 
            onClose={handleVariableSelectionClose}
            selectedVariables={selectedVariables}
            setSelectedVariables={setSelectedVariables}
            brands={brands}
            setBrands={setBrands}
            products={products}
            setProducts={setProducts}
            personas={personas}
            setPersonas={setPersonas}
            isLoadingVariables={isLoadingVariables}
            setIsLoadingVariables={setIsLoadingVariables}
          />
        </div>
      </div>
    );
  }

  if (appState === 'wizard') {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <TestPitchDocWizard 
            onComplete={handleWizardComplete} 
            onClose={handleCloseWizard}
            initialData={intakeData || undefined}
            selectedVariables={selectedVariables}
          />
        </div>
      </div>
    );
  }

  if (appState === 'generating') {
    return (
      <div className="h-screen bg-black relative overflow-hidden">
        {/* Cyber Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.1),transparent_50%)] animate-pulse"></div>
        </div>
        
        {/* Matrix-style falling characters */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400/20 text-xs font-mono animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Generating Your Test Pitch</h2>
              <p className="text-neutral-300 text-lg leading-relaxed">
                Our AI is analyzing your inputs and creating a comprehensive pitch document with strategic insights, audience intelligence, and performance forecasts.
              </p>
            </div>

            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Analyzing brand context and product positioning</span>
              </div>
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-sm">Processing audience intelligence and cultural signals</span>
              </div>
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm">Generating creative expressions and strategic recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <span className="text-sm">Calculating performance forecasts and confidence ranges</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-sm text-neutral-400">
                This may take 30-60 seconds...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main landing page with same layout as pitch-brief
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto">
      
      {/* Top Bar - Matching Pitch Brief Screen */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-neutral-950 shadow-lg h-[60px] border-b border-neutral-800">
        
        {/* Left side - Search, Filter, Sort */}
        <div className="flex items-center gap-4">

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
            <input
              type="text"
              placeholder="Search test pitch docs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 h-9 w-96 bg-transparent border border-neutral-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
          </div>

          {/* Filter Dropdown */}
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
          onClick={handleStartWizard}
          className="gap-2 bg-green-800 hover:bg-green-700 cursor-pointer w-32 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
        >
          <Plus className="size-4" />
          Create
        </Button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="size-8 text-green-400 animate-spin mx-auto mb-4" />
              <p className="text-neutral-400">Loading test pitch docs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <FileText className="size-16 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading test pitch docs</p>
              <p className="text-sm text-neutral-500">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="gap-2 bg-red-800 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Pitch Docs Grid */}
        {!isLoading && !error && sortedPitchDocs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPitchDocs.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => handlePitchDocClick(doc.id)}
                className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:border-neutral-600 transition-colors cursor-pointer group relative"
              >
                {/* Header Section */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-3 mb-3">
                        {doc.description}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="ml-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'saved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                        doc.status === 'draft' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                        'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  {/* Brand & Product */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <User className="size-3" />
                      <span>{doc.brand}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <FileText className="size-3" />
                      <span>{doc.product}</span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800">
                    <div className="flex items-center gap-1">
                      <span>Test Pitch Doc</span>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedPitchDocs.length === 0 && (
          <div className="text-center py-12">
            <Zap className="size-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-300 mb-2">No test pitch docs found</h3>
            <p className="text-neutral-500 mb-6">
              {searchQuery || filterValue !== "" ? 
                "Try adjusting your search or filter criteria" : 
                "Get started by creating your first test pitch document with variable selection"
              }
            </p>
            {!searchQuery && filterValue === "" && (
              <Button 
                onClick={handleStartWizard}
                className="gap-2 bg-green-800 hover:bg-green-700"
              >
                <Plus className="size-4" />
                Create Your First Test Pitch Doc
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Variable Selection Screen Component
interface VariableSelectionScreenProps {
  onComplete: () => void;
  onClose: () => void;
  selectedVariables: SelectedVariables;
  setSelectedVariables: (variables: SelectedVariables | ((prev: SelectedVariables) => SelectedVariables)) => void;
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  personas: Persona[];
  setPersonas: (personas: Persona[]) => void;
  isLoadingVariables: boolean;
  setIsLoadingVariables: (loading: boolean) => void;
}

function VariableSelectionScreen({
  onComplete,
  onClose,
  selectedVariables,
  setSelectedVariables,
  brands,
  setBrands,
  products,
  setProducts,
  personas,
  setPersonas,
  isLoadingVariables,
  setIsLoadingVariables,
}: VariableSelectionScreenProps) {
  
  // Load variables when component mounts
  useEffect(() => {
    const loadVariables = async () => {
      try {
        setIsLoadingVariables(true);
        const [brandsData, productsData, personasData] = [
          getBrands(),
          getProducts(),
          getPersonas(),
        ];
        setBrands(brandsData);
        setProducts(productsData);
        setPersonas(personasData);
      } catch (error) {
        console.error('Error loading variables:', error);
      } finally {
        setIsLoadingVariables(false);
      }
    };

    loadVariables();
  }, [setBrands, setProducts, setPersonas, setIsLoadingVariables]);

  const isSelectionComplete = selectedVariables.brand && selectedVariables.product && selectedVariables.persona;

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-green-400" />
            <h1 className="text-lg font-semibold text-white">Select Variables</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={onComplete}
              disabled={!isSelectionComplete}
              className="gap-2 bg-green-800 hover:bg-green-700 disabled:bg-neutral-800 disabled:text-neutral-600"
            >
              Continue to Wizard
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-neutral-700 hover:bg-neutral-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Select Your Variables (Optional)</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Choose existing brands, products, and personas to pre-fill information in the wizard. 
              You can skip any or all variables and fill them manually in the wizard.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingVariables && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="size-8 text-green-400 animate-spin mx-auto mb-4" />
                <p className="text-neutral-400">Loading your variables...</p>
              </div>
            </div>
          )}

          {/* Selection Interface */}
          {!isLoadingVariables && (
            <div className="space-y-6 mb-8">
              
              {/* Brand Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-white mb-2">
                  Brand Selection
                  <span className="text-neutral-400 ml-2 text-xs">(Optional)</span>
                </label>
                
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  Choose an existing brand to pre-fill brand-related information in the wizard.
                </p>
                
                <Select 
                  value={selectedVariables.brand?.id || 'skip'} 
                  onValueChange={(value) => {
                    if (value === 'skip') {
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, brand: null }));
                    } else {
                      const brand = brands.find(b => b.id === value);
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, brand: brand || null }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm">
                    <SelectValue placeholder="Select a brand (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="skip" className="text-white hover:bg-neutral-800">
                      Skip brand selection
                    </SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id} className="text-white hover:bg-neutral-800">
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedVariables.brand && (
                  <div className="mt-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-400 mb-2">{selectedVariables.brand.name}</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                          <span className="font-medium">Mission:</span> {selectedVariables.brand.mission}
                        </p>
                        <p className="text-sm text-neutral-300">
                          <span className="font-medium">Tone:</span> {selectedVariables.brand.toneOfVoice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-white mb-2">
                  Product Selection
                  <span className="text-neutral-400 ml-2 text-xs">(Optional)</span>
                </label>
                
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  Choose an existing product to pre-fill product-related information in the wizard.
                </p>
                
                <Select 
                  value={selectedVariables.product?.id || 'skip'} 
                  onValueChange={(value) => {
                    if (value === 'skip') {
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, product: null }));
                    } else {
                      const product = products.find(p => p.id === value);
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, product: product || null }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm">
                    <SelectValue placeholder="Select a product (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="skip" className="text-white hover:bg-neutral-800">
                      Skip product selection
                    </SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id} className="text-white hover:bg-neutral-800">
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedVariables.product && (
                  <div className="mt-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-400 mb-2">{selectedVariables.product.name}</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                          <span className="font-medium">Category:</span> {selectedVariables.product.category}
                        </p>
                        <p className="text-sm text-neutral-300">
                          <span className="font-medium">Problem Solved:</span> {selectedVariables.product.problemSolved}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Persona Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-white mb-2">
                  Persona Selection
                  <span className="text-neutral-400 ml-2 text-xs">(Optional)</span>
                </label>
                
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  Choose an existing persona to pre-fill audience-related information in the wizard.
                </p>
                
                <Select 
                  value={selectedVariables.persona?.id || 'skip'} 
                  onValueChange={(value) => {
                    if (value === 'skip') {
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, persona: null }));
                    } else {
                      const persona = personas.find(p => p.id === value);
                      setSelectedVariables((prev: SelectedVariables) => ({ ...prev, persona: persona || null }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-neutral-900/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:border-green-500/70 focus:bg-neutral-900/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm">
                    <SelectValue placeholder="Select a persona (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="skip" className="text-white hover:bg-neutral-800">
                      Skip persona selection
                    </SelectItem>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id} className="text-white hover:bg-neutral-800">
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedVariables.persona && (
                  <div className="mt-4 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-400 mb-2">{selectedVariables.persona.name}</h4>
                        <p className="text-sm text-neutral-300 mb-2">
                          <span className="font-medium">Demographics:</span> {selectedVariables.persona.demographics}
                        </p>
                        <p className="text-sm text-neutral-300">
                          <span className="font-medium">Pain Points:</span> {selectedVariables.persona.painPoints}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {(selectedVariables.brand || selectedVariables.product || selectedVariables.persona) && (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Selected Variables</h3>
              </div>
              <div className="space-y-2 text-neutral-300">
                {selectedVariables.brand && <p>• <strong>Brand:</strong> {selectedVariables.brand.name}</p>}
                {selectedVariables.product && <p>• <strong>Product:</strong> {selectedVariables.product.name}</p>}
                {selectedVariables.persona && <p>• <strong>Persona:</strong> {selectedVariables.persona.name}</p>}
              </div>
              <p className="text-sm text-neutral-400 mt-4">
                The wizard will skip questions that are already answered by your selected variables.
              </p>
            </div>
          )}

          {/* Empty State */}
          {brands.length === 0 && products.length === 0 && personas.length === 0 && (
            <div className="text-center py-12">
              <Zap className="size-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-300 mb-2">No Variables Found</h3>
              <p className="text-neutral-500 mb-6">
                You can create brands, products, and personas in the Variables section to pre-fill information.
              </p>
              <Link href="/variables">
                <Button className="gap-2 bg-green-800 hover:bg-green-700">
                  <Plus className="size-4" />
                  Go to Variables
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
