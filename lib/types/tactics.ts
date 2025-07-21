// Tactic interface for the generated tactics
export interface Tactic {
  image: string; // Image prompt or URL
  title: string; // Title for the tactic
  oneLinerSummary: string; // One-liner summary of tactic
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