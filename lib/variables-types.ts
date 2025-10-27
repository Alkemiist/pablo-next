// Variable types and interfaces

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  mission: string;
  values: string[];
  personality: string[];
  toneOfVoice: string;
  competitors: string[];
  visualGuidelines: string;
  dosAndDonts: string;
  emotionalResponse: string;
  culturalTerritories: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  problemSolved: string;
  targetAudience: string;
  keyFeatures: string[];
  uniqueValueProposition: string;
  pricingStrategy: string;
  distributionChannels: string[];
  competitiveAdvantage: string;
  successMetrics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Persona {
  id: string;
  name: string;
  demographics: string;
  psychographics: string;
  emotionalDrivers: string[];
  valuesAspirations: string[];
  painPoints: string[];
  goalsMotivations: string[];
  mediaConsumption: string[];
  emotionalKeywords: string[];
  desiredTransformation: string;
  createdAt: string;
  updatedAt: string;
}

export type VariableType = 'brand' | 'product' | 'persona';

export type Variable = Brand | Product | Persona;

export interface VariableMetadata {
  id: string;
  name: string;
  type: VariableType;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Input types for creating/editing variables
export interface BrandInput {
  name: string;
  tagline: string;
  mission: string;
  values: string[];
  personality: string[];
  toneOfVoice: string;
  competitors: string[];
  visualGuidelines: string;
  dosAndDonts: string;
  emotionalResponse: string;
  culturalTerritories: string;
}

export interface ProductInput {
  name: string;
  category: string;
  problemSolved: string;
  keyFeatures: string[];
  emotionalBenefit: string;
  differentiation: string;
  originStory: string;
  userFeeling: string;
  proofPoints: string[];
  positioning: string;
  lifecycle: string;
}

export interface PersonaInput {
  name: string;
  demographics: string;
  psychographics: string;
  emotionalDrivers: string[];
  valuesAspirations: string[];
  painPoints: string[];
  goalsMotivations: string[];
  mediaConsumption: string[];
  emotionalKeywords: string[];
  desiredTransformation: string;
}

export type VariableInput = BrandInput | ProductInput | PersonaInput;