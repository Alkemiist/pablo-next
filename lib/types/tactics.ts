/**
 * Types for the tactics generation feature
 */

export interface Tactic {
  image: string;
  title: string;
  platform: string;
  oneLinerSummary: string;
  coreMessage: string;
  goal: string;
  fullDescription: string;
  whyItWorks: string;
  performanceHook?: string;
  influencerMatch?: string;
  imagePrompt?: string;
}

export interface GenerateTacticsRequest {
  brand: string;
  product: string;
  persona: string;
  goal: string;
  visualGuide: string;
  cardIndex?: number;
  generateSingle?: boolean;
}

export interface GenerateTacticsResponse {
  success: boolean;
  tactics: Tactic[];
  context: {
    brand: string;
    product: string;
    persona: string;
    goal: string;
    visualGuide: string;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
