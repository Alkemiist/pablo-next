// Simple tactic interface
interface Tactic {
  id: string;
  name: string;
  title: string;
  description: string;
  oneLinerSummary?: string;
  platform?: string;
  coreMessage?: string;
  image?: string;
  goal?: string;
  whyItWorks?: string;
}

// Inspo Card Data Structure
export interface InspoCard {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  
  // Context data from inspo session
  context: {
    brand: string;
    product: string;
    persona: string;
    goal: string;
    visualGuide: string;
  };
  
  // Generated tactics
  tactics: Tactic[];
  
  // Generated content for each tactic
  generatedContent: {
    [tacticId: string]: {
      audienceJourney?: any;
      socialPost?: any;
      captionPack?: any;
      blogOutline?: any;
      emailCampaign?: any;
      influencerBrief?: any;
      evergreenPlan?: any;
      script?: any;
      agentChat?: any;
    };
  };
  
  // Visual assets
  visualAssets?: {
    uploadedImage?: string; // base64 or URL
    generatedImages?: string[];
  };
  
  // Metadata
  tags: string[];
  status: 'draft' | 'saved' | 'archived';
  author: string;
}

// Inspo Card Metadata for listing
export interface InspoCardMetadata {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'saved' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  tacticCount: number;
  brand: string;
  product: string;
  // Add image for card display
  imageUrl?: string;
}

// Complete saved inspo card with metadata and data
export interface SavedInspoCard {
  metadata: InspoCardMetadata;
  data: InspoCard;
}

// Request/Response types for API
export interface CreateInspoCardRequest {
  title: string;
  description: string;
  context: {
    brand: string;
    product: string;
    persona: string;
    goal: string;
    visualGuide: string;
  };
  tactics: Tactic[];
  generatedContent: {
    [tacticId: string]: {
      audienceJourney?: any;
      socialPost?: any;
      captionPack?: any;
      blogOutline?: any;
      emailCampaign?: any;
      influencerBrief?: any;
      evergreenPlan?: any;
      script?: any;
      agentChat?: any;
    };
  };
  visualAssets?: {
    uploadedImage?: string;
    generatedImages?: string[];
  };
  tags?: string[];
}

export interface UpdateInspoCardRequest {
  title?: string;
  description?: string;
  tags?: string[];
  status?: 'draft' | 'saved' | 'archived';
  generatedContent?: {
    [tacticId: string]: {
      audienceJourney?: any;
      socialPost?: any;
      captionPack?: any;
      blogOutline?: any;
      emailCampaign?: any;
      influencerBrief?: any;
      evergreenPlan?: any;
      script?: any;
      agentChat?: any;
    };
  };
}

export interface InspoCardListResponse {
  success: boolean;
  cards: InspoCardMetadata[];
  total: number;
}

export interface InspoCardResponse {
  success: boolean;
  card?: SavedInspoCard;
  error?: string;
}
