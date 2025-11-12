// Simple file-based storage for seed ideas
import fs from 'fs';
import path from 'path';
import { Seed, SeedMetadata } from './seed-ideas-types';

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'seed-ideas');

// Ensure storage directory exists
const ensureStorageDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
};

// Read all seeds from files
export const loadSeedsFromFiles = (): SeedMetadata[] => {
  ensureStorageDir();
  
  const seeds: SeedMetadata[] = [];
  
  try {
    const files = fs.readdirSync(STORAGE_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(STORAGE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const seed = JSON.parse(content);
        
        seeds.push({
          id: seed.id,
          name: seed.name,
          type: 'seed',
          description: generateDescription(seed),
          createdAt: seed.createdAt,
          updatedAt: seed.updatedAt,
        });
      }
    }
  } catch (error) {
    console.error('Error loading seeds from files:', error);
  }
  
  return seeds;
};

// Generate description based on seed
const generateDescription = (seed: Seed): string => {
  return seed.dnaSummary ? `${seed.dnaSummary.substring(0, 120)}${seed.dnaSummary.length > 120 ? '...' : ''}` : 'No description available';
};

// Get individual seed from file
export const getSeedFromFile = (id: string): Seed | null => {
  ensureStorageDir();
  
  try {
    const fileName = `seed_${id}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading seed from file:', error);
  }
  
  return null;
};

// Write seed to file
export const writeSeed = (seed: Seed): boolean => {
  ensureStorageDir();
  
  try {
    const fileName = `seed_${seed.id}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing seed to file:', error);
    return false;
  }
};

// Delete seed file
export const deleteSeedFile = (id: string): boolean => {
  ensureStorageDir();
  
  try {
    const fileName = `seed_${id}.json`;
    const filePath = path.join(STORAGE_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting seed file:', error);
  }
  
  return false;
};

