// Tactic interface for the generated tactics
export interface Tactic {
  image: string; // Image URL or placeholder
  title: string; // Title for the tactic
  platform: string; // Platform/medium (e.g., "TikTok Post", "Instagram Reel")
  oneLinerSummary: string; // One-liner summary of tactic
  coreMessage: string; // Core message that captures the essence of the tactic (max 1 sentence)
  goal: string; // The goal of the tactic (max 1 sentence)
  fullDescription: string; // Full description of the idea (max 4 sentences)
  whyItWorks: string; // Why this is a great idea and how it works with the intel (max 4 sentences)
}

// Request interface for generating tactics
export interface GenerateTacticsRequest {
  brand: string;
  product: string;
  persona: string;
  goal: string;
  visualGuide: string;
  cardIndex?: number; // Optional: which card index we're generating
  generateSingle?: boolean; // Optional: generate only 1 tactic instead of 4
}

// Response interface for the API
export interface GenerateTacticsResponse {
  success: boolean;
  tactics: Tactic[];
  context: GenerateTacticsRequest;
}

// Error response interface
export interface ErrorResponse {
  error: string;
  details?: string;
} 