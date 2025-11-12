// Seed ideas storage utilities
// Handles localStorage operations for seed ideas

import { Seed, SeedInput } from './seed-ideas-types';

// Storage key
const SEEDS_KEY = 'seed_ideas';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Seed operations
export const saveSeed = async (seed: SeedInput): Promise<Seed> => {
  const newSeed: Seed = {
    ...seed,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isClient) {
    const existingSeeds = getSeeds();
    const updatedSeeds = [...existingSeeds, newSeed];
    localStorage.setItem(SEEDS_KEY, JSON.stringify(updatedSeeds));
    
    // Also save to file storage
    try {
      await fetch('/api/seed-ideas/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'seed',
          data: newSeed,
        }),
      });
    } catch (error) {
      console.warn('Failed to save to file storage:', error);
    }
  }
  
  return newSeed;
};

export const updateSeed = async (id: string, seed: SeedInput): Promise<Seed | null> => {
  if (!isClient) return null;

  const existingSeeds = getSeeds();
  const seedIndex = existingSeeds.findIndex(s => s.id === id);
  
  let updatedSeed: Seed;
  
  if (seedIndex === -1) {
    // Seed not in localStorage, create new entry
    updatedSeed = {
      ...seed,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existingSeeds.push(updatedSeed);
  } else {
    // Seed exists in localStorage, update it
    updatedSeed = {
      ...seed,
      id,
      createdAt: existingSeeds[seedIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    existingSeeds[seedIndex] = updatedSeed;
  }

  localStorage.setItem(SEEDS_KEY, JSON.stringify(existingSeeds));
  
  // Also save to file storage
  try {
    await fetch('/api/seed-ideas/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'seed',
        data: updatedSeed,
      }),
    });
  } catch (error) {
    console.warn('Failed to save to file storage:', error);
  }
  
  return updatedSeed;
};

export const getSeeds = (): Seed[] => {
  if (!isClient) return [];
  
  try {
    const seeds = localStorage.getItem(SEEDS_KEY);
    return seeds ? JSON.parse(seeds) : [];
  } catch (error) {
    console.error('Error loading seeds:', error);
    return [];
  }
};

export const getSeed = (id: string): Seed | null => {
  const seeds = getSeeds();
  return seeds.find(seed => seed.id === id) || null;
};

export const deleteSeed = (id: string): boolean => {
  if (!isClient) return false;

  const existingSeeds = getSeeds();
  const updatedSeeds = existingSeeds.filter(seed => seed.id !== id);
  
  if (updatedSeeds.length === existingSeeds.length) return false;
  
  localStorage.setItem(SEEDS_KEY, JSON.stringify(updatedSeeds));
  return true;
};

// Helper function for generating summary
export const generateSeedSummary = (seed: Seed): string => {
  return seed.dnaSummary ? `${seed.dnaSummary.substring(0, 120)}${seed.dnaSummary.length > 120 ? '...' : ''}` : 'No description available';
};

