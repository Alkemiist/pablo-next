import { MarketingBriefDocument } from './streamlined-brief-types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Brief metadata structure
export interface BriefMetadata {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'In Review' | 'Approved';
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Complete brief with metadata and data
export interface SavedBrief {
  metadata: BriefMetadata;
  briefData: MarketingBriefDocument;
}

// Storage configuration
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'briefs');

// Helper function to ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Generate unique brief ID
export function generateBriefId(): string {
  return `brief_${uuidv4()}`;
}

// Save a brief to file
export async function saveBrief(briefData: MarketingBriefDocument, metadata: Omit<BriefMetadata, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  await ensureStorageDir();
  
  const id = generateBriefId();
  const now = new Date().toISOString();
  
  const savedBrief: SavedBrief = {
    metadata: {
      id,
      ...metadata,
      createdAt: now,
      updatedAt: now,
    },
    briefData
  };
  
  const filePath = path.join(STORAGE_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(savedBrief, null, 2));
  
  return id;
}

// Load a specific brief by ID
export async function loadBrief(id: string): Promise<SavedBrief | null> {
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return null;
  }
}

// Load all briefs (metadata only for listing)
export async function loadAllBriefs(): Promise<BriefMetadata[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    const briefFiles = files.filter(file => file.endsWith('.json'));
    
    const briefs: BriefMetadata[] = [];
    
    for (const file of briefFiles) {
      try {
        const filePath = path.join(STORAGE_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const savedBrief: SavedBrief = JSON.parse(fileContent);
        briefs.push(savedBrief.metadata);
      } catch (error) {
        console.error(`Error loading brief file ${file}:`, error);
      }
    }
    
    return briefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

// Update brief metadata
export async function updateBriefMetadata(id: string, updates: Partial<Omit<BriefMetadata, 'id' | 'createdAt'>>): Promise<boolean> {
  try {
    const savedBrief = await loadBrief(id);
    if (!savedBrief) return false;
    
    savedBrief.metadata = {
      ...savedBrief.metadata,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(savedBrief, null, 2));
    
    return true;
  } catch {
    return false;
  }
}

// Delete a brief
export async function deleteBrief(id: string): Promise<boolean> {
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    
    // Check if file exists first
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`File does not exist: ${filePath}`);
      return false;
    }
    
    await fs.unlink(filePath);
    console.log(`Successfully deleted brief: ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting brief ${id}:`, error);
    return false;
  }
}
