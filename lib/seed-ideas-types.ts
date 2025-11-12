// Seed ideas types and interfaces

export interface Seed {
  id: string;
  name: string;
  dnaSummary: string;
  originalCampaign: string;
  coreMechanism: string;
  psychologicalDrivers: string;
  culturalTension: string;
  archetypeAlignment: string;
  transferableEssence: string;
  contextDependencies: string;
  risksAndTradeoffs: string;
  formatAgnosticism: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeedMetadata {
  id: string;
  name: string;
  type: 'seed';
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating/editing seeds
export interface SeedInput {
  name: string;
  dnaSummary: string;
  originalCampaign: string;
  coreMechanism: string;
  psychologicalDrivers: string;
  culturalTension: string;
  archetypeAlignment: string;
  transferableEssence: string;
  contextDependencies: string;
  risksAndTradeoffs: string;
  formatAgnosticism: string;
}

