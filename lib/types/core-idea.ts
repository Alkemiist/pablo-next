// Core Idea Types
// These are marketing ideas that can be translated into any tactic

export interface CoreIdea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  
  // The 4 variables used to generate this idea
  context: {
    brand: string;
    product: string;
    persona: string;
    trend: string;
  };
  
  // The core idea details
  ideaDetails: {
    // The core marketing concept that can be executed across any tactic
    coreConcept: string;
    
    // Why this idea is compelling
    whyItWorks: string;
    
    // The emotional hook
    emotionalHook: string;
    
    // How this relates to the current trend
    trendConnection: string;
    
    // The key mechanism that drives results
    keyMechanism: string;
    
    // What makes this unique
    uniqueAngle: string;
    
    // Examples of how this could be executed
    executionExamples: string[];
    
    // The target outcome
    targetOutcome: string;
  };
  
  // Metadata
  tags: string[];
  status: 'draft' | 'saved' | 'archived';
  author: string;
}

// Core Idea Metadata for listing
export interface CoreIdeaMetadata {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'saved' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  brand: string;
  product: string;
  persona: string;
  trend: string;
}

// Complete saved core idea with metadata and data
export interface SavedCoreIdea {
  metadata: CoreIdeaMetadata;
  data: CoreIdea;
}

// Request/Response types for API
export interface CreateCoreIdeaRequest {
  title: string;
  description: string;
  context: {
    brand: string;
    product: string;
    persona: string;
    trend: string;
  };
  ideaDetails: {
    coreConcept: string;
    whyItWorks: string;
    emotionalHook: string;
    trendConnection: string;
    keyMechanism: string;
    uniqueAngle: string;
    executionExamples: string[];
    targetOutcome: string;
  };
  tags?: string[];
}

export interface UpdateCoreIdeaRequest {
  title?: string;
  description?: string;
  tags?: string[];
  status?: 'draft' | 'saved' | 'archived';
}

export interface CoreIdeaListResponse {
  success: boolean;
  ideas: CoreIdeaMetadata[];
  total: number;
}

export interface CoreIdeaResponse {
  success: boolean;
  idea?: SavedCoreIdea;
  error?: string;
}

